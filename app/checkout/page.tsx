"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CreditCard, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { fetchCatalog, fetchShippingOptions, createOrder } from "@/lib/api-service"
import { useEffect } from "react"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

const defaultShippingOptions = [
  { id: "pickup", name: "Retiro en local", price: 0, time: "Disponible en 24hs" },
]

const initialPaymentMethods = [
  { id: "transfer", name: "Transferencia bancaria", description: "Datos enviados al confirmar" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [shippingOptions, setShippingOptions] = useState(defaultShippingOptions)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catalog, options] = await Promise.all([
          fetchCatalog(),
          fetchShippingOptions()
        ])

        if (options && Array.isArray(options) && options.length > 0) {
          // Unimos los del backend con el de retiro local por defecto
          setShippingOptions([
            ...options.map((opt: any) => ({
              id: opt.id.toString(),
              name: opt.name,
              price: opt.price,
              time: opt.time || "Consultar plazo"
            })),
            ...defaultShippingOptions
          ])
        }

        if (catalog.enabledPaymentMethods && Array.isArray(catalog.enabledPaymentMethods)) {
          const methods = [...initialPaymentMethods]
          if (catalog.enabledPaymentMethods.includes("mercadopago")) {
            methods.push({ id: "mercadopago", name: "Mercado Pago", description: "Tarjetas, efectivo, cuotas" })
          }
          if (catalog.enabledPaymentMethods.includes("MODO")) {
            methods.push({ id: "MODO", name: "MODO", description: "Paga con tu billetera MODO" })
          }
           // Si no hay métodos habilitados (pero el array existe), nos aseguramos de tener al menos transferencia
          if (methods.length === 0) {
             setPaymentMethods(initialPaymentMethods)
          } else {
             setPaymentMethods(methods)
          }
        } else {
           // Fallback default
           setPaymentMethods([
             ...initialPaymentMethods,
             { id: "mercadopago", name: "Mercado Pago", description: "Tarjetas, efectivo, cuotas" }
           ])
        }
      } catch (error) {
        console.error("Error loading config:", error)
      }
    }
    loadData()
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    shipping: "pickup",
    payment: "transfer",
  })

  const shippingCost = shippingOptions.find(s => s.id === formData.shipping)?.price || 0
  const finalTotal = totalPrice + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const crmOrderData = {
        cart: items.map((item) => ({
          product: { 
            id: item.id.toString(), 
            name: item.name, 
            price: item.price 
          },
          qty: item.quantity,
          productVariantId: item.selectedVariantId,
        })),
        customerData: {
          name: formData.name.split(' ')[0] || "Cliente",
          lastName: formData.name.split(' ').slice(1).join(' ') || "Ecommerce",
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city} (${formData.postalCode})`,
          paymentMethod: formData.payment,
          notes: formData.notes,
          deliveryType: formData.shipping === 'pickup' ? 'pickup' : 'delivery',
          shippingMethodName: shippingOptions.find(s => s.id === formData.shipping)?.name || "Envío por defecto",
        },
        deliveryCost: shippingCost,
      }

      const result = await createOrder(crmOrderData)

      if (result) {
        const checkoutUrl = result.mercadopagoPreference?.redirectUrl || result.modoIntention?.checkoutUrl;
        
        if (checkoutUrl) {
          window.location.href = checkoutUrl
          return
        }

        setIsSuccess(true)
        clearCart()
      }
    } catch (error: any) {
      console.error("Error creating order:", error)
      alert(error.message || "Error al procesar el pedido")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-background" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pedido confirmado</h1>
          <p className="text-muted-foreground mb-8">
            Recibimos tu pedido correctamente. Te enviamos un email con los detalles y las instrucciones de pago.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/#productos">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            Agregá productos antes de continuar con el checkout.
          </p>
          <Button asChild>
            <Link href="/#productos">Ver productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver a la tienda</span>
          </Link>
          <span className="text-2xl font-bold tracking-tighter text-foreground">
            FREQ<span className="text-muted-foreground">.AR</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Form Section */}
            <div className="space-y-10">
              {/* Contact Info */}
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">1</span>
                  Datos de contacto
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">2</span>
                  Dirección de envío
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Buenos Aires"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código postal *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="1043"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">3</span>
                  Método de envío
                </h2>
                <RadioGroup
                  value={formData.shipping}
                  onValueChange={(value) => setFormData({ ...formData, shipping: value })}
                  className="space-y-3"
                >
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:border-foreground/50 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div>
                          <p className="font-medium text-foreground">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {option.price === 0 ? "Gratis" : formatPrice(option.price)}
                        </span>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">4</span>
                  Método de pago
                </h2>
                <RadioGroup
                  value={formData.payment}
                  onValueChange={(value) => setFormData({ ...formData, payment: value })}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:border-foreground/50 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-secondary/50"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </section>

              {/* Notes */}
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4">Notas adicionales</h2>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Instrucciones especiales de entrega, comentarios, etc."
                  rows={3}
                />
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedVariantId || 'default'}`} className="flex gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-secondary shrink-0">
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="font-medium text-foreground text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                        <p className="font-semibold text-foreground text-sm mt-auto">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium text-foreground">
                      {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-base font-medium text-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">{formatPrice(finalTotal)}</span>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pedido"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al confirmar, aceptás nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
