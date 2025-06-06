import { auth } from "@/lib/auth";
import { dancingScript } from "@/ui/fonts";
import { IconCheck, IconX, IconCrown, IconChefHat, IconShieldCheck } from "@tabler/icons-react";
import { headers } from "next/headers";
import Link from "next/link";

interface SubscriptionTier {
  id: number;
  name: string;
  description: string;
  priceUSD: number;
  billingPeriod: string;
  features: string[];
  maxRecipeViews: number | null;
  adFree: boolean;
  premiumContent: boolean;
  downloadRecipes: boolean;
  popular?: boolean;  icon: React.ComponentType<Record<string, unknown>>;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 1,
    name: "Gratuito",
    description: "Plan gratuito con acceso limitado",
    priceUSD: 0,
    billingPeriod: "monthly",
    features: [
      "Acceso básico a recetas",
      "Hasta 10 visualizaciones por mes",
      "Comunidad de chefs",
    ],
    maxRecipeViews: 10,
    adFree: false,
    premiumContent: false,
    downloadRecipes: false,
    icon: IconChefHat,
  },
  {
    id: 2,
    name: "Básico",
    description: "Plan básico sin anuncios",
    priceUSD: 4.99,
    billingPeriod: "monthly",
    features: [
      "Acceso completo a recetas",
      "Visualizaciones ilimitadas",
      "Experiencia sin anuncios",
      "Guardar recetas favoritas",
    ],
    maxRecipeViews: null,
    adFree: true,
    premiumContent: false,
    downloadRecipes: false,
    popular: true,
    icon: IconShieldCheck,
  },
  {
    id: 3,
    name: "Pro",
    description: "Plan profesional con servicios premium",
    priceUSD: 19.99,
    billingPeriod: "monthly",
    features: [
      "Acceso completo a recetas",
      "Experiencia sin anuncios",
      "Contenido exclusivo premium",
      "Descarga de recetas en PDF",
      "Envío de ingredientes (próximamente)",
      "Soporte prioritario",
    ],
    maxRecipeViews: null,
    adFree: true,
    premiumContent: true,
    downloadRecipes: true,
    icon: IconCrown,
  },
];

export async function PricingCards() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {subscriptionTiers.map((tier) => (
        <div
          key={tier.id}
          className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
            tier.popular
              ? "border-green-500 transform scale-105"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Más Popular
              </span>
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <tier.icon className={`h-12 w-12 ${
                  tier.popular ? "text-green-500" : "text-gray-400"
                }`} />
              </div>
              <h3 className={`${dancingScript.className} text-4xl font-bold text-gray-900 mb-2`}>
                {tier.name}
              </h3>
              <p className="text-gray-600 mb-4">{tier.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">
                  ${tier.priceUSD}
                </span>
                {tier.priceUSD > 0 && (
                  <span className="text-gray-500 ml-2">/mes</span>
                )}
              </div>
            </div>            {/* Features */}
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <IconCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              
              {/* Show what's NOT included for free plan */}
              {tier.id === 1 && (
                <>
                  <li className="flex items-start opacity-50">
                    <IconX className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500">Experiencia sin anuncios</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <IconX className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500">Contenido premium</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <IconX className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500">Descarga de recetas</span>
                  </li>
                </>
              )}
            </ul>
            {/* CTA Button */}
            { session && tier.id === 1
              ? null
              : <Link
                href={tier.id === 1 ? "/sign-up" : "/checkout/" + tier.id}
                className={`block text-center w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  tier.popular
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                    : tier.priceUSD === 0
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {tier.priceUSD === 0 ? "Comenzar Gratis" : "Suscribirse Ahora"}
              </Link>
            }

            {tier.priceUSD > 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Sin compromiso de permanencia
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
