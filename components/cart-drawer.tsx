"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Carrito ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-secondary p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Agregá productos para comenzar
              </p>
            </div>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Ver productos
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-secondary shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 max-w-[85%]">
                          <h4 className="font-medium text-foreground leading-tight">
                            {item.name}
                          </h4>
                          {item.variantName && (
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground font-medium uppercase inline-block">
                              {item.variantName}
                            </span>
                          )}
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>

                          {/* Customization Note and Images */}
                          {(item.customizationNote || (item.customizationImages && item.customizationImages.length > 0)) && (
                            <div className="mt-2 p-2 bg-secondary/50 rounded border border-border/40 space-y-1 text-[11px]">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold block">
                                Personalización:
                              </span>
                              {item.customizationNote && (
                                <p className="italic text-foreground leading-tight">
                                  "{item.customizationNote}"
                                </p>
                              )}
                              {item.customizationImages && item.customizationImages.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.customizationImages.map((imgUrl, idx) => (
                                    <a
                                      key={idx}
                                      href={imgUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block border border-border/60 rounded overflow-hidden hover:scale-105 transition-all"
                                    >
                                      <img src={imgUrl} alt="custom design" className="w-8 h-8 object-cover" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mr-2 -mt-2 shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeItem(item.cartItemId)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Reducir cantidad</span>
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Aumentar cantidad</span>
                          </Button>
                        </div>
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-muted-foreground">
                    Calculado en checkout
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    Total
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Seguir comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
