import React, { useMemo, useState } from 'react'
import { Shield, Plus, Trash2, KeyRound, UserPlus, Images, Save } from 'lucide-react'
import {
  getClients, upsertClient, deleteClient,
  getUsers, addUser, removeUser,
  addPhoto, removePhoto, getAdmin, setAdminPin, randomId,
  getUserPhotos, addUserPhoto, removeUserPhoto
} from '../lib/storage.js'

const Admin = ({ onExit }) => {
  const [clients, setClientsState] = useState(getClients())
  const [selected, setSelected] = useState(Object.keys(clients)[0] || '')
  const [pinInput, setPinInput] = useState('')
  const [authed, setAuthed] = useState(false)

  const admin = useMemo(() => getAdmin(), [])

  const [form, setForm] = useState({ code: '', name: '' })
  const [selectedUser, setSelectedUser] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [userPhotoUrl, setUserPhotoUrl] = useState('')
  const [newPin, setNewPin] = useState('')
  const [clientFile, setClientFile] = useState(null)
  const [userFile, setUserFile] = useState(null)

  const refresh = () => setClientsState(getClients())

  const doAuth = () => {
    if (pinInput === admin.pin) {
      setAuthed(true)
    } else {
      alert('PIN incorrecto')
    }
  }

  const createOrUpdateClient = () => {
    if (!form.code || !form.name) return alert('Completa código y nombre')
    upsertClient({ ...form, code: form.code.toUpperCase() })
    setForm({ code: '', name: '' })
    refresh()
  }

  const doDeleteClient = (code) => {
    if (confirm('¿Eliminar cliente y sus datos?')) {
      deleteClient(code)
      setSelected('')
      refresh()
    }
  }

  const addPhotoToClient = async () => {
    if (!selected) return
    if (clientFile) {
      const dataUrl = await fileToDataUrl(clientFile)
      addPhoto(selected, dataUrl, isPrivate)
      setClientFile(null)
      setPhotoUrl('')
      refresh()
      return
    }
    if (photoUrl) {
      addPhoto(selected, photoUrl, isPrivate)
      setPhotoUrl('')
      refresh()
      return
    }
    alert('Selecciona un archivo o ingresa una URL')
  }

  const removePhotoFromClient = (url, priv) => {
    removePhoto(selected, url, priv)
    refresh()
  }

  const addPhotoToUser = async () => {
    if (!selected || !selectedUser) { alert('Selecciona un usuario'); return }
    if (userFile) {
      const dataUrl = await fileToDataUrl(userFile)
      addUserPhoto(selected, selectedUser, dataUrl)
      setUserFile(null)
      setUserPhotoUrl('')
      refresh()
      return
    }
    if (userPhotoUrl) {
      addUserPhoto(selected, selectedUser, userPhotoUrl)
      setUserPhotoUrl('')
      refresh()
      return
    }
    alert('Selecciona un archivo o ingresa una URL')
  }

  const removePhotoFromUser = (url) => {
    if (!selected || !selectedUser) return
    removeUserPhoto(selected, selectedUser, url)
    refresh()
  }

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const onPickClientFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const dataUrl = await fileToDataUrl(f)
    if (!selected) return
    addPhoto(selected, dataUrl, isPrivate)
    refresh()
    e.target.value = ''
  }

  const onPickUserFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!selected || !selectedUser) return alert('Selecciona un usuario')
    const dataUrl = await fileToDataUrl(f)
    addUserPhoto(selected, selectedUser, dataUrl)
    refresh()
    e.target.value = ''
  }

  const addUserId = () => {
    if (!selected) return
    const id = randomId(selected.split(/[0-9]/)[0] || 'ID')
    addUser(selected, id)
    refresh()
  }

  const addCustomUserId = (id) => {
    if (!selected || !id) return
    addUser(selected, id)
    refresh()
  }

  const removeUserId = (id) => {
    removeUser(selected, id)
    refresh()
  }

  const updatePin = () => {
    if (!newPin) return
    setAdminPin(newPin)
    alert('PIN actualizado')
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 border border-orange-200 rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-amber-600" />
            <h2 className="text-xl font-semibold">Modo Administrador</h2>
          </div>
          <label className="block text-sm mb-2">PIN de administrador</label>
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />
          <button
            onClick={doAuth}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg"
          >
            Acceder
          </button>
          <p className="text-xs text-gray-500 mt-3">PIN por defecto: 1234 (puedes cambiarlo luego)</p>
        </div>
      </div>
    )
  }

  const sel = clients[selected] || null
  const users = sel ? getUsers(sel.code) : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="text-amber-600" />
          <h2 className="text-xl font-semibold">Panel Admin</h2>
        </div>
        <button onClick={onExit} className="px-3 py-2 rounded-lg border">Volver</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda: clientes */}
        <div className="bg-white/80 border rounded-xl p-4">
          <h3 className="font-semibold mb-3">Clientes</h3>
          <div className="space-y-2 max-h-80 overflow-auto pr-1">
            {Object.values(clients).map(c => (
              <div key={c.code} className={`flex items-center justify-between p-2 rounded-lg ${selected === c.code ? 'bg-orange-100' : 'hover:bg-orange-50'}`}>
                <button onClick={() => setSelected(c.code)} className="text-left">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{c.code}</div>
                </button>
                <button onClick={() => doDeleteClient(c.code)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-semibold text-amber-800">Nuevo / Editar</h4>
            <input
              placeholder="Código (ej: LUNA2024)"
              className="w-full px-3 py-2 border rounded-lg"
              value={form.code}
              onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))}
            />
            <input
              placeholder="Nombre"
              className="w-full px-3 py-2 border rounded-lg"
              value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
            />
            <button onClick={createOrUpdateClient} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
              <Plus size={16} /> Guardar
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-semibold text-amber-800 flex items-center gap-2"><KeyRound size={16}/> PIN Admin</h4>
            <input
              placeholder="Nuevo PIN"
              className="w-full px-3 py-2 border rounded-lg"
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
            />
            <button onClick={updatePin} className="w-full bg-gray-800 hover:bg-black text-white py-2 rounded-lg">
              Actualizar PIN
            </button>
          </div>
        </div>

        {/* Columna centro-derecha */}
        <div className="bg-white/80 border rounded-xl p-4 md:col-span-2">
          {sel ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Images className="text-amber-600" />
                <h3 className="font-semibold">Fotos de {sel.name}</h3>
              </div>

              
                
              {/* Selección de usuario para fotos privadas */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Usuarios del cliente</h4>
                <div className="flex flex-wrap gap-2">
                  {users.map(id => (
                    <button key={id} onClick={() => setSelectedUser(id)} className={`px-3 py-1 rounded-full border ${selectedUser===id ? 'bg-amber-100 border-amber-400' : ''}`}>
                      <code className="font-mono">{id}</code>
                    </button>
                  ))}
                </div>
                {!users?.length && <p className="text-sm text-gray-500 mt-2">No hay usuarios todavía. Genera o agrega uno.</p>}
              </div>


              {/* Agregar foto a nivel cliente (pública/privada global) */}
              <div className="mb-3 space-y-2">
                <input
                  placeholder="URL de la foto (opcional)"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
                <input type="file" accept="image/*" onChange={e => setClientFile(e.target.files?.[0] || null)} />
                <label className="inline-flex items-center gap-2" title="Definir si la foto es privada global del cliente">
                  <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                  <span>Privada (global del cliente)</span>
                </label>
                <button onClick={addPhotoToClient} className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2">
                  <Plus size={16}/> Agregar
                </button>
              </div>

              {/* Grid de fotos del cliente */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {sel.publicPhotos.map(u => (
                  <div key={u} className="relative group">
                    <img src={u} className="w-full h-32 object-cover rounded-lg border" />
                    <div className="absolute top-1 right-1 hidden group-hover:block">
                      <button onClick={() => removePhotoFromClient(u,false)} className="bg-white/90 border rounded p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs mt-1">Pública</div>
                  </div>
                ))}
                {sel.privatePhotos.map(u => (
                  <div key={u} className="relative group">
                    <img src={u} className="w-full h-32 object-cover rounded-lg border" />
                    <div className="absolute top-1 right-1 hidden group-hover:block">
                      <button onClick={() => removePhotoFromClient(u,true)} className="bg-white/90 border rounded p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs mt-1">Privada (global)</div>
                  </div>
                ))}
              </div>

              {/* Fotos privadas por usuario (si hay uno seleccionado) */}
              {selectedUser && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Fotos privadas de <code className='font-mono'>{selectedUser}</code></h4>
                  <div className="mb-3 space-y-2">
                    <input
                      placeholder="URL de la foto privada (opcional)"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={userPhotoUrl}
                      onChange={e => setUserPhotoUrl(e.target.value)}
                    />
                    <input type="file" accept="image/*" onChange={e => setUserFile(e.target.files?.[0] || null)} />
                    <button onClick={addPhotoToUser} className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">Agregar a usuario</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUserPhotos(sel.code, selectedUser).map(u => (
                      <div key={u} className="relative group">
                        <img src={u} className="w-full h-32 object-cover rounded-lg border" />
                        <div className="absolute top-1 right-1 hidden group-hover:block">
                          <button onClick={() => removePhotoFromUser(u)} className="bg-white/90 border rounded p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!getUserPhotos(sel.code, selectedUser).length && (
                      <p className="text-sm text-gray-500">Este usuario aún no tiene fotos privadas.</p>
                    )}
                  </div>
                </div>
              )}

              {/* IDs autorizados */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="text-amber-600" />
                  <h3 className="font-semibold">IDs autorizados</h3>
                </div>
                <div className="mb-3 space-y-2">
                  <button onClick={addUserId} className="px-3 py-2 rounded-lg border flex items-center gap-2">
                    <Plus size={16}/> Generar ID
                  </button>
                  <CustomIdInput onSubmit={addCustomUserId} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {users.map(id => (
                    <span key={id} className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                      <code className="font-mono">{id}</code>
                      <button onClick={() => removeUserId(id)} title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">Selecciona un cliente para ver/editar sus fotos y usuarios.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const CustomIdInput = ({ onSubmit }) => {
  const [v, setV] = useState('')
  return (
    <div className="flex gap-2">
      <input
        placeholder="ID personalizado (ej: LUNA-003)"
        className="px-3 py-2 border rounded-lg"
        value={v}
        onChange={e => setV(e.target.value)}
      />
      <button onClick={() => { onSubmit(v); setV('') }} className="px-3 py-2 rounded-lg border">
        <Save size={16}/> Agregar
      </button>
    </div>
  )
}

export default Admin
