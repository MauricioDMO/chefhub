import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/db";

interface WompiWebhookData {
  evento: string;
  datos: {
    identificadorEnlaceComercio: string;
    estado: string;
    monto: number;
    moneda: string;
    fechaTransaccion: string;
    referencia: string;
    metodoPago: string;    datosAdicionales: {
      userId: string;
      tierId: string;
      tierName: string;
      linkIdentifier: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const webhookData: WompiWebhookData = await request.json();
    
    console.log("Wompi webhook received:", webhookData);

    // Verify this is a payment completion event
    if (webhookData.evento !== "pago_completado" || webhookData.datos.estado !== "aprobado") {
      return NextResponse.json({ message: "Event not processed" }, { status: 200 });
    }

    const { identificadorEnlaceComercio, referencia } = webhookData.datos;
    const { userId, tierId } = webhookData.datos.datosAdicionales;

    // Find the pending payment transaction
    const pendingTransaction = await client.execute(
      "SELECT * FROM payment_transactions WHERE wompiLinkId = ? AND status = 'pending'",
      [identificadorEnlaceComercio]
    );

    if (pendingTransaction.rows.length === 0) {
      console.error("No pending transaction found for link:", identificadorEnlaceComercio);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Get subscription tier details
    const tierResult = await client.execute(
      "SELECT * FROM subscription_tiers WHERE id = ? AND active = 1",
      [parseInt(tierId)]
    );

    if (tierResult.rows.length === 0) {
      console.error("Subscription tier not found:", tierId);
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }    const now = new Date().toISOString();

    try {
      const transaction = pendingTransaction.rows[0];
      const subscriptionId = transaction.subscriptionId;

      // Update the existing subscription status to active
      await client.execute(
        `UPDATE subscriptions 
         SET status = 'active', updatedAt = ?
         WHERE id = ?`,
        [now, subscriptionId]
      );

      // Update the payment transaction with success status
      await client.execute(
        `UPDATE payment_transactions 
         SET status = 'approved', wompiReference = ?, processedAt = ?
         WHERE wompiLinkId = ?`,
        [
          referencia,
          now,
          identificadorEnlaceComercio
        ]
      );

      console.log(`Subscription activated successfully for user ${userId}, subscription ${subscriptionId}`);
      
      return NextResponse.json({ 
        message: "Subscription activated successfully",
        subscriptionId: Number(subscriptionId)
      }, { status: 200 });

    } catch (dbError) {
      console.error("Database error activating subscription:", dbError);
      
      // Mark the transaction as failed
      await client.execute(
        `UPDATE payment_transactions 
         SET status = 'error', failureReason = ?
         WHERE wompiLinkId = ?`,
        [
          "Database error during subscription activation",
          identificadorEnlaceComercio
        ]
      );
      
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}