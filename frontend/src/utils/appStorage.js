// Local storage utilities for users, session and bookings

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const KEYS = {
  users: 'pf_users',
  session: 'pf_session',
  bookings: 'pf_bookings'
};

export const userStore = {
  getAll() {
    const raw = localStorage.getItem(KEYS.users);
    return raw ? JSON.parse(raw) : [];
  },
  saveAll(users) {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  },
  create({ name, email, password }) {
    const users = this.getAll();
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    const user = { id: uid(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    this.saveAll(users);
    return user;
  },
  verify(email, password) {
    const users = this.getAll();
    const u = users.find(x => x.email === email && x.password === password);
    return u || null;
  },
  getById(id) {
    return this.getAll().find(u => u.id === id) || null;
  }
};

export const sessionStore = {
  get() {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  },
  set(user) {
    localStorage.setItem(KEYS.session, JSON.stringify({ userId: user.id }));
  },
  clear() {
    localStorage.removeItem(KEYS.session);
  },
  getCurrentUser() {
    const s = this.get();
    return s ? userStore.getById(s.userId) : null;
  }
};

import { parkingStorage } from './parkingStorage'

export const bookingStore = {
  getAll() {
    const raw = localStorage.getItem(KEYS.bookings);
    return raw ? JSON.parse(raw) : [];
  },
  saveAll(bookings) {
    localStorage.setItem(KEYS.bookings, JSON.stringify(bookings));
  },
  create({ userId, parking, startTime = new Date().toISOString(), durationHours = 1 }) {
    const booking = {
      id: uid(),
      userId,
      parkingId: parking.id,
      parkingName: parking.name,
      address: parking.address,
      pricePerHour: parking.price,
      startTime,
      durationHours,
      status: 'active'
    };
    const all = this.getAll();
    all.push(booking);
    this.saveAll(all);

    // Decrease available spots for the parking place (not below 0)
    const current = parkingStorage.getParkingPlaceById(parking.id);
    if (current) {
      const newAvailable = Math.max(0, (current.availableSpots || 0) - 1);
      parkingStorage.updateParkingPlace(current.id, { availableSpots: newAvailable });
    }
    return booking;
  },
  byUser(userId) {
    return this.getAll().filter(b => b.userId === userId);
  },
  activeByUser(userId) {
    return this.byUser(userId).filter(b => b.status === 'active');
  },
  historyByUser(userId) {
    return this.byUser(userId).filter(b => b.status !== 'active');
  },
  complete(bookingId, rating) {
    const all = this.getAll();
    const i = all.findIndex(b => b.id === bookingId);
    if (i >= 0) {
      all[i].status = 'completed';
      if (typeof rating === 'number') all[i].rating = rating;
      all[i].completedAt = new Date().toISOString();
      this.saveAll(all);

      // Restore available spot for the parking place (not above total)
      const p = parkingStorage.getParkingPlaceById(all[i].parkingId);
      if (p) {
        const newAvailable = Math.min((p.totalSpots || 0), (p.availableSpots || 0) + 1);
        parkingStorage.updateParkingPlace(p.id, { availableSpots: newAvailable });
      }
    }
  }
};
