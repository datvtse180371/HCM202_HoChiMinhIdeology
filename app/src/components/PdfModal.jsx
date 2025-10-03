import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function PdfModal({ pdfPath, triggerText = 'Xem tài liệu (PDF)', title: tooltip, compact = false }){
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef(null)
  const containerRef = useRef(null)

  // Raw path; caller should provide a correct public path.
  const src = pdfPath

  // Keyboard handlers: Esc to close, +/- to zoom
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))
      if (e.key === '-') setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Simple focus trap: focus modal container when opened
  useEffect(() => {
    if (open && containerRef.current) containerRef.current.focus()
  }, [open])

  // detect DOM availability
  const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined'

  const download = () => {
    const a = document.createElement('a')
    a.href = src
    a.download = src.split('/').pop()
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn btn--ghost ${compact ? 'btn--inline' : 'btn--small'}`}
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        title={tooltip || triggerText}
        aria-label={tooltip || triggerText}
      >
        {triggerText}
      </button>
      {(() => {
        const overlay = (
          <motion.div
            className="pdf-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2,6,23,0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="pdf-modal"
              initial={{ scale: 0.98, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 12 }}
              transition={{ duration: 0.18 }}
              style={{
                background: 'var(--bg, #fff)',
                color: 'var(--text, #000)',
                borderRadius: 8,
                maxWidth: '96vw',
                maxHeight: '92vh',
                width: isFullscreen ? '100vw' : '86vw',
                height: isFullscreen ? '100vh' : '84vh',
                boxShadow: 'var(--shadow, 0 12px 30px rgba(0,0,0,0.25))',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--outline, rgba(0,0,0,0.08))'
              }}
              onClick={(e) => e.stopPropagation()}
              ref={containerRef}
              tabIndex={-1}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--glass-border, rgba(0,0,0,0.06))', background: 'linear-gradient(90deg, rgba(0,0,0,0.02), transparent)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted, #9ab0c4)' }}>PDF Viewer</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn--ghost btn--small" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))} aria-label="Zoom out">-</button>
                    <div style={{ minWidth: 36, textAlign: 'center' }}>{Math.round(zoom * 100)}%</div>
                    <button className="btn btn--ghost btn--small" onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))} aria-label="Zoom in">+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn--ghost" onClick={() => window.open(src, '_blank')} title="Open in new tab">Mở</button>
                  <button className="btn btn--ghost" onClick={download} title="Download">Tải</button>
                  <button className="btn btn--ghost" onClick={toggleFullscreen} title="Fullscreen">{isFullscreen ? 'Thoát' : 'Toàn màn hình'}</button>
                  <button
                    className="btn"
                    onClick={() => setOpen(false)}
                    style={{ borderColor: 'var(--primary, #f0433a)', color: 'var(--primary, #f0433a)', background: 'transparent' }}
                  >
                    Đóng
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, background: 'var(--bg, #fff)', display: 'flex', alignItems: 'stretch', justifyContent: 'stretch' }}>
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', width: '100%', height: '100%', overflow: 'hidden' }}>
                  <iframe
                    ref={iframeRef}
                    src={src}
                    title="PDF viewer"
                    style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
        if (!open) return null
        return canUseDOM ? createPortal(overlay, document.body) : overlay
      })()}
    </>
  )
}
