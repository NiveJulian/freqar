import { NextResponse } from "next/server"
import { createOrder } from "@/lib/api-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Map Freqar order to CRM public-order format
    const crmOrderData = {
      cart: body.items.map((item: any) => ({
        product: { 
          id: item.id.toString(), 
          name: item.name, 
          price: item.price 
        },
        qty: item.quantity,
      })),
      customerData: {
        name: body.customer.name.split(' ')[0] || "Cliente",
        lastName: body.customer.name.split(' ').slice(1).join(' ') || "Ecommerce",
        email: body.customer.email,
        phone: body.customer.phone,
        address: `${body.customer.address}, ${body.customer.city} (${body.customer.postalCode})`,
        paymentMethod: body.payment,
        notes: body.customer.notes,
        deliveryType: body.shipping.method === 'pickup' ? 'pickup' : 'delivery',
      },
    }

    const result = await createOrder(crmOrderData)

    return NextResponse.json({ 
      success: true, 
      orderNumber: result.correlative,
      message: "Pedido recibido correctamente" 
    })
  } catch (error: any) {
    console.error("Error processing order:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error al procesar el pedido" },
      { status: 500 }
    )
  }
}
