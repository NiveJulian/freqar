"use client"

import { useState } from "react"
import { Send, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
  }

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Info */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Contacto
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
              Hablemos de tu proyecto
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Contanos qué necesitás y te respondemos en menos de 24 horas hábiles 
              con una cotización detallada y sin compromiso.
            </p>

            {/* Contact Info */}
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Mail className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href="mailto:ventas@freq.ar" className="text-foreground hover:underline">
                    ventas@freq.ar
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Phone className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <a href="https://wa.me/5491100000000" className="text-foreground hover:underline">
                    +54 9 11 0000-0000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ubicación</div>
                  <span className="text-foreground">Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="mt-10 rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground">Horario de atención</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="text-foreground">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="text-foreground">10:00 - 14:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="mb-6 text-xl font-semibold text-foreground">
              Solicitar cotización
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" placeholder="Tu nombre" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="Nombre de la empresa" required className="bg-background" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@empresa.com" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+54 9 11..." className="bg-background" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product">Producto de interés</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vasos">Vasos térmicos</SelectItem>
                      <SelectItem value="termos">Termos</SelectItem>
                      <SelectItem value="mates">Mates</SelectItem>
                      <SelectItem value="madera">Artículos de madera</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad estimada</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleccionar cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-100">50 - 100 unidades</SelectItem>
                      <SelectItem value="100-250">100 - 250 unidades</SelectItem>
                      <SelectItem value="250-500">250 - 500 unidades</SelectItem>
                      <SelectItem value="500+">+500 unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea 
                  id="message" 
                  placeholder="Contanos sobre tu proyecto, diseño deseado, fechas de entrega..." 
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar solicitud
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Al enviar este formulario, aceptás nuestra política de privacidad.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
