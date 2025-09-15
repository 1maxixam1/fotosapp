import React, { useEffect, useMemo, useState } from 'react'
import { Camera, ArrowLeft } from 'lucide-react'
import { getClient, getUserPhotos, getImageObjectUrl } from '../lib/storage.js'
export default function Gallery({ clientCode, userId, onBack }) {
  const client = useMemo(() => getClient(clientCode), [clientCode])
  const [photos, setPhotos] = useState([])
  useEffect(() => {
    let alive = true
    ;(async () => {
      const base = client ? [...(client.publicPhotos||[])] : []
      if (client && userId) {
        base.push(...(client.privatePhotos||[]))
        base.push(...getUserPhotos(client.code, userId))
      }
      const resolved = await Promise.all(base.map(async (p) => {
        if (typeof p === 'string' && p.startsWith('idb:')) {
          const url = await getImageObjectUrl(p)
          return url || ''
        }
        return p
      }))
      if (alive) setPhotos(resolved.filter(Boolean))
    })()
    return () => { alive = false }
  }, [clientCode, userId])
  if (!client) return (<div className="p-6"><button onClick={onBack} className="px-3 py-2 rounded border">Volver</button><p className="mt-3">Cliente no encontrado.</p></div>)
  return (
    <div className="min-h-screen">
      <div className="bg-white/90 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-3 py-2 rounded border hover:bg-orange-50"><ArrowLeft size={16}/></button>
            <Camera className="text-amber-600" />
            <div>
              <h2 className="font-medium text-gray-800">{client.name}</h2>
              <p className="text-sm text-gray-600">{userId ? 'Acceso privado' : 'Público'} • {photos.length} fotos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {photos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((p, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border">
                <img src={p} alt={`Foto ${i+1}`} className="w-full h-64 object-cover" />
                <div className="p-3 text-sm text-gray-600">Foto {i+1}</div>
              </div>
            ))}
          </div>
        ) : (<p className="text-gray-600">No hay fotos.</p>)}
      </div>
    </div>
  )
}
