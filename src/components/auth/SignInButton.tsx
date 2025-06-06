import Link from "next/link";

export function SignInButton() {
  return (
    <Link
      href="/sign-in"
      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
    >
      <span>Iniciar Sesión</span>
    </Link>
  )
}
