import React, { useEffect, useRef } from 'react'
import { DoublePendulum } from './DoublePendulum'

const Index: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const doublePendulum = new DoublePendulum({
      useWebGL: false,
      canvas: canvasRef.current!,
    })

    window.requestAnimationFrame(doublePendulum.render.bind(doublePendulum))
  }, [])
  return (
    <div className='relative flex min-w-[300px] flex-col items-center justify-center sm:flex-row'>
      {/* Checkerboard background */}
      <div
        className='pointer-events-none absolute inset-0 opacity-20'
        style={{
          backgroundImage: `
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        }}
      />
      <canvas ref={canvasRef} className='relative z-10'>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  )
}

export default Index
