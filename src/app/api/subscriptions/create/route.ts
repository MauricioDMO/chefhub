import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { client } from "@/lib/db"
import { getWompiToken } from "@/lib/wompi/client"
import { WOMPI_ENDPOINTS } from "@/consts"
import { NEXT_PUBLIC_BASE_URL, WOMPI_APP_ID } from "@/consts/env"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === "create-payment-link") {
      return await handleCreatePaymentLink(session.user.id, body)
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error in subscription creation:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

async function handleCreatePaymentLink(
  userId: string,
  data: { tierId: number }
) {
  const { tierId } = data

  try {
    // Get subscription tier details
    const tierResult = await client.execute(
      "SELECT * FROM subscription_tiers WHERE id = ? AND active = 1",
      [tierId]
    )

    if (tierResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Plan de suscripción no encontrado" },
        { status: 404 }
      )
    }

    const tier = tierResult.rows[0]
    const tierName = tier.name as string
    const tierDescription = tier.description as string
    const tierPrice = tier.priceUSD as number


    // Check if user already has an active subscription
    const existingSubscription = await client.execute(
      "SELECT * FROM subscriptions WHERE userId = ? AND status = 'active'",
      [userId]
    )

    if (existingSubscription.rows.length > 0) {
      return NextResponse.json(
        { error: "Ya tienes una suscripción activa" },
        { status: 400 }
      )
    }

    // Create a unique identifier for this payment link
    const linkIdentifier = `chefhub-${tierId}-${userId}-${Date.now()}`
    
    // Prepare dates for payment link validity (30 minutes from now)
    const now = new Date()
    const expiryDate = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes
    
    const paymentLinkData = {
      idAplicativo: WOMPI_APP_ID || "",
      identificadorEnlaceComercio: linkIdentifier,
      monto: tierPrice,
      nombreProducto: `Suscripción ChefHub ${tierName}`,
      formaPago: {
        permitirTarjetaCreditoDebido: true,
        permitirPagoConPuntoAgricola: false,
        permitirPagoEnCuotasAgricola: false,
        permitirPagoEnBitcoin: false,
        permitePagoQuickPay: true
      },
      infoProducto: {
        descripcionProducto: tierDescription,
      },
      configuracion: {
        urlRedirect: `${NEXT_PUBLIC_BASE_URL}/checkout/success?subscription=${tierId}`,
        esMontoEditable: false,
        esCantidadEditable: false,
        cantidadPorDefecto: 1,
        duracionInterfazIntentoMinutos: 30,
        urlRetorno: `${NEXT_PUBLIC_BASE_URL}/checkout/${tierId}`,
        emailsNotificacion: "",
        urlWebhook: `${NEXT_PUBLIC_BASE_URL}/api/webhook/wompi`,
        notificarTransaccionCliente: true
      },
      vigencia: {
        fechaInicio: now.toISOString(),
        fechaFin: expiryDate.toISOString()
      },
      limitesDeUso: {
        cantidadMaximaPagosExitosos: 1,
        cantidadMaximaPagosFallidos: 3
      }
    }

    // Get Wompi token and create payment link
    const token = await getWompiToken()

    
    const response = await fetch(WOMPI_ENDPOINTS.CREATE_PAYMENT_LINK, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentLinkData),
    })

    console.log(await response.json())

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Wompi payment link error:", errorData)
      throw new Error("Error al crear el enlace de pago")
    }

    const result = await response.json()
    
    if (!result.success || !result.data?.urlPago) {
      console.error("Wompi payment link failed:", result)
      throw new Error("Error al crear el enlace de pago")
    }

    // Store pending subscription info for webhook processing
    const now_iso = new Date().toISOString()
    await client.execute(
      `INSERT INTO payment_transactions 
        (userId, subscriptionId, amountUSD, currency, status, paymentMethod, wompiLinkId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        null, // Will be filled when subscription is created after payment
        tierPrice,
        "USD",
        "pending",
        "payment_link",
        linkIdentifier,
        now_iso,
      ]
    )

    return NextResponse.json({
      success: true,
      paymentUrl: result.data.urlPago,
      linkIdentifier: linkIdentifier,
      expiresAt: expiryDate.toISOString()
    })

  } catch (error) {
    console.error("Payment link creation error:", error)
    return NextResponse.json(
      { error: "Error al crear el enlace de pago" },
      { status: 500 }
    )
  }
}