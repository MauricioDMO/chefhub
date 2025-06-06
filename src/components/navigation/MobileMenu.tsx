'use client'

import { useState, useEffect, useRef } from 'react'
import { IconMenu2, IconX, IconHome, IconSearch, IconBookmark, IconHeart } from '@tabler/icons-react'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { LogOutButton } from '@/components/auth/LogOutButton'
import Link from 'next/link'

export function MobileMenu({ children, menuOptions }: { children?: React.ReactNode, menuOptions: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])
  return (
    <div ref={menuRef} className="md:hidden relative">
      {/* Mobile menu button */}
      <div>
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Abrir menú principal</span>
          {isMobileMenuOpen ? (
            <IconX className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <IconMenu2 className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}        <div className={`${isMobileMenuOpen ? 'h-auto shadow-lg border' : 'h-0'} border-gray-200 overflow-clip absolute right-0 top-full mt-2 w-80 bg-white rounded-lg z-50 transition-all duration-300 ease-in-out`}>
          <div className="px-2 pt-2 pb-3">
            <ul className="space-y-1">
              {menuOptions}
            </ul>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 pb-3 border-t border-gray-200" onClick={closeMobileMenu}>
              {children}
            </div>
          </div>
        </div>
    </div>
  )
}
