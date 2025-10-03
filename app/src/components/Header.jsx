import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header(){
  const items = [
    { id: 's31', label: 'Độc lập', icon: '⭐' },
    { id: 's32', label: 'CNXH', icon: '🏛️' },
    { id: 's33', label: 'Quan hệ', icon: '🔗' },
    { id: 's34', label: 'Vận dụng', icon: '🚀' },
    { id: 'discussion', label: 'Thảo luận', icon: '💬' },
  ]
  const [active, setActive] = useState(items[0].id)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(()=>{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-35% 0px -58% 0px', threshold: 0.05 })
    items.forEach(it=>{ const el=document.getElementById(it.id); if(el) obs.observe(el) })
    return ()=> obs.disconnect()
  },[])

  useEffect(()=>{
    const onScroll = ()=> setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  // detect mobile viewport and update state
  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobileView) setIsMobileMenuOpen(false)
  }, [isMobileView])

  const go = (id)=>{
    const el = document.getElementById(id)
    if(!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header 
      className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container site-header__inner">
        <motion.a 
          className="brand" 
          href="#top"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="brand__icon">🌟</span>
          <span className="brand__text">Tư tưởng HCM</span>
        </motion.a>
        
        {/* Desktop Navigation */}
        <nav className="nav nav--pills nav--desktop">
          {items.map((it, index) => (
            <motion.button 
              key={it.id} 
              className={`pill ${active===it.id?'is-active':''}`} 
              onClick={()=>go(it.id)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.1 + index * 0.1,
                ease: [0.4, 0, 0.2, 1] 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pill__icon">{it.icon}</span>
              <span className="pill__text">{it.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Button removed */}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="mobile-menu__inner">
              {items.map((it, index) => (
                <motion.button 
                  key={it.id} 
                  className={`mobile-pill ${active===it.id?'is-active':''}`} 
                  onClick={()=>go(it.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1] 
                  }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mobile-pill__icon">{it.icon}</span>
                  <span className="mobile-pill__text">{it.label}</span>
                  {active === it.id && (
                    <motion.div 
                      className="mobile-pill__indicator"
                      layoutId="mobile-active"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}