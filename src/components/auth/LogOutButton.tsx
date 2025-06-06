'use client'

import { authClient } from '@/lib/authClient'
import { IconLogout } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export function LogOutButton() {
  const router = useRouter()
  const { signOut } = authClient

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
          onSuccess: () => {
          router.push('/')
        }
      }
    })
    router.refresh()
  }

  return (
    <button
      className='bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-2'
      onClick={handleSignOut}>
      <IconLogout className='size-4 inline-block mr-2' />
      <span className='hover:underline'>
        Cerrar sesión
      </span>

    </button>
  )
}