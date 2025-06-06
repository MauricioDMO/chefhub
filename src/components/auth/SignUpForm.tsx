"use client"

import { signUpWithEmail } from "@/app/server/users"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignUpForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validaciones básicas
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    setIsLoading(true)
    
    try {
      await signUpWithEmail({ 
        email, 
        name: username, 
        password 
      })

      router.push("/welcome")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        return
      }
      setError("Error al crear la cuenta. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-2">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 8 caracteres
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
            required
            minLength={8}
          />
        </div>

        {/* Terms and conditions */}
        <div className="text-sm text-gray-600">
          Al registrarte, aceptas nuestros{" "}
          <a href="#" className="text-green-600 hover:text-green-500">
            términos de servicio
          </a>{" "}
          y{" "}
          <a href="#" className="text-green-600 hover:text-green-500">
            política de privacidad
          </a>
          .
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                href="/sign-in" 
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Inicia sesión
              </Link>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-100 lg:bg-white text-gray-500">o continúa con</span>
          </div>
        </div>

        {/* Google Sign In */}
        <GoogleButton />
      </form>
    </div>
  )
}
