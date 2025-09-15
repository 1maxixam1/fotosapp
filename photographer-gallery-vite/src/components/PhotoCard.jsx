import React from 'react'

const PhotoCard = ({ src, label }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
      <img
        src={src}
        alt={label}
        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  )
}

export default PhotoCard
