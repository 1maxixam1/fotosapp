
import React, { useState } from 'react'
import { Camera, Unlock, Lock } from 'lucide-react'

const Login = ({ onPublic, onPrivate, onMaster }) => {
  const [userId, setUserId] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="-z-10 absolute inset-0">
        {/* Background injected by parent */}
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 border border-orange-200">
        <div className="text-center mb-8">
          <Camera className="mx-auto mb-4 text-amber-600" size={48} />
          <h1 className="text-3xl font-light text-gray-800 mb-2">Galería Fotográfica</h1>
          <p className="text-gray-600">Accede a tus recuerdos especiales</p>
        </div>

        <div className="space-y-4">
          {/* Campo para ID de usuario privado */}
          <input
            type="text"
            placeholder="Ingresa tu ID (privadas)"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-center font-mono"
          />

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onPublic()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Unlock size={20} />
              Ver todas públicas
            </button>
            <button
              onClick={() => onPrivate(userId)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Lock size={20} />
              Entrar con ID
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onMaster()}
              className="w-full border border-amber-300 hover:bg-amber-50 text-amber-800 py-3 rounded-lg transition-colors"
            >
              Administrador (PIN)
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-3">
            Para ver <strong>públicas</strong>: entra directo con el botón.<br/>
            Para <strong>privadas</strong>: ingresa tu <strong>ID</strong> asignado por el administrador.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
