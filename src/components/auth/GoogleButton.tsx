'use client'

import { useState } from "react"
import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { authClient } from "@/lib/authClient"



export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = authClient

  const handleSignIn = async () => {
    const data = await signIn.social({
      provider: "google",
      callbackURL: "/",
      newUserCallbackURL: "/welcome"
    })
  }
  return (
    <button
      className="w-full bg-white text-black px-4 py-2 sm:py-3 rounded shadow hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-2 sm:gap-3 border border-gray-200 text-sm sm:text-base font-medium"
      onClick={() => {
        setIsLoading(true)
        handleSignIn()
          .catch((error) => {
            console.error("Error signing in with Google:", error)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }}
      disabled={isLoading}
    >
      <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"/>
      <span className="truncate">
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión con Google"}
      </span>
    </button>
  )
}