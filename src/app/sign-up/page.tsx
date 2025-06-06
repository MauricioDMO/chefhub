import { SignUpForm } from "@/components/auth/SignUpForm"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect('/')
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="font-normal">¡Únete a</span> <br />
            ChefHub!
          </h1>
          <p className="text-sm sm:text-base opacity-90 max-w-sm mx-auto">
            Crea tu cuenta y descubre el mejor contenido culinario. Tu aventura gastronómica comienza aquí.
          </p>
        </div>
        
        {/* Mobile Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative min-h-screen">
        <section className="w-4/5 h-4/5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white rounded-lg shadow-lg min-h-[600px]">
          {/* Left Panel - Welcome Message */}
          <div className="flex-1 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center p-8 rounded-l-lg">
            <article className="text-white text-center max-w-md">
              <div className="w-min mx-auto">
                <h1 className="text-3xl xl:text-4xl font-bold mb-4 text-left">
                  <span className="font-normal ml-2">¡Únete a</span> <br />
                  ChefHub!
                </h1>
              </div>
              <p className="text-sm xl:text-base leading-relaxed opacity-90 text-pretty">
                Crea tu cuenta y descubre el mejor contenido culinario. Tu aventura gastronómica comienza aquí.
              </p>
            </article>
          </div>
          {/* Right Panel - Sign Up Form */}
          <article className="flex-1 flex items-center justify-center p-6 xl:p-8">
            <SignUpForm />
          </article>
        </section>
      </div>
    </div>
  );
}
