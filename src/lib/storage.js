import { idbPutImage, idbGetImage, idbDeleteImage } from './idb.js'

const LS_CLIENTS = 'pg_clients'
const LS_ADMIN = 'pg_admin'

function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function load(key, def) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def }
  catch { return def }
}

// Seed data
(function seed() {
  if (!load(LS_CLIENTS, null)) {
    const clients = {
      'LUNA2024': {
        code: 'LUNA2024',
        name: 'María Luna',
        publicPhotos: [
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60'
        ],
        privatePhotos: [
          'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&auto=format&fit=crop&q=60'
        ],
        users: ['LUNA-001'],
        userPhotos: { 'LUNA-001': [] }
      },
      'SOL2024': {
        code: 'SOL2024',
        name: 'Carlos Sol',
        publicPhotos: [
          'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&auto=format&fit=crop&q=60'
        ],
        privatePhotos: [],
        users: ['SOL-001'],
        userPhotos: { 'SOL-001': [] }
      }
    }
    save(LS_CLIENTS, clients)
  }
  if (!load(LS_ADMIN, null)) {
    save(LS_ADMIN, { pin: '1234' })
  }
})()

// --- Clients ---
export function getClients() { return load(LS_CLIENTS, {}) }
export function getClient(code) { return getClients()[code] || null }
function setClients(v) { save(LS_CLIENTS, v) }

export function upsertClient(c) {
  const cs = getClients()
  const prev = cs[c.code] || {}
  cs[c.code] = {
    ...prev,
    ...c,
    users: prev.users || [],
    userPhotos: prev.userPhotos || {},
    publicPhotos: prev.publicPhotos || [],
    privatePhotos: prev.privatePhotos || []
  }
  setClients(cs)
}

export function deleteClient(code) {
  const cs = getClients()
  if (!cs[code]) return
  // Clean any idb: refs
  for (const u of cs[code].publicPhotos || []) deleteImageIfIdb(u)
  for (const u of cs[code].privatePhotos || []) deleteImageIfIdb(u)
  for (const arr of Object.values(cs[code].userPhotos || {})) {
    for (const u of arr) deleteImageIfIdb(u)
  }
  delete cs[code]
  setClients(cs)
}

export function getClientByUserId(userId) {
  const cs = getClients()
  for (const c of Object.values(cs)) {
    if ((c.users || []).includes(userId)) return c
  }
  return null
}

// --- Users ---
export function getUsers(code) { return getClient(code)?.users || [] }
export function addUser(code, id) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  if (!c.users.includes(id)) c.users.push(id)
  if (!c.userPhotos[id]) c.userPhotos[id] = []
  setClients(cs)
}
export function removeUser(code, id) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  c.users = c.users.filter(u => u !== id)
  delete c.userPhotos[id]
  setClients(cs)
}

// --- Photos (client-level) ---
export function addPhoto(code, ref, isPrivate=false) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  if (isPrivate) c.privatePhotos.push(ref)
  else c.publicPhotos.push(ref)
  setClients(cs)
}
export function removePhoto(code, url, isPrivate=false) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  if (isPrivate) c.privatePhotos = c.privatePhotos.filter(u => u !== url)
  else c.publicPhotos = c.publicPhotos.filter(u => u !== url)
  setClients(cs)
  deleteImageIfIdb(url)
}

// --- Photos by user ---
export function getUserPhotos(code, id) {
  const c = getClient(code); if (!c) return []
  return c.userPhotos[id] || []
}
export function addUserPhoto(code, id, ref) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  if (!c.userPhotos[id]) c.userPhotos[id] = []
  c.userPhotos[id].push(ref)
  setClients(cs)
}
export function removeUserPhoto(code, id, url) {
  const cs = getClients(); const c = cs[code]; if (!c) return
  if (!c.userPhotos[id]) return
  c.userPhotos[id] = c.userPhotos[id].filter(u => u !== url)
  setClients(cs)
  deleteImageIfIdb(url)
}

// --- Admin ---
export function getAdmin() { return load(LS_ADMIN, { pin: '1234' }) }
export function setAdminPin(pin) { const a = getAdmin(); a.pin = pin; save(LS_ADMIN, a) }

// --- Utility IDs ---
export function randomId(prefix='ID') {
  const n = Math.floor(100 + Math.random()*900)
  return `${prefix}-${n}`
}

// --- Image helpers with IndexedDB ---
export function randomKey(prefix='img') {
  const p = Math.random().toString(36).slice(2,8)
  const s = Date.now().toString(36)
  return `${prefix}_${p}_${s}`
}

export async function saveImageFromFile(file) {
  const key = randomKey('img')
  const blob = file
  await idbPutImage(key, blob)
  return 'idb:' + key
}

export async function saveImageFromDataUrl(dataUrl) {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8 = new Uint8Array(n)
  while (n--) u8[n] = bstr.charCodeAt(n)
  const blob = new Blob([u8], { type: mime })
  const key = randomKey('img')
  await idbPutImage(key, blob)
  return 'idb:' + key
}

export async function deleteImageIfIdb(ref) {
  if (typeof ref === 'string' && ref.startsWith('idb:')) {
    const key = ref.slice(4)
    await idbDeleteImage(key)
  }
}

export async function getImageObjectUrl(ref) {
  if (typeof ref === 'string' && ref.startsWith('idb:')) {
    const key = ref.slice(4)
    const blob = await idbGetImage(key)
    if (!blob) return null
    return URL.createObjectURL(blob)
  }
  return ref
}
