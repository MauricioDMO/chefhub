import { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";
import { dancingScript } from "@/ui/fonts";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Precios - ChefHub",
  description: "Elige el plan perfecto para ti y desbloquea todo el potencial culinario de ChefHub.",
};

export default async function PricingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Elige tu plan{" "}
            <span className={`${dancingScript.className} text-green-600 font-dancing-script text-5xl md:text-6xl`}>
              perfecto
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Desbloquea todo el potencial culinario de ChefHub. Desde recetas gratuitas 
            hasta experiencias premium con contenido exclusivo y servicios personalizados.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards />

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios 
                se aplicarán inmediatamente y se ajustará la facturación proporcionalmente.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-gray-600">
                Aceptamos tarjetas de crédito y débito, Nequi, PSE y transferencias 
                bancarias a través de nuestra integración segura con Wompi.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Hay compromiso de permanencia?
              </h3>
              <p className="text-gray-600">
                No, todos nuestros planes son mensuales sin compromiso de permanencia. 
                Puedes cancelar tu suscripción en cualquier momento.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cuándo estará disponible el servicio de ingredientes?
              </h3>
              <p className="text-gray-600">
                Estamos trabajando en nuestro servicio de entrega de ingredientes. 
                Los suscriptores Pro tendrán acceso prioritario cuando esté disponible.
              </p>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        { !session &&
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para comenzar tu viaje culinario?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Únete a miles de chefs caseros que ya están transformando sus cocinas
              </p>
              <Link
                href="/sign-up"
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        }
      </main>
    </div>
  );
}
