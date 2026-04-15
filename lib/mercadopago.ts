import { API_URL } from "@/lib/api-service"

export type MercadoPagoReturnPayload = {
  collection_id?: string
  collection_status?: string
  payment_id?: string
  status?: string
  external_reference?: string
  payment_type?: string
  merchant_order_id?: string
  preference_id?: string
  site_id?: string
  processing_mode?: string
  merchant_account_id?: string
}

export const getMercadoPagoPayloadFromSearchParams = (searchParams: URLSearchParams): MercadoPagoReturnPayload => ({
  collection_id: searchParams.get("collection_id") || undefined,
  collection_status: searchParams.get("collection_status") || undefined,
  payment_id: searchParams.get("payment_id") || undefined,
  status: searchParams.get("status") || undefined,
  external_reference: searchParams.get("external_reference") || undefined,
  payment_type: searchParams.get("payment_type") || undefined,
  merchant_order_id: searchParams.get("merchant_order_id") || undefined,
  preference_id: searchParams.get("preference_id") || undefined,
  site_id: searchParams.get("site_id") || undefined,
  processing_mode: searchParams.get("processing_mode") || undefined,
  merchant_account_id: searchParams.get("merchant_account_id") || undefined,
})

export const shouldSyncMercadoPagoReturn = (payload: MercadoPagoReturnPayload) => {
  return Boolean(payload.collection_id || payload.payment_id) && Boolean(payload.external_reference)
}

export const syncMercadoPagoReturn = async (payload: MercadoPagoReturnPayload) => {
  const response = await fetch(`${API_URL}/payment/mercadopago/return`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return response.json()
}
