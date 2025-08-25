import Image from 'next/image'
import React from 'react'

function Avatar({ url, width, height, fallback }) {
  if (!url)
    return (
      <div className="bg-primary/70 flex items-center justify-center rounded-full" style={{ width: width, height: height }}>
        <p style={{ fontSize: width * 0.5 }} className="font-bold text-white">
          {fallback || 'U'}
        </p>
      </div>
    )
  return (
    <div
      style={{ width: width, height: height, minWidth: width, minHeight: height, maxWidth: width, maxHeight: height }}
      className="relative flex items-center justify-center"
    >
      <Image src={url} alt="Avatar" fill={true} style={{ borderRadius: '100%' }} />
    </div>
  )
}

export default Avatar
