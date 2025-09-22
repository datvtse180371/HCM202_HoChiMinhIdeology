import { useEffect, useState } from 'react'

export default function ProgressBar(){
  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    const onScroll = ()=>{
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      const p = total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])
  return (
    <div className="progress">
      <div className="progress__bar" style={{ width: `${progress}%` }} />
    </div>
  )
}


