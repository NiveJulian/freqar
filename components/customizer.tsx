"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Type, Image as ImageIcon, RotateCcw, Package, Building2, Users, BadgePercent, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const productTypes = [
  { id: "vaso", name: "Vaso Térmico", width: 200, height: 280 },
  { id: "termo", name: "Termo", width: 160, height: 340 },
  { id: "mate", name: "Mate", width: 180, height: 200 },
  { id: "tabla", name: "Tabla", width: 300, height: 200 },
]

const benefits = [
  {
    icon: Building2,
    title: "Exclusivo empresas",
    description: "Soluciones de merchandising corporativo"
  },
  {
    icon: Users,
    title: "Mínimo 50 unidades",
    description: "Pedidos a partir de 50 piezas"
  },
  {
    icon: BadgePercent,
    title: "Precios mayoristas",
    description: "Descuentos por volumen"
  },
  {
    icon: FileText,
    title: "Cotización en 24hs",
    description: "Respuesta rápida garantizada"
  },
]

export function Customizer() {
  const [selectedProduct, setSelectedProduct] = useState(productTypes[0])
  const [text, setText] = useState("TU LOGO")
  const [fontSize, setFontSize] = useState([32])
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
  const [quantity, setQuantity] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawPreview()
  }, [text, fontSize, selectedProduct, textPosition])

  const drawPreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw product outline
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    const productX = (canvas.width - selectedProduct.width) / 2
    const productY = (canvas.height - selectedProduct.height) / 2
    ctx.strokeRect(productX, productY, selectedProduct.width, selectedProduct.height)

    // Draw engrave area
    ctx.fillStyle = "#222"
    ctx.fillRect(productX + 10, productY + 10, selectedProduct.width - 20, selectedProduct.height - 20)

    // Draw text
    ctx.fillStyle = "#f5f5f5"
    ctx.font = `bold ${fontSize[0]}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    const textX = productX + (selectedProduct.width * textPosition.x / 100)
    const textY = productY + (selectedProduct.height * textPosition.y / 100)
    ctx.fillText(text, textX, textY)

    // Add laser effect glow
    ctx.shadowColor = "#fff"
    ctx.shadowBlur = 10
    ctx.fillText(text, textX, textY)
    ctx.shadowBlur = 0
  }

  const handleReset = () => {
    setText("TU LOGO")
    setFontSize([32])
    setTextPosition({ x: 50, y: 50 })
  }

  return (
    <section id="personalizador" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 border-foreground/30">
            Solo mayoristas
          </Badge>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Personalización a medida
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
            Creá tu producto personalizado
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Diseñá tu artículo con tu logo o marca. Precio mayorista exclusivo para empresas. 
            Mínimo 50 unidades por pedido.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div 
              key={benefit.title}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <benefit.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Preview */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-square rounded-lg border border-border bg-background overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={400}
                className="w-full h-full"
              />
              
              {/* Product Label */}
              <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 backdrop-blur-sm border border-border">
                <span className="text-sm font-medium text-foreground">{selectedProduct.name}</span>
              </div>

              {/* Wholesale Badge */}
              <div className="absolute top-4 right-4 rounded-full bg-foreground px-3 py-1">
                <span className="text-xs font-medium text-background">Precio mayorista</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Product Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Tipo de producto</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {productTypes.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                      selectedProduct.id === product.id
                        ? "border-foreground bg-foreground/5"
                        : "border-border bg-transparent hover:border-foreground/50"
                    )}
                  >
                    <Package className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{product.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="text" className="gap-2">
                  <Type className="h-4 w-4" />
                  Texto
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Logo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6 pt-4">
                {/* Text Input */}
                <div className="space-y-3">
                  <Label htmlFor="text" className="text-sm font-medium text-foreground">
                    Texto a grabar
                  </Label>
                  <Input
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ingresá tu texto o nombre de marca"
                    className="bg-background"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">Tamaño de texto</Label>
                    <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                  </div>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={12}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Position X */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">Posición horizontal</Label>
                    <span className="text-sm text-muted-foreground">{textPosition.x}%</span>
                  </div>
                  <Slider
                    value={[textPosition.x]}
                    onValueChange={([x]) => setTextPosition(prev => ({ ...prev, x }))}
                    min={10}
                    max={90}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Position Y */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">Posición vertical</Label>
                    <span className="text-sm text-muted-foreground">{textPosition.y}%</span>
                  </div>
                  <Slider
                    value={[textPosition.y]}
                    onValueChange={([y]) => setTextPosition(prev => ({ ...prev, y }))}
                    min={10}
                    max={90}
                    step={1}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="pt-4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-12 text-center">
                  <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Arrastrá tu logo aquí
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, SVG o AI (máx. 5MB)
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Seleccionar archivo
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Para mejor resultado, enviá tu logo en formato vectorial junto con la cotización.
                </p>
              </TabsContent>
            </Tabs>

            {/* Quote Form */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground">Solicitar cotización</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-foreground">
                    Empresa *
                  </Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nombre de tu empresa"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                  Cantidad (mín. 50 unidades) *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ej: 100"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Notas adicionales
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre el diseño, colores, materiales preferidos..."
                  className="bg-background min-h-[100px]"
                />
              </div>

              <Button className="w-full" size="lg">
                Solicitar cotización mayorista
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Respuesta garantizada en 24 horas hábiles. Incluye asesoramiento de diseño sin cargo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
