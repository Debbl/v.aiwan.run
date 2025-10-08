import { Keyboard } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { DoublePendulum } from './DoublePendulum'

const Index: React.FC = () => {
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWebGLRef = useRef<HTMLCanvasElement | null>(null)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const doublePendulum = new DoublePendulum({
      useWebGL: false,
      canvas2d: canvas2dRef.current!,
      canvasWebGL: canvasWebGLRef.current!,
    })

    window.requestAnimationFrame(doublePendulum.render.bind(doublePendulum))

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          if (doublePendulum.running) {
            doublePendulum.stop()
          } else {
            doublePendulum.resume()
          }
          break
        case 'KeyA':
          doublePendulum.addPendulum()
          break
        case 'KeyD':
          doublePendulum.deletePendulum()
          break
        case 'KeyM':
          doublePendulum.toggleMode()
          break
      }
    }
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
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

      {/* Control panel */}
      <div
        className='group absolute left-4 top-4 z-20'
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => setShowControls(!showControls)}
      >
        {/* Keyboard icon - always visible */}
        <div className='flex size-10 cursor-pointer items-center justify-center rounded-lg bg-black/80 text-white backdrop-blur-sm transition-colors hover:bg-black/90'>
          <Keyboard size={18} />
        </div>

        {/* Controls panel - shown on hover (desktop) or click (mobile) */}
        <div
          className={`absolute left-0 top-12 rounded-lg bg-black/80 p-4 text-white backdrop-blur-sm transition-all duration-200 ${
            showControls
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <h3 className='mb-2 text-nowrap text-sm font-semibold'>
            Keyboard Controls
          </h3>
          <div className='space-y-1 whitespace-nowrap text-xs'>
            <div>
              <kbd className='rounded bg-gray-700 px-1 py-0.5'>Space</kbd>{' '}
              stop/resume
            </div>
            <div>
              <kbd className='rounded bg-gray-700 px-1 py-0.5'>A</kbd> Add
              Pendulum
            </div>
            <div>
              <kbd className='rounded bg-gray-700 px-1 py-0.5'>D</kbd> Delete
              Pendulum
            </div>
            <div>
              <kbd className='rounded bg-gray-700 px-1 py-0.5'>M</kbd> Toggle
              Mode
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvas2dRef} className='relative z-10'>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <canvas ref={canvasWebGLRef} className='relative z-10'>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  )
}

export default Index
