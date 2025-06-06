import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { IconShieldCheck, IconLock } from "@tabler/icons-react";

interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>
}

// Temporary subscription tiers data - in a real app this would come from your API
const subscriptionTiers = [
  {
    id: 1,
    name: "Gratuito",
    description: "Plan gratuito con acceso limitado",
    priceUSD: 0,
  },
  {
    id: 2,
    name: "Básico",
    description: "Plan básico sin anuncios",
    priceUSD: 4.99,
  },
  {
    id: 3,
    name: "Pro",
    description: "Plan profesional con servicios premium",
    priceUSD: 19.99,
  },
];

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { id } = await params
  const tier = subscriptionTiers.find(t => t.id === parseInt(id));

  if (!tier) {
    return {
      title: "Plan no encontrado - ChefHub",
    };
  }

  return {
    title: `Checkout ${tier.name} - ChefHub`,
    description: `Completa tu suscripción al plan ${tier.name} de ChefHub`,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const tierId = parseInt(id);
  const selectedTier = subscriptionTiers.find(tier => tier.id === tierId);

  if (!selectedTier) {
    notFound();
  }

  // Redirect free plan to success page
  if (selectedTier.priceUSD === 0) {
    // In a real app, you'd handle free tier signup here
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Plan Gratuito Activado!
          </h1>
          <p className="text-gray-600 mb-6">
            No necesitas proporcionar información de pago para el plan gratuito.
          </p>
          <a 
            href="/recipes"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Explorar Recetas
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Finalizar Suscripción
          </h1>
          <p className="text-lg text-gray-600">
            Estás a un paso de disfrutar de todas las ventajas de ChefHub
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedTier.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTier.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Facturación mensual</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${selectedTier.priceUSD.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${selectedTier.priceUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">${selectedTier.priceUSD.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <IconShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Información protegida con SSL</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                  <IconLock className="h-5 w-5 text-green-500" />
                  <span>Procesamiento seguro con Wompi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <CheckoutForm selectedTier={selectedTier} />
          </div>
        </div>
      </main>
    </div>
  );
}