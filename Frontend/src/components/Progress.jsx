import React from 'react'

const Progress = ({ progress = 0, total = 5, color, bgColor }) => {
  return (
    <div className="flex gap-1.5">
      {[...Array(total)].map((_, index) => (
        <div 
          key={index} 
          className={`w-2 h-2 rounded transition-all ${index < progress ? "bg-cyan-500" : "bg-cyan-100"}`}
          style={{
            backgroundColor: index < progress 
              ? color || "rgb(6,182,212)"  // cyan-500 as default
              : bgColor || "rgb(207,250,254)"  // cyan-100 as default
          }}
        >
        </div>
      ))}
    </div>
  )
}

export default Progress;