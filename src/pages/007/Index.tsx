import React, { useEffect, useRef } from 'react'
import { DoublePendulum } from './DoublePendulum'

const Index: React.FC = () => {
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWebGLRef = useRef<HTMLCanvasElement | null>(null)

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
      <div className='absolute left-4 top-4 z-20 rounded-lg bg-black/80 p-4 text-white backdrop-blur-sm'>
        <h3 className='mb-2 text-sm font-semibold'>键盘控制</h3>
        <div className='space-y-1 text-xs'>
          <div>
            <kbd className='rounded bg-gray-700 px-1 py-0.5'>Space</kbd>{' '}
            暂停/继续
          </div>
          <div>
            <kbd className='rounded bg-gray-700 px-1 py-0.5'>A</kbd> 添加摆锤
          </div>
          <div>
            <kbd className='rounded bg-gray-700 px-1 py-0.5'>D</kbd> 删除摆锤
          </div>
          <div>
            <kbd className='rounded bg-gray-700 px-1 py-0.5'>M</kbd> 切换模式
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
