"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, Eye, Check, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart, type Product } from "@/lib/cart-context"
import { fetchProducts } from "@/lib/api-service"
import Link from "next/link"

const categories = [
  { id: "all", name: "Todos" },
  { id: "vasos", name: "Vasos" },
  { id: "termos", name: "Termos" },
  { id: "mates", name: "Mates" },
  { id: "madera", name: "Madera" },
]

// Mapping from CRM product to Freqar product
const mapCrmProduct = (crmProd: any): Product => ({
  id: crmProd.id,
  name: crmProd.name,
  category: crmProd.CategoryProduct?.[0]?.category?.name?.toLowerCase() || "otros",
  description: crmProd.description || crmProd.name,
  price: crmProd.sellingPrice || 0,
  originalPrice: null, // CRM might not have this directly in simple fetch
  stock: (crmProd.stock || 0) > 0,
  badge: crmProd.outstanding ? "Destacado" : null,
  image: crmProd.images?.[0]?.url || "/products/placeholder.jpg"
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  
  const isInCart = items.some(item => item.id === product.id)
  const quantity = items.find(item => item.id === product.id)?.quantity || 0

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/50",
        !product.stock && "opacity-60"
      )}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            variant={product.badge === "Agotado" ? "secondary" : "default"}
            className={cn(
              "font-semibold shadow-sm",
              product.badge === "Nuevo" ? "bg-blue-500 hover:bg-blue-600" : ""
            )}
          >
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Cart indicator */}
      {isInCart && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in">
            <Check className="h-3 w-3 mr-1" />
            {quantity}
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-secondary relative">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
           <Button 
            size="icon" 
            variant="secondary" 
            className="h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
            asChild
          >
            <Link href={`/product/${product.id}`}>
              <Eye className="h-5 w-5" />
            </Link>
          </Button>
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={handleAdd}
            disabled={!product.stock}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {product.category}
          </p>
          <Link href={`/product/${product.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            variant={product.stock ? (justAdded ? "secondary" : "default") : "secondary"}
            disabled={!product.stock}
            className="h-9"
            onClick={handleAdd}
          >
            {!product.stock ? "Agotado" : justAdded ? "Agregado" : "Agregar"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pageSize = 12

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const categoryParam = activeCategory === "all" ? "" : activeCategory
        const response = await fetchProducts(
          currentPage, 
          pageSize, 
          categoryParam, 
          minPrice ? parseFloat(minPrice) : undefined,
          maxPrice ? parseFloat(maxPrice) : undefined
        )
        const mappedProducts = response.info.data.map(mapCrmProduct)
        setProducts(mappedProducts)
        setTotalPages(response.info.meta.totalPages)
        setTotalProducts(response.info.meta.total)
        setError(null)
      } catch (err) {
        console.error("Error loading products:", err)
        setError("No se pudieron cargar los productos.")
      } finally {
        setIsLoading(false)
        if (currentPage > 1) {
          const element = document.getElementById("productos")
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }

    const timeout = setTimeout(loadProducts, 500) // Debounce filters
    return () => clearTimeout(timeout)
  }, [currentPage, activeCategory, minPrice, maxPrice])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveCategory("all")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  return (
    <section id="productos" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
              E-Commerce Meraki
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl text-balance">
              Nuestra Colección
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground text-lg">
              Explora nuestros productos grabados con tecnología láser de alta precisión.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <p className="hidden lg:block text-sm text-muted-foreground font-medium">
              Mostrando <span className="text-foreground">{products.length}</span> de <span className="text-foreground">{totalProducts}</span> productos
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-64 space-y-8 flex-shrink-0 lg:block",
            isSidebarOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden"
          )}>
            <div className="flex items-center justify-between lg:hidden mb-8">
              <h3 className="text-xl font-bold">Filtros</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground pb-4 border-b">Categorías</h3>
                <div className="mt-4 flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={cn(
                        "text-left py-2 px-3 rounded-md text-sm transition-all flex items-center justify-between",
                        activeCategory === cat.id 
                          ? "bg-secondary text-foreground font-bold" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      {cat.name}
                      {activeCategory === cat.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground pb-4 border-b">Rango de Precio</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Min" 
                      type="number" 
                      value={minPrice} 
                      onChange={(e) => {
                        setMinPrice(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="text-sm h-10"
                    />
                    <span className="text-muted-foreground text-xs font-bold">-</span>
                    <Input 
                      placeholder="Max" 
                      type="number" 
                      value={maxPrice} 
                      onChange={(e) => {
                        setMaxPrice(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="text-sm h-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[5000, 10000, 20000, 50000].map(val => (
                      <Badge 
                        key={val} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          setMaxPrice(val.toString())
                          setCurrentPage(1)
                        }}
                      >
                        Hasta ${val.toLocaleString()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors px-0"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar todos los filtros
              </Button>
            </div>
            
            {isSidebarOpen && (
              <Button className="w-full mt-12" onClick={() => setIsSidebarOpen(false)}>
                Ver Resultados
              </Button>
            )}
          </aside>

          {/* Product Listing Area */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 bg-secondary/20 rounded-3xl">
                <div className="relative">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <Package className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">Preparando catálogo...</p>
                  <p className="text-muted-foreground">Estamos cargando lo mejor para vos</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-32 bg-destructive/5 rounded-3xl border border-destructive/20">
                <p className="text-destructive font-bold text-xl mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Intentar nuevamente
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-secondary/20 rounded-3xl">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-bold mb-2">No encontramos resultados</h3>
                <p className="text-muted-foreground mb-8 text-balance max-w-md mx-auto">
                  Intentá ajustando los filtros o buscando en otra categoría.
                </p>
                <Button onClick={clearFilters}>Limpiar Filtros</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-16 flex flex-col items-center justify-center gap-6 border-t border-border pt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 transition-all hover:bg-secondary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (currentPage > 3 && totalPages > 5) {
                        pageNum = currentPage - 2 + i;
                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                      }
                      if (pageNum < 1) return null;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "ghost"}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "h-10 w-10 p-0 transition-all font-bold",
                            currentPage === pageNum && "shadow-lg scale-110"
                          )}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 transition-all hover:bg-secondary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
