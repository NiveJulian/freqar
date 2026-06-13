"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, FileText, ChevronRight } from "lucide-react"

export default function LegalesPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#privacidad" || hash === "#privacy") {
        setActiveTab("privacy");
      } else {
        setActiveTab("terms");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Legales</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Términos Legales
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Información legal, condiciones de servicio y políticas de privacidad para la tienda virtual de FREQ.AR.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center border-b border-border mb-12">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "terms"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Términos y Condiciones
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "privacy"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Política de Privacidad
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
          {activeTab === "terms" ? (
            <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
              <h2 className="text-2xl font-bold text-foreground mb-4">Términos y Condiciones de Uso</h2>
              <p className="text-xs text-muted-foreground italic">Última actualización: 11 de Junio de 2026</p>
              
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">1. Relación Contractual</h3>
                <p>
                  El acceso y uso de la tienda virtual **FREQ.AR** (en adelante, "el Sitio") está sujeto a los siguientes términos y condiciones. Al navegar por el catálogo, registrar pedidos, cargar diseños o realizar compras en el Sitio, usted acepta explícitamente y se compromete a cumplir con este reglamento de servicio.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">2. Descripción de Productos y Personalización</h3>
                <p>
                  FREQ.AR ofrece productos de bazar y utilitarios (como vasos térmicos, termos, mates y artículos de madera) con la opción de grabado láser personalizado.
                </p>
                <p>
                  Al proveer textos y cargar imágenes/logos para la personalización de su producto:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Usted declara ser el propietario legítimo de dichos diseños o tener la autorización expresa para su uso comercial.</li>
                  <li>Usted asume toda la responsabilidad legal por infracciones a derechos de autor, patentes o marcas comerciales de terceros relacionadas con los archivos subidos.</li>
                  <li>FREQ.AR se reserva el derecho de rechazar diseños que contengan mensajes de odio, violencia o contenido ilegal.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">3. Proceso de Pedidos y Precios</h3>
                <p>
                  Todos los precios expuestos en el Sitio están expresados en pesos argentinos (ARS). Los pedidos realizados a través de la tienda constituyen solicitudes de compra sujetas a verificación de stock, facturación y confirmación del pago.
                </p>
                <p>
                  Los detalles e imágenes de personalización se transmiten de manera segura a nuestro sistema administrativo centralizado operado bajo la plataforma Nexus CRM para su respectivo procesamiento e impresión.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">4. Envíos y Logística</h3>
                <p>
                  Los métodos de entrega incluyen retiro en sucursal y envío a domicilio a través de transporte. Las hojas de ruta y logística son gestionadas por transportistas autorizados integrados con nuestro backend. FREQ.AR no se responsabiliza por retrasos derivados de información de dirección incorrecta o problemas de logística ajenos a la empresa.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">5. Limitación de Responsabilidad</h3>
                <p>
                  FREQ.AR se esfuerza por garantizar que la previsualización del grabado láser coincida visualmente con el producto terminado, sin embargo, debido a las texturas naturales del metal, la madera y otros materiales, el color y acabado final del grabado láser pueden presentar ligeras variaciones de tonalidad que no constituyen fallas de fabricación.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
              <h2 className="text-2xl font-bold text-foreground mb-4">Política de Privacidad y Tratamiento de Datos</h2>
              <p className="text-xs text-muted-foreground italic">Última actualización: 11 de Junio de 2026</p>
              
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">1. Datos Personales que Recopilamos</h3>
                <p>
                  Para procesar las compras y personalizaciones de manera efectiva, recopilamos la siguiente información durante el checkout:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>**Identificación**: Nombre, apellido e información de contacto (correo electrónico y número de teléfono).</li>
                  <li>**Envío**: Domicilio de entrega, ciudad y código postal.</li>
                  <li>**Diseño**: Notas de texto para grabado y archivos de imagen subidos por el cliente (almacenados temporalmente en la nube de Cloudinary a través de nuestro endpoint seguro).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">2. Uso de la Información</h3>
                <p>
                  Los datos del cliente son utilizados exclusivamente para:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Procesar y facturar las compras realizadas.</li>
                  <li>Preparar el grabado láser personalizado basándose en las notas y los archivos cargados.</li>
                  <li>Coordinar las entregas y generar las hojas de ruta.</li>
                  <li>Enviar notificaciones sobre el estado de la compra e integrar canales rápidos de comunicación (como alertas automáticas de WhatsApp).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">3. Compartición con Terceros</h3>
                <p>
                  FREQ.AR no comercializa ni vende los datos personales de sus usuarios. Sus datos solo se comparten con intermediarios indispensables:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>**Nexus CRM**: El sistema administrativo que centraliza la facturación y seguimiento logístico.</li>
                  <li>**Cloudinary**: El servidor seguro en la nube donde se hospedan temporalmente los archivos de imágenes personalizadas.</li>
                  <li>**Pasarelas de Pago (Mercado Pago / MODO)**: Para la validación segura de las transacciones financieras.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">4. Derechos del Titular de los Datos</h3>
                <p>
                  Usted tiene derecho a solicitar el acceso, rectificación o eliminación de sus datos personales de nuestras bases de datos en cualquier momento. Para realizar esta solicitud, puede ponerse en contacto con nuestro equipo de ventas a través de los canales listados en el pie de página de nuestro sitio.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
