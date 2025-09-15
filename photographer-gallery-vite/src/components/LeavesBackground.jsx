import React from 'react'
const LeavesBackground = () => {
  const leaves = Array.from({ length: 36 })
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100" />
      {leaves.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 8
        const duration = 10 + Math.random() * 12
        const size = 16 + Math.random() * 18
        const spin = Math.random() > 0.5 ? 'leaf-spin-a' : 'leaf-spin-b'
        return (
          <span
            key={i}
            className={`absolute leaf-fall ${spin}`}
            style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s`, fontSize: `${size}px`, top: '-5%' }}
          >🍂</span>
        )
      })}
    </div>
  )
}
export default LeavesBackground
