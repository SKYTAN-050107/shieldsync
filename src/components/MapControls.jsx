import { useRef, useEffect } from 'react'

export default function MapControls({ svgRef, mapWidth, mapHeight, onResetRef }) {
  // This component adds pan/zoom controls to the SVG map
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    let scale = 1
    let translate = { x: 0, y: 0 }
        // Expose reset function
        if (onResetRef) {
          onResetRef.current = () => {
            scale = 1
            translate = { x: 0, y: 0 }
            setTransform()
          }
        }
    let isDragging = false
    let lastPos = { x: 0, y: 0 }

    const setTransform = () => {
      svg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`
      svg.style.transformOrigin = 'center center'
      svg.style.transition = 'transform 0.1s cubic-bezier(.4,0,.2,1)'
    }

    // Mouse wheel for zoom
    const handleWheel = (e) => {
      e.preventDefault()
      // Decrease zoom speed
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      scale = Math.max(0.5, Math.min(2.5, scale + delta))
      setTransform()
    }

    // Mouse drag for pan
    const handleMouseDown = (e) => {
      isDragging = true
      lastPos = { x: e.clientX, y: e.clientY }
      svg.style.cursor = 'grabbing'
    }
    const handleMouseMove = (e) => {
      if (!isDragging) return
      // Add pan smoothing for stability
      const dx = e.clientX - lastPos.x
      const dy = e.clientY - lastPos.y
      // Reduce movement speed for stability
      translate.x += dx * 0.7
      translate.y += dy * 0.7
      lastPos = { x: e.clientX, y: e.clientY }
      setTransform()
    }
    const handleMouseUp = () => {
      isDragging = false
      svg.style.cursor = 'grab'
    }

    svg.addEventListener('wheel', handleWheel, { passive: false })
    svg.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    svg.style.cursor = 'grab'
    setTransform()

    return () => {
      svg.removeEventListener('wheel', handleWheel)
      svg.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (onResetRef) onResetRef.current = null
    }
  }, [svgRef])

  return null
}
