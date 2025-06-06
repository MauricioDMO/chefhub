import { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconChefHat, IconMail } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Suscripción Exitosa - ChefHub",
  description: "Tu suscripción se ha activado correctamente",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-8 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <IconCheck className="h-10 w-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          ¡Suscripción Exitosa!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Tu suscripción a ChefHub se ha activado correctamente. Ya puedes disfrutar 
          de todas las ventajas de tu plan premium.
        </p>

        {/* What's Next */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Qué sigue ahora?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IconChefHat className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Explora Recetas Premium</h3>
                <p className="text-gray-600 text-sm">
                  Accede a nuestra colección completa de recetas exclusivas sin anuncios.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IconMail className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Confirma tu Email</h3>
                <p className="text-gray-600 text-sm">
                  Revisa tu bandeja de entrada para confirmar los detalles de tu suscripción.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            Explorar Recetas
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-2">
            Tu suscripción se renovará automáticamente cada mes. 
            Puedes cancelar en cualquier momento desde tu perfil.
          </p>
          <p>
            ¿Necesitas ayuda? Contáctanos en{" "}
            <a href="mailto:soporte@chefhub.com" className="text-green-600 hover:underline">
              soporte@chefhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}