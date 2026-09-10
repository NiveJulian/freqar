"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  Flame,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  MessageCircle,
  ThermometerSun,
  Layers,
  ArrowRight,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart, type Product } from "@/lib/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Imágenes por defecto. Podés cambiarlas aquí o pasar la prop `images` desde la página.
// Las fotos que aportes podés colocarlas en `public/images/termo-argentina/`
export const DEFAULT_TERMO_IMAGES = {
  main: "/images/termo-argentina/termo-argentina-main.jpeg",
  detail: "/images/termo-argentina/termo-argentina-detail.jpg",
  lifestyle: "/images/termo-argentina/termo-argentina-lifestyle.jpeg",
}

export interface TermoArgentinaPromoProps {
  images?: {
    main?: string
    detail?: string
    lifestyle?: string
  }
}

const TOTAL_STOCK = 15
const REMAINING_UNIDADES = 5
const SOLD_UNIDADES = TOTAL_STOCK - REMAINING_UNIDADES

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function TermoArgentinaPromo({ images }: TermoArgentinaPromoProps) {
  const imgMain = images?.main || DEFAULT_TERMO_IMAGES.main
  const imgDetail = images?.detail || DEFAULT_TERMO_IMAGES.detail
  const imgLifestyle = images?.lifestyle || DEFAULT_TERMO_IMAGES.lifestyle

  const { addItem } = useCart()
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  // Temporizador persistente de 3 días
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  // Inicializar cuenta regresiva de 3 días con persistencia en localStorage
  useEffect(() => {
    setMounted(true)
    const STORAGE_KEY = "freqar_termo_acero_argentina_timer_v1"
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
      const now = Date.now()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        })
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        })
      }
    }

    updateCountdown()
    const timerInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(timerInterval)
  }, [])

  // Sincronizar slide activo del carrusel
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      const selected = api.selectedScrollSnap()
      setCurrentSlide(selected)
      setActiveTab(selected)
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Autoplay pausado con el cursor (hover)
  useEffect(() => {
    if (!api || isHovered) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [api, isHovered])

  // Producto que se agrega al carrito
  const termoProduct: Product = {
    id: "termo-acero-argentina-3-estrellas",
    name: "Termo de Acero Inoxidable Grabado Láser • Edición Argentina 3 Estrellas (1.2L)",
    category: "termos",
    description:
      "Termo 100% de acero inoxidable 304 bicapa al vacío (1.2L). Grabado láser de fibra óptica indeleble con escudo de Argentina, 3 estrellas y Sol de Mayo. Conserva 24hs calor y 36hs frío. Incluye pico cebador matero 360°.",
    price: 48900,
    originalPrice: 68000,
    stock: true,
    badge: "Oferta Flash",
    image: imgMain,
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(termoProduct)
    toast.success("¡Termo de Acero Argentina añadido al carrito!", {
      description: "Quedan solo 5 unidades al precio promocional de lanzamiento.",
    })
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleScrollToSlide = (index: number) => {
    api?.scrollTo(index)
    setActiveTab(index)
  }

  const slidesData = [
    {
      title: "Oferta y Stock",
      badge: "Lanzamiento Exclusivo",
    },
    {
      title: "Grabado en Acero",
      badge: "Fibra Óptica Indeleble",
    },
    {
      title: "Rendimiento Térmico",
      badge: "Bicapa 24hs Calor",
    },
    {
      title: "Combo y Garantía",
      badge: "Packaging FREQ",
    },
  ]

  const WHATSAPP_PHONE = "5493772625862"
  const whatsappMessage = encodeURIComponent(
    "¡Hola! Quiero aprovechar la oferta especial del Termo de Acero Inoxidable Grabado Argentina 3 Estrellas por $48.900 (quedan 5 unidades)."
  )

  return (
    <section
      id="oferta-termo-argentina"
      className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-background via-card/50 to-background border-b border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Resplandores ambientales celeste y dorado */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Banner superior de urgencia y cuenta regresiva de 3 días */}
        <div className="mb-8 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-card/80 to-amber-950/30 p-4 sm:p-6 backdrop-blur-md shadow-2xl shadow-sky-950/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Título e insignias */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-sky-500/30">
                <Flame className="h-6 w-6 animate-pulse text-amber-300" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="bg-sky-500 hover:bg-sky-600 text-white font-bold tracking-wide uppercase text-xs">
                    Edición Especial Argentina 🇦🇷
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-amber-300 bg-amber-500/10 text-xs font-semibold"
                  >
                    ⚡ Oferta Relámpago (3 Días)
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-1">
                  Nuevo Termo de Acero Inoxidable Grabado Láser • 3 Estrellas
                </h2>
              </div>
            </div>

            {/* Contador de 3 días en tiempo real */}
            <div className="flex items-center gap-3 sm:gap-4 bg-background/80 px-4 py-3 rounded-xl border border-border shadow-inner">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold pr-2 border-r border-border">
                <Clock className="h-4 w-4 text-sky-400 animate-spin" style={{ animationDuration: "10s" }} />
                <span>Termina en:</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-center">
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black font-mono text-foreground leading-none min-w-[28px]">
                    {mounted ? String(timeLeft.days).padStart(2, "0") : "03"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Días
                  </span>
                </div>
                <span className="text-muted-foreground font-bold text-lg -mt-3">:</span>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black font-mono text-foreground leading-none min-w-[28px]">
                    {mounted ? String(timeLeft.hours).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Horas
                  </span>
                </div>
                <span className="text-muted-foreground font-bold text-lg -mt-3">:</span>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black font-mono text-foreground leading-none min-w-[28px]">
                    {mounted ? String(timeLeft.minutes).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Min
                  </span>
                </div>
                <span className="text-muted-foreground font-bold text-lg -mt-3">:</span>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black font-mono text-amber-400 leading-none min-w-[28px]">
                    {mounted ? String(timeLeft.seconds).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium">
                    Seg
                  </span>
                </div>
              </div>
            </div>

            {/* Escasez: Solo 5 unidades */}
            <div className="w-full lg:w-64 flex flex-col gap-1.5 bg-background/50 p-3 rounded-xl border border-red-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block" />
                  ¡Solo {REMAINING_UNIDADES} unidades!
                </span>
                <span className="text-muted-foreground font-medium">
                  {SOLD_UNIDADES}/{TOTAL_STOCK} vendidas
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${(SOLD_UNIDADES / TOTAL_STOCK) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                90% de la tanda reservada. Quedan las últimas 5 piezas.
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor del Carrusel */}
        <div className="relative rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {/* SLIDE 1: Presentación & Oferta de Lanzamiento */}
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
                  <div className="lg:col-span-6 relative flex items-center justify-center">
                    <div className="relative aspect-square w-full max-w-[460px] overflow-hidden rounded-2xl border border-border/80 bg-neutral-950 shadow-2xl group">
                      <img
                        src={imgMain}
                        alt="Termo de acero inoxidable con grabado láser de Argentina 3 Estrellas"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <Badge className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-1 px-3 shadow-lg">
                          ⭐ Edición Campeones 3 Estrellas
                        </Badge>
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-1 px-3 shadow-lg flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5" /> 28% OFF Lanzamiento
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-xl bg-black/75 p-3 backdrop-blur-md border border-white/10 text-white">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                          <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                            ¡Solo {REMAINING_UNIDADES} unidades a precio de oferta!
                          </span>
                        </div>
                        <span className="text-xs text-neutral-300 font-mono">
                          Acero 304 • 1.2L
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          4.9/5 (Más de 320 termos grabados enviados)
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
                        Termo de Acero Inoxidable{" "}
                        <span className="text-sky-400">Grabado Argentina 3 Estrellas</span>
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Cuerpo íntegro de <strong>acero inoxidable 304</strong> bicapa con cámara de vacío.
                        El grabado láser de fibra óptica de alta definición se realiza directamente sobre el acero,
                        garantizando máxima durabilidad sin desgastes, no se borra ni se salta con los lavados.
                      </p>
                    </div>

                    {/* Precios y Cuotas */}
                    <div className="rounded-2xl border border-border bg-secondary/50 p-5 space-y-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                          $48.900
                        </span>
                        <span className="text-lg text-muted-foreground line-through font-mono">
                          $68.000
                        </span>
                        <Badge variant="destructive" className="font-bold text-xs">
                          Ahorrás $19.100
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-foreground font-medium bg-background/60 p-2.5 rounded-lg border border-border/50">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>3 Cuotas sin interés de <strong>$16.300</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground font-medium bg-background/60 p-2.5 rounded-lg border border-border/50">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>15% OFF por Transferencia (<strong>$41.565</strong>)</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        size="lg"
                        className="flex-1 text-base font-bold gap-2.5 h-13 shadow-xl hover:scale-[1.02] transition-transform bg-primary text-primary-foreground"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {isAdding ? "Agregando..." : "Comprar Ahora (Añadir al Carrito)"}
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-green-600/40 text-green-400 hover:bg-green-950/20 hover:text-green-300 font-semibold gap-2 h-13"
                        asChild
                      >
                        <a
                          href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-5 w-5 text-green-500" />
                          Consultar WhatsApp
                        </a>
                      </Button>
                    </div>

                    {/* Garantías */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Truck className="h-4 w-4 text-sky-400" />
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Envío a todo el país
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-amber-400" />
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Acero 304 Quirúrgico
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Award className="h-4 w-4 text-emerald-400" />
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Grabado Indeleble
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* SLIDE 3: Rendimiento Térmico en Acero Doble Capa */}
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
                  <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                    <Badge variant="outline" className="w-fit border-amber-400/40 text-amber-400">
                      ❄️ Rendimiento Térmico Extremo
                    </Badge>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                      Doble Capa de Acero 304 al Vacío para la{" "}
                      <span className="text-sky-400">Cebada Perfecta</span>
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Construido con tecnología bicapa de <strong>acero inoxidable 304</strong> y aislamiento
                      al vacío. Conserva la temperatura de cebado del mate (75°C - 80°C) durante toda la jornada,
                      sin transmitir calor al exterior de las paredes de acero.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
                        <div className="flex items-center gap-2 text-sky-400 font-bold text-base sm:text-lg">
                          <ThermometerSun className="h-5 w-5" />
                          <span>24 Horas</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground mt-1">Agua Caliente (Mate)</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Temperatura constante sin pérdida de calor en el acero.</p>
                      </div>

                      <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-base sm:text-lg">
                          <ThermometerSun className="h-5 w-5" />
                          <span>36 Horas</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground mt-1">Agua Helada (Tereré)</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Mantiene cubos de hielo intactos bajo altas temperaturas.</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                        <span><strong>Pico Matero 360° Cebador:</strong> Caudal direccionado anti-goteo que no quema la yerba.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                        <span><strong>Acero Inoxidable SUS 304:</strong> Grado alimenticio, libre de BPA, no transmite olores ni sabores.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                        <span><strong>Manija reforzada ergonómica:</strong> Agarre firme y balanceado para cebadas seguras.</span>
                      </li>
                    </ul>

                    <div className="pt-2">
                      <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto gap-2 font-bold">
                        <ShoppingCart className="h-4 w-4" />
                        Reservar 1 de las 5 Unidades
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative flex items-center justify-center">
                    <div className="relative aspect-square w-full max-w-[460px] overflow-hidden rounded-2xl border border-border/80 bg-neutral-950 shadow-2xl group">
                      <img
                        src={imgMain}
                        alt="Rendimiento térmico en termo de acero inoxidable"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2 rounded-xl bg-black/85 p-4 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white uppercase tracking-wider">Ficha Técnica de Acero</span>
                          <span className="text-amber-400 font-mono">1200 ml</span>
                        </div>
                        <p className="text-xs text-neutral-300">
                          Material: Acero Inoxidable 304 bicapa al vacío • Altura: 34 cm • Diámetro: 9.5 cm • Tapón cebador hermético.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* SLIDE 4: Experiencia Matera, Packaging & Garantía */}
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
                  <div className="lg:col-span-6 relative flex items-center justify-center">
                    <div className="relative aspect-square w-full max-w-[460px] overflow-hidden rounded-2xl border border-border/80 bg-neutral-950 shadow-2xl group">
                      <img
                        src={imgLifestyle}
                        alt="Termo de acero inoxidable con mate y bombilla en mesa matera"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-sky-500 text-white text-xs font-bold py-1 px-3 shadow-lg">
                          🇦🇷 Experiencia Matera Argentina
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl bg-black/80 p-3 text-xs text-neutral-300 backdrop-blur-md border border-white/10">
                        Tu compañero inseparable de acero para viajes, rutas, asados y mañanas de mate.
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                    <Badge variant="outline" className="w-fit border-green-500/40 text-green-400">
                      🎁 Combo Completo & Garantía Oficial
                    </Badge>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                      El Termo de Acero Definitivo:{" "}
                      <span className="text-amber-400">Listo para Regalar o Disfrutar</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-400" />
                          ¿Qué incluye tu compra hoy?
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                          <li>1x Termo de <strong>acero inoxidable 304</strong> de 1.2L grabado láser con motivo Selección Argentina.</li>
                          <li>1x Tapón cebador matero 360° hermético anti-derrame.</li>
                          <li>1x Tapa térmica de acero desmontable multifunción (funciona como vaso).</li>
                          <li>1x Caja packaging rígido FREQ.AR con protección antichoque.</li>
                          <li>Certificado de Garantía Térmica oficial FREQ.AR.</li>
                        </ul>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-card p-3.5 border border-sky-500/30">
                        <div className="flex items-center gap-2.5">
                          <Truck className="h-5 w-5 text-sky-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-foreground">Despacho Inmediato</p>
                            <p className="text-[11px] text-muted-foreground">Enviamos dentro de las 24hs hábiles a todo el país con código de seguimiento.</p>
                          </div>
                        </div>
                        <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/40 text-[11px]">
                          Todo el país
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        className="flex-1 font-bold gap-2 text-base shadow-xl bg-primary text-primary-foreground"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Aprovechar Últimas 5 Unidades
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleScrollToSlide(0)}
                        className="gap-2 font-medium"
                      >
                        Volver a la Oferta
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          {/* Botones de navegación laterales */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 hidden md:block">
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 rounded-full bg-background/80 backdrop-blur-md shadow-xl border border-border hover:scale-110 transition-transform"
              onClick={() => api?.scrollPrev()}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 hidden md:block">
            <Button
              variant="secondary"
              size="icon"
              className="h-11 w-11 rounded-full bg-background/80 backdrop-blur-md shadow-xl border border-border hover:scale-110 transition-transform"
              onClick={() => api?.scrollNext()}
              aria-label="Slide siguiente"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </Button>
          </div>

          {/* Indicadores inferiores (dots) */}
          <div className="flex items-center justify-center gap-2 pb-6 pt-2 bg-card">
            {slidesData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleScrollToSlide(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all cursor-pointer",
                  currentSlide === idx
                    ? "w-8 bg-sky-400"
                    : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
