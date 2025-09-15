import React from 'react'
import { Camera, LogOut, Shield } from 'lucide-react'

const Header = ({ title, subtitle, onLogout, onAdmin }) => {
  return (
    <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-orange-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Camera className="text-amber-600" size={24} />
          <div>
            <h2 className="font-medium text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!!onAdmin && (
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Shield size={18} />
              Admin
            </button>
          )}
          {!!onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={18} />
              Salir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
