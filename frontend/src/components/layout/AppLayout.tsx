
import {
  useEffect,
  useState,
} from 'react'

import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  const [menuOpen, setMenuOpen] =
    useState(false)

  const [currentDate, setCurrentDate] =
    useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 60_000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar
          onClose={() => setMenuOpen(false)}
        />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <button
            type="button"
            aria-label="Fermer la navigation"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 shadow-2xl">
            <Sidebar
              onClose={() =>
                setMenuOpen(false)
              }
            />
          </div>

        </div>
      )}

      <div className="min-h-screen lg:ml-72">

        <Header
          currentDate={currentDate}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <main
          id="main-content"
          className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9"
        >
          <Outlet />
        </main>

      </div>

    </div>
  )
}
