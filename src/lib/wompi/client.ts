import { WOMPI_ENDPOINTS } from "@/consts"
import { WOMPI_API_SECRET, WOMPI_APP_ID } from "@/consts/env"

export async function getWompiToken(): Promise<string> {
  if (!WOMPI_APP_ID) {
    throw new Error('WOMPI_APP_ID is not defined')
  }
  if (!WOMPI_API_SECRET) {
    throw new Error('WOMPI_API_SECRET is not defined')
  }

  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('audience', 'wompi_api')
  params.append('client_id', WOMPI_APP_ID)
  params.append('client_secret', WOMPI_API_SECRET)

  const response = await fetch(WOMPI_ENDPOINTS.AUTH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Wompi token: ${response.statusText}`)
  }

  const {
    access_token: token,
    expires_in: expiresIn
  } = await response.json()

  if (!token || !expiresIn) {
    throw new Error('Invalid response from Wompi token endpoint')
  }

  return token
}
