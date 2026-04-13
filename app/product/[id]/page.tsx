"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Check, 
  Loader2, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { fetchProductById } from "@/lib/api-service"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const data = await fetchProductById(id as string)
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error("Error loading product:", err)
        setError("No se pudo cargar la información del producto.")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Cargando detalles del producto...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Ups! Algo salió mal</h1>
          <p className="text-muted-foreground">{error || "Producto no encontrado"}</p>
        </div>
        <Button onClick={() => router.push("/")}>Volver a la tienda</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.CategoryProduct?.[0]?.category?.name || "Otros",
      description: product.description || product.name,
      price: product.price || 0,
      originalPrice: product.purchasePrice > product.price ? product.purchasePrice : null,
      stock: (product.stock || 0) > 0,
      badge: product.outstanding ? "Destacado" : null,
      image: product.images?.[0]?.url || "/products/placeholder.jpg"
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const images = product.images?.length > 0 
    ? product.images.map((img: any) => img.url) 
    : ["/products/placeholder.jpg"]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary flex items-center justify-center">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="h-full w-full object-cover transition-all"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg bg-secondary border-2 transition-all",
                      selectedImage === index ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="space-y-4">
              {product.outstanding && <Badge className="mb-2">Producto Destacado</Badge>}
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.CategoryProduct?.[0]?.category?.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1.5 text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <Check className="h-4 w-4" />
                    Disponible
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-destructive font-semibold bg-destructive/5 px-3 py-1 rounded-full border border-destructive/10">
                    <RefreshCw className="h-4 w-4" />
                    Sin stock
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-4 pt-4">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.purchasePrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                    {formatPrice(product.purchasePrice)}
                  </span>
                )}
              </div>

              <Separator className="my-8" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Descripción</h3>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description || "Sin descripción disponible para este producto."}
                  </div>
                </div>

                {/* SKU and other details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1 text-xs uppercase font-semibold">SKU</p>
                    <p className="font-medium text-foreground">{product.sku || "N/A"}</p>
                  </div>
                  {product.specifications?.color && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-muted-foreground mb-1 text-xs uppercase font-semibold">Color</p>
                      <p className="font-medium text-foreground">{product.specifications.color}</p>
                    </div>
                  )}
                  {product.specifications?.talle && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-muted-foreground mb-1 text-xs uppercase font-semibold">Talle / Medida</p>
                      <p className="font-medium text-foreground">{product.specifications.talle}</p>
                    </div>
                  )}
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1 text-xs uppercase font-semibold">Categoría</p>
                    <p className="font-medium text-foreground truncate">{product.CategoryProduct?.[0]?.category?.name || "Varios"}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  <div className="flex items-center rounded-lg border border-border px-2">
                    <button 
                      className="px-3 py-3 text-foreground hover:bg-secondary rounded-md"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-foreground">{quantity}</span>
                    <button 
                      className="px-3 py-3 text-foreground hover:bg-secondary rounded-md"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <Button 
                    size="lg" 
                    className="flex-1 h-auto py-4 text-base font-bold gap-3"
                    onClick={handleAddToCart}
                    disabled={justAdded}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        ¡Agregado al carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Agregar al carrito
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid gap-4 pt-8">
                  <div className="flex items-center gap-3 text-sm italic py-3 px-4 rounded-xl bg-secondary/50 border border-border/50">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    <span>Pago seguro y garantizado por Nexus CRM</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="h-5 w-5" />
                    <span>Envío express disponible para todo el país</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <RefreshCw className="h-5 w-5" />
                    <span>30 días de devolución asegurada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
