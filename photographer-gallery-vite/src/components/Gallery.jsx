import React from 'react'
import PhotoCard from './PhotoCard.jsx'
import { Image } from 'lucide-react'

const Gallery = ({ client, showPrivate, userPrivatePhotos = [] }) => {
  const photos = showPrivate
    ? [...(client?.publicPhotos || []), ...(userPrivatePhotos || [])]
    : client?.publicPhotos || []

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo + i}
              src={photo}
              label={`Foto ${i + 1}${i >= (client?.publicPhotos?.length || 0) && showPrivate ? ' · Privada' : ''}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Image className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">No hay fotos disponibles</p>
        </div>
      )}
    </div>
  )
}

export default Gallery
