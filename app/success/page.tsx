"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";
import {
  getMercadoPagoPayloadFromSearchParams,
  shouldSyncMercadoPagoReturn,
  syncMercadoPagoReturn,
} from "@/lib/mercadopago";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const syncedRef = useRef(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [syncMessage, setSyncMessage] = useState<string>("");

  const mpPayload = useMemo(
    () =>
      getMercadoPagoPayloadFromSearchParams(
        new URLSearchParams(searchParams.toString()),
      ),
    [searchParams],
  );

  useEffect(() => {
    if (!shouldSyncMercadoPagoReturn(mpPayload) || syncedRef.current) {
      if (!shouldSyncMercadoPagoReturn(mpPayload)) {
        clearCart();
      }
      return;
    }

    syncedRef.current = true;

    const syncPayment = async () => {
      setSyncStatus("loading");
      try {
        const result = await syncMercadoPagoReturn({
          ...mpPayload,
          status: mpPayload.status || "approved",
          collection_status: mpPayload.collection_status || "approved",
        });

        if (result?.success) {
          setSyncStatus("done");
          setSyncMessage(
            result.message || "Pago actualizado correctamente en el CRM.",
          );
        } else {
          setSyncStatus("error");
          setSyncMessage(
            result?.message || "No pudimos confirmar el pago en el backend.",
          );
        }
      } catch (error: any) {
        setSyncStatus("error");
        setSyncMessage(
          error?.message || "No pudimos sincronizar el pago con el backend.",
        );
      } finally {
        clearCart();
      }
    };

    syncPayment();
  }, [clearCart, mpPayload]);

  const hasMercadoPagoData = Boolean(
    mpPayload.collection_id ||
    mpPayload.payment_id ||
    mpPayload.external_reference,
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
        <div className="relative rounded-full bg-green-100 p-6">
          <CheckCircle2 className="h-20 w-20 text-green-600" />
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
        {hasMercadoPagoData ? "Pago confirmado" : "Pago confirmado"}
      </h1>

      <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
        {hasMercadoPagoData
          ? "Estamos sincronizando los datos de tu pago mediante Mercado Pago."
          : "Muchas gracias por tu confianza. Tu pedido ha sido procesado correctamente y ya estamos preparando todo."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 flex-1 bg-foreground text-background hover:bg-foreground/90 py-7 text-lg font-bold"
        >
          <Link href="/">Seguir comprando</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 flex-1 py-7 text-lg font-bold"
        >
          <Link href="/" className="flex items-center justify-center gap-2">
            Ir al inicio <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="mt-16 p-6 rounded-2xl bg-secondary/50 border border-border max-w-lg">
        <PartyPopper className="h-8 w-8 text-primary mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2">¿Que sigue ahora?</h3>
        <p className="text-sm text-muted-foreground">
          Te mantendremos al tanto del estado de tu pedido a traves de
          WhatsApp o el correo electronico que proporcionaste.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Cargando...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm text-foreground">{value || "-"}</p>
    </div>
  );
}
