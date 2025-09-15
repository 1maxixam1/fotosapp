/**
 * Pequeño "DB" usando localStorage
 * Estructuras:
 * - clients: { [code]: { code, name, publicPhotos: string[], privatePhotos: string[] } }
 * - users:   { [code]: string[] } // IDs autorizados para ver privadas
 * - userPhotos: { [code]: { [userId]: string[] } } // fotos privadas por usuario
 * - admin:   { pin: string, master: { id: string, pass: string }, demo: { id: string, pass: string } } // credenciales
 */

const LS_KEYS = {
  clients: 'pg_clients',
  users: 'pg_users',
  userPhotos: 'pg_user_photos',
  admin: 'pg_admin',
}

const DEMO = {
  clients: {
    'LUNA2024': {
      code: 'LUNA2024',
      name: 'María Luna',
      publicPhotos: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      ],
      privatePhotos: [
        'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop'
      ]
    },
    'SOL2024': {
      code: 'SOL2024',
      name: 'Carlos Sol',
      publicPhotos: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&h=600&fit=crop'
      ],
      privatePhotos: [
        'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1430651867616-624fd4607726?w=800&h=600&fit=crop'
      ]
    }
  },
  users: {
    'LUNA2024': ['LUNA-001', 'LUNA-002'],
    'SOL2024': ['SOL-001']
  },
  userPhotos: {
    'LUNA2024': {
      'LUNA-001': [
        'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&h=600&fit=crop'
      ],
      'LUNA-002': [
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
      ]
    },
    'SOL2024': {
      'SOL-001': [
        'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop'
      ]
    }
  },
  admin: {
    pin: '1234',
    master: { id: 'brandon', pass: '1234' },
    demo: { id: 'max', pass: '1234' }
  }
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed() {
  if (!localStorage.getItem(LS_KEYS.clients)) save(LS_KEYS.clients, DEMO.clients);
  if (!localStorage.getItem(LS_KEYS.users)) save(LS_KEYS.users, DEMO.users);
  if (!localStorage.getItem(LS_KEYS.admin)) save(LS_KEYS.admin, DEMO.admin);
  if (!localStorage.getItem(LS_KEYS.userPhotos)) save(LS_KEYS.userPhotos, DEMO.userPhotos);
}

export function getClients() {
  return load(LS_KEYS.clients, {});
}

export function setClients(obj) {
  save(LS_KEYS.clients, obj);
}

export function upsertClient(client) {
  const all = getClients();
  all[client.code] = {
    code: client.code.toUpperCase(),
    name: client.name,
    publicPhotos: client.publicPhotos || [],
    privatePhotos: client.privatePhotos || [],
  };
  setClients(all);
}

export function deleteClient(code) {
  const all = getClients();
  delete all[code];
  setClients(all);
  const users = getUsersAll();
  delete users[code];
  setUsersAll(users);
  const up = getUserPhotosAll();
  delete up[code];
  setUserPhotosAll(up);
}

export function getUsersAll() {
  return load(LS_KEYS.users, {});
}

export function setUsersAll(obj) {
  save(LS_KEYS.users, obj);
}

export function getUsers(code) {
  const u = getUsersAll();
  return u[code] || [];
}

export function addUser(code, id) {
  const u = getUsersAll();
  u[code] = Array.from(new Set([...(u[code] || []), id]));
  setUsersAll(u);
  const up = getUserPhotosAll();
  up[code] = up[code] || {};
  up[code][id] = up[code][id] || [];
  setUserPhotosAll(up);
}

export function removeUser(code, id) {
  const u = getUsersAll();
  u[code] = (u[code] || []).filter(x => x !== id);
  setUsersAll(u);
  const up = getUserPhotosAll();
  if (up[code]) { delete up[code][id]; setUserPhotosAll(up); }
}

export function hasUser(code, id) {
  return getUsers(code).includes(id);
}

export function addPhoto(code, url, isPrivate) {
  const all = getClients();
  const c = all[code];
  if (!c) return;
  if (isPrivate) c.privatePhotos.push(url);
  else c.publicPhotos.push(url);
  setClients(all);
}

export function removePhoto(code, url, isPrivate) {
  const all = getClients();
  const c = all[code];
  if (!c) return;
  if (isPrivate) c.privatePhotos = c.privatePhotos.filter(x => x !== url);
  else c.publicPhotos = c.publicPhotos.filter(x => x !== url);
  setClients(all);
}



export function getUserPhotosAll() {
  return load(LS_KEYS.userPhotos, {});
}

export function setUserPhotosAll(obj) {
  save(LS_KEYS.userPhotos, obj);
}

export function getUserPhotos(code, userId) {
  const all = getUserPhotosAll();
  return (all[code]?.[userId]) || [];
}

export function addUserPhoto(code, userId, url) {
  const all = getUserPhotosAll();
  all[code] = all[code] || {};
  all[code][userId] = all[code][userId] || [];
  all[code][userId].push(url);
  setUserPhotosAll(all);
}

export function removeUserPhoto(code, userId, url) {
  const all = getUserPhotosAll();
  if (!all[code] || !all[code][userId]) return;
  all[code][userId] = all[code][userId].filter(x => x !== url);
  setUserPhotosAll(all);
}

export function getAdmin() {
  return load(LS_KEYS.admin, { pin: '1234', master: { id: 'brandon', pass: '1234' }, demo: { id: 'max', pass: '1234' } });
}
export function setAdminPin(pin) {
  const a = getAdmin(); a.pin = pin; save(LS_KEYS.admin, a);
}
export function setMasterCreds(id, pass) {
  const a = getAdmin(); a.master = { id, pass }; save(LS_KEYS.admin, a);
}
export function verifyMaster(id, pass) {
  const a = getAdmin();
  const ok = a.master && a.master.id === id && a.master.pass === pass
  const okDemo = a.demo && a.demo.id === id && a.demo.pass === pass
  return !!(ok || okDemo)
}

export function randomId(prefix='ID') {
  const n = Math.floor(1000 + Math.random()*9000);
  return `${prefix}-${n}`;
}
