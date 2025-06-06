"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCreditCard, IconLoader, IconExternalLink } from "@tabler/icons-react";

interface SubscriptionTier {
  id: number;
  name: string;
  description: string;
  priceUSD: number;
}

interface CheckoutFormProps {
  selectedTier: SubscriptionTier;
}

export function CheckoutForm({ selectedTier }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePaymentLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-payment-link",
          tierId: selectedTier.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el enlace de pago");
      }

      const result = await response.json();
        if (result.success && result.paymentUrl) {
        // Redirect to Wompi payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error("No se pudo generar el enlace de pago");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Información de Pago</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Plan Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Plan Seleccionado</h3>
          <p className="text-green-700 text-sm mb-1">{selectedTier.name}</p>
          <p className="text-green-600 text-sm">{selectedTier.description}</p>
          <p className="text-green-800 font-bold text-lg mt-2">
            ${selectedTier.priceUSD.toFixed(2)} USD/mes
          </p>
        </div>

        {/* Payment Method Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <IconCreditCard className="h-5 w-5 text-green-500" />
            <span>Pago seguro procesado por Wompi</span>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Métodos de pago aceptados:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tarjetas de crédito y débito</li>
              <li>• QuickPay</li>
              <li>• Procesamiento seguro SSL</li>
            </ul>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleCreatePaymentLink}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <IconLoader className="animate-spin h-5 w-5 mr-2" />
              Generando enlace...
            </>
          ) : (
            <>
              <IconExternalLink className="h-5 w-5 mr-2" />
              Continuar al Pago
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Al hacer clic en "Continuar al Pago", serás redirigido a una página segura de Wompi 
          para completar tu pago. Tu suscripción se activará automáticamente después del pago exitoso.
        </p>
      </div>
    </div>
  );
}