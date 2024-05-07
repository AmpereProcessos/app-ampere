import Image from 'next/image'
import React from 'react'

function Avatar({ url, width, height, fallback }) {
  if (!url)
    return (
      <div className="flex items-center justify-center rounded-full bg-gray-700" style={{ width: width, height: height }}>
        <p style={{ fontSize: width * 0.5 }} className="font-bold text-white">
          {fallback || 'U'}
        </p>
      </div>
    )
  return (
    <div style={{ width: width, height: height }} className="flex items-center justify-center">
      <Image src={url} alt="Avatar" fill={true} width={width} height={height} style={{ borderRadius: '100%' }} />
    </div>
  )
}

export default Avatar
