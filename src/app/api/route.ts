import { WOMPI_ENDPOINTS } from "@/consts";
import { WOMPI_APP_ID } from "@/consts/env";
import { getWompiToken } from "@/lib/wompi/client";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getWompiToken()

  const response = await fetch(WOMPI_ENDPOINTS.CREATE_RECURRENT_PAYMENT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      diaDePago: 7,
      nombre: "Subscripción Básica ChefHub",
      idAplicativo: WOMPI_APP_ID,
      monto: 4.99,
      descripcionProducto: "Sin anuncios"
    })
  })

  console.log(response)

  const data = await response.text()

  return NextResponse.json({
    message: "Wompi webhook endpoint is active",
    status: "success",
    token: token,
    data
  })
}