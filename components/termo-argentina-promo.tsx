"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { useCart, type Product } from "@/lib/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface TermoImageSlide {
  src: string
  alt: string
}

// Imágenes del carrusel (solo imagen, super sutil)
export const DEFAULT_TERMO_SLIDES: TermoImageSlide[] = [
  {
    src: "/images/termo-argentina/termo-argentina-main.jpeg",
    alt: "Termo Negro Media Manija – Grabado en láser temática Argentina",
  },
  {
    src: "/images/termo-argentina/termo-argentina-lifestyle.jpeg",
    alt: "Termo Negro Media Manija – Fotografía en uso matero",
  },
  {
    src: "/images/termo-argentina/termo-argentina-detail.jpg",
    alt: "Detalle del grabado láser sobre acero inoxidable",
  },
]

export interface TermoArgentinaPromoProps {
  slides?: TermoImageSlide[]
}

const WHATSAPP_PHONE = "5493772625862"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function TermoArgentinaPromo({ slides = DEFAULT_TERMO_SLIDES }: TermoArgentinaPromoProps) {
  const { addItem } = useCart()
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Temporizador de 3 días de oferta
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    setMounted(true)
    const STORAGE_KEY = "freqar_termo_media_manija_timer_v1"
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

    let targetTime: number
    const savedTime = localStorage.getItem(STORAGE_KEY)

    if (savedTime && !isNaN(Number(savedTime))) {
      targetTime = Number(savedTime)
      if (targetTime <= Date.now()) {
        targetTime = Date.now() + THREE_DAYS_MS
        localStorage.setItem(STORAGE_KEY, targetTime.toString())
      }
    } else {
      targetTime = Date.now() + THREE_DAYS_MS
      localStorage.setItem(STORAGE_KEY, targetTime.toString())
    }

    const updateCountdown = () => {
      const diff = targetTime - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    updateCountdown()
    const timerInterval = setInterval(updateCountdown, 1000)
    return () => clearInterval(timerInterval)
  }, [])

  // Sincronizar slide activo
  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap())
    }
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Autoplay sutil con pausa al pasar el cursor
  useEffect(() => {
    if (!api || isHovered) return
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [api, isHovered])

  // Producto para el carrito
  const termoProduct: Product = {
    id: "termo-negro-media-manija-argentina",
    name: "Termo Negro Media Manija – Grabado en láser temática Argentina",
    category: "termos",
    description:
      "Termo de acero inoxidable negro mate con media manija. Grabado en láser integral con temática Argentina. Conserva 24hs frío y 24hs calor.",
    price: 48900,
    originalPrice: 68000,
    stock: true,
    badge: "Argentina",
    image: slides[0]?.src || "/images/termo-argentina/termo-argentina-main.jpeg",
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(termoProduct)
    toast.success("Termo añadido al carrito", {
      description: "Termo Negro Media Manija • Temática Argentina",
    })
    setTimeout(() => setIsAdding(false), 600)
  }

  const whatsappMessage = encodeURIComponent(
    "¡Hola! Me interesa el Termo Negro Media Manija grabado en láser con temática \"Argentina\". ¿Tienen stock disponible?"
  )

  return (
    <section
      id="termo-media-manija"
      className="relative py-12 lg:py-16 overflow-hidden bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Cabecera sutil: Nombre del producto y temática */}
        <div className="text-center space-y-3 mb-6 sm:mb-8">
          {/* Pill sutil de oferta de 3 días y stock */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/50 text-[11px] sm:text-xs text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Oferta especial:{" "}
              <span className="font-mono text-amber-400">
                {mounted
                  ? `${timeLeft.days}d ${String(timeLeft.hours).padStart(2, "0")}h ${String(timeLeft.minutes).padStart(2, "0")}m ${String(timeLeft.seconds).padStart(2, "0")}s`
                  : "3 días"}
              </span>
            </span>
            <span className="text-border">•</span>
            <span className="text-muted-foreground font-medium">
              Solo <strong className="text-foreground">5 unidades</strong>
            </span>
          </div>

          {/* Nombre principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Termo Negro Media Manija
          </h1>

          {/* Subtítulo / Temática */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-normal">
            Grabado en láser con temática{" "}
            <span className="text-foreground font-medium">"Argentina"</span>
          </p>
        </div>

        {/* Carrusel solo de imagen, super sutil */}
        <div className="relative mx-auto rounded-2xl sm:rounded-3xl border border-border/60 bg-neutral-950/60 overflow-hidden shadow-2xl backdrop-blur-sm">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "center",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />

                    {/* Sutil viñeta para integrar con el fondo */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Contador sutil flotante en la esquina superior derecha */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest text-white/90">
            {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>

          {/* Flechas de navegación sutiles (visibles al hover o en desktop) */}
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/75 transition-all flex items-center justify-center cursor-pointer shadow-lg opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/75 transition-all flex items-center justify-center cursor-pointer shadow-lg opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicadores de puntos sutiles en la parte inferior de la imagen */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  currentSlide === idx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Barra de acción sutil debajo del carrusel */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm">
          {/* Precio y beneficios */}
          <div className="flex items-baseline gap-3 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
              $48.900
            </span>
            <span className="text-sm text-muted-foreground line-through font-mono">
              $68.000
            </span>
            <span className="text-xs text-muted-foreground">
              • 3 cuotas sin interés de $16.300
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 sm:flex-none font-semibold text-sm gap-2 h-11 px-6 shadow-md"
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdding ? "Añadiendo..." : "Agregar al Carrito"}
            </Button>

            <Button
              variant="outline"
              className="font-medium text-sm gap-2 h-11 px-4 border-border/80 hover:bg-secondary"
              asChild
            >
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="hidden xs:inline">WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
