import { useEffect, useState } from 'react'

export default function PillNav({ items = [] }){
  const [active, setActive] = useState(items[0]?.id)

  useEffect(()=>{
    const obs = new IntersectionObserver(
      (entries)=>{
        entries.forEach((e)=>{ if(e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 }
    )
    items.forEach((it)=>{ const el=document.getElementById(it.id); if(el) obs.observe(el) })
    return ()=> obs.disconnect()
  },[items])

  const go = (id)=>{
    const el = document.getElementById(id)
    if(!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 12
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="pillnav">
      <div className="pillnav__track">
        {items.map((it)=> (
          <button key={it.id} className={`pill ${active===it.id?'is-active':''}`} onClick={()=>go(it.id)}>
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}


