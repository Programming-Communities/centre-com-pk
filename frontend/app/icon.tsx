// app/icon.tsx
import { ImageResponse } from 'next/og'


export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/svg+xml'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  )
}