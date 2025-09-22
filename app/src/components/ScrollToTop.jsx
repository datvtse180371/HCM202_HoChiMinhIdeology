import { useEffect, useState } from 'react'

export default function ScrollToTop(){
  const [visible, setVisible] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  const toTop = ()=> window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      aria-label="Lên đầu trang"
      className={`scrolltop ${visible ? 'is-visible' : ''}`}
      onClick={toTop}
    >↑</button>
  )
}



