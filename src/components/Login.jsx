import React, { useState } from 'react'
import { Camera, Unlock, Lock, Shield } from 'lucide-react'
export default function Login({ onPublic, onPrivate, onAdmin }) {
  const [id, setId] = useState('')
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/90 border border-orange-200 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Camera className="mx-auto mb-3 text-amber-600" size={48} />
          <h1 className="text-2xl font-semibold text-gray-800">Galería Fotográfica</h1>
          <p className="text-gray-600">Accede a tus recuerdos</p>
        </div>
        <div className="space-y-4">
          <button onClick={onPublic} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
            <Unlock size={18} /> Ver todas públicas
          </button>
          <div className="space-y-2">
            <input type="text" placeholder="Ingresa tu ID" value={id} onChange={e => setId(e.target.value)} className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-center font-mono tracking-wider" />
            <button onClick={() => onPrivate(id.trim())} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
              <Lock size={18} /> Entrar con ID
            </button>
          </div>
          <button onClick={onAdmin} className="w-full border border-orange-300 text-gray-700 hover:bg-orange-50 py-3 rounded-lg flex items-center justify-center gap-2">
            <Shield size={18} /> Administrador
          </button>
        </div>
      </div>
    </div>
  )
}
