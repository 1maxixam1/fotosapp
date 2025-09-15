import React from 'react'
import { Camera, ArrowLeft } from 'lucide-react'
export default function PublicList({ clients, onOpenClient, onBack }) {
  return (
    <div className="min-h-screen">
      <div className="bg-white/90 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="px-3 py-2 rounded border hover:bg-orange-50"><ArrowLeft size={16}/></button>
          <Camera className="text-amber-600" />
          <h2 className="font-semibold">Galerías públicas</h2>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(c => (
          <button key={c.code} onClick={() => onOpenClient(c)} className="bg-white rounded-xl border hover:shadow-lg transition text-left">
            <div className="p-4">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500 font-mono">{c.code}</div>
            </div>
            {c.publicPhotos?.[0] && <img src={c.publicPhotos[0]} alt="" className="w-full h-48 object-cover rounded-b-xl" />}
          </button>
        ))}
        {!clients.length && <p className="text-gray-600">No hay clientes aún.</p>}
      </div>
    </div>
  )
}
