import React from 'react'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100"></div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <div
            className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        </div>
      ))}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-200 to-transparent opacity-40"></div>
      <div className="absolute bottom-0 left-1/4 w-16 h-24 bg-amber-800 rounded-t-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/3 w-12 h-20 bg-orange-800 rounded-t-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-20 h-28 bg-red-900 rounded-t-full opacity-15 animate-pulse"></div>
    </div>
  )
}

export default AnimatedBackground
