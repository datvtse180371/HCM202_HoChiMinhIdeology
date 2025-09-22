import { useEffect, useState } from 'react'

export default function TOC({ sections = [] }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 12
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Mục lục</div>
      <nav>
        <ul className="sidebar__list">
          {sections.map((s) => (
            <li key={s.id} className={active === s.id ? 'is-active' : ''}>
              <a href={`#${s.id}`} onClick={(e) => handleClick(e, s.id)}>{s.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}


