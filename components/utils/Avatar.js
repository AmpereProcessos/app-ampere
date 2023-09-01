import Image from 'next/image'
import React from 'react'

function Avatar({ url, width, height, fallback }) {
  if (!url)
    return (
      <div className="rounded-full bg-gray-700 flex items-center justify-center" style={{ width: width, height: height }}>
        <p className="text-white font-bold">{fallback || 'U'}</p>
      </div>
    )
  return (
    <div style={{ width: width, height: height }} className="flex items-center justify-center">
      <Image src={url} alt="Avatar" fill={true} width={width} height={height} style={{ borderRadius: '100%' }} />
    </div>
  )
}

export default Avatar
