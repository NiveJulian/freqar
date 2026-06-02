"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { petOwners } from "@/lib/links-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download, ExternalLink, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function QRGeneratorPage() {
  const [selectedPetId, setSelectedPetId] = useState(petOwners[0]?.id || "");
  const [domain, setDomain] = useState("https://freq.ar");
  const [customText, setCustomText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("H"); // H recomendada para grabados
  const [margin, setMargin] = useState(4);
  const [qrSize, setQrSize] = useState(400);
  const [transparentBackground, setTransparentBackground] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generar la URL final
  const activeSlug = isCustomMode ? customText : `links/${selectedPetId}`;
  const cleanDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;
  const finalUrl = isCustomMode ? customText : `${cleanDomain}/${activeSlug}`;

  // Generar Código QR en Canvas
  const generateQR = async () => {
    if (!finalUrl) return;
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, finalUrl, {
          errorCorrectionLevel: errorCorrection,
          margin: margin,
          width: qrSize,
          color: {
            dark: "#000000",  // QR Negro
            light: transparentBackground ? "#00000000" : "#ffffff", // Fondo Blanco o Transparente
          },
        });
      }
    } catch (err) {
      console.error("Error al generar el QR", err);
    }
  };

  useEffect(() => {
    // Detectar el host del navegador al montar
    if (typeof window !== "undefined") {
      setDomain(window.location.origin);
    }
  }, []);

  useEffect(() => {
    generateQR();
  }, [finalUrl, errorCorrection, margin, qrSize, isCustomMode, selectedPetId, transparentBackground]);

  // Descargar como PNG (Alta resolución)
  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    const filename = isCustomMode 
      ? "qr_personalizado.png" 
      : `qr_freq_${selectedPetId}.png`;
    
    link.download = filename;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // Descargar como SVG (Vectores, ideal para LightBurn, Corel, Illustrator, etc.)
  const downloadSVG = async () => {
    if (!finalUrl) return;
    try {
      const svgString = await QRCode.toString(finalUrl, {
        type: "svg",
        errorCorrectionLevel: errorCorrection,
        margin: margin,
        width: qrSize,
        color: {
          dark: "#000000",
          light: transparentBackground ? "#00000000" : "#ffffff",
        },
      });

      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = isCustomMode 
        ? "qr_personalizado.svg" 
        : `qr_freq_${selectedPetId}.svg`;
      
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al generar el SVG del QR", err);
    }
  };

  const selectedPet = petOwners.find(p => p.id === selectedPetId);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-3 py-1 bg-foreground/5 backdrop-blur-sm text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            <QrCode className="h-3.5 w-3.5 text-emerald-400" />
            Herramienta Local de Grabado
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
            Generador de Códigos QR
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Genera códigos QR de alta definición (incluyendo archivos vectoriales SVG) listos para importar a tu software de grabado láser (como LightBurn, RDWorks o CorelDraw).
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-7 bg-card/30 border border-border p-6 rounded-2xl backdrop-blur-md space-y-6">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              1. Configuración del Contenido
            </h2>

            {/* Selector de modo */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-lg border border-border">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${!isCustomMode ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Mascotas Configuradas
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${isCustomMode ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Enlace Personalizado
              </button>
            </div>

            {/* Dirección de Dominio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                Dominio Base (URL)
              </label>
              <Input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://freq.ar"
                className="bg-background/80 border-border focus:border-foreground/50 transition-all rounded-lg"
              />
              <p className="text-[10px] text-muted-foreground">
                Define el dominio que tendrá la URL final del QR. Cambia automáticamente según estés en modo local o producción.
              </p>
            </div>

            {/* Modo: Mascotas */}
            {!isCustomMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                    Seleccionar Mascota / Cliente
                  </label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full bg-background border border-border focus:border-foreground/50 text-foreground py-2.5 px-3 rounded-lg text-sm transition-all focus:outline-none cursor-pointer"
                  >
                    {petOwners.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.petName} ({pet.ownerName})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPet && (
                  <div className="p-4 rounded-xl bg-background/50 border border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mascota:</span>
                      <strong className="text-foreground">{selectedPet.petName} ({selectedPet.petType === 'dog' ? 'Perro' : selectedPet.petType === 'cat' ? 'Gato' : 'Otros'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dueño:</span>
                      <span className="text-foreground">{selectedPet.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono WhatsApp:</span>
                      <span className="text-foreground font-mono">+{selectedPet.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ruta final:</span>
                      <span className="text-emerald-400 font-mono">/links/{selectedPet.id}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Modo: Personalizado */
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                  Enlace Completo / Texto del QR
                </label>
                <Input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="https://ejemplo.com/cualquier-ruta"
                  className="bg-background/80 border-border focus:border-foreground/50 transition-all rounded-lg"
                />
              </div>
            )}

            <div className="border-t border-border/60 pt-6 space-y-6">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                2. Parámetros de Grabado Láser
              </h2>

              {/* Nivel de corrección de errores */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                    Nivel de Corrección de Errores (ECL)
                  </label>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    ECL: {errorCorrection}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {(["L", "M", "Q", "H"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setErrorCorrection(level)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        errorCorrection === level
                          ? "bg-foreground text-background border-foreground font-black"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {level === "L" && "Bajo (7%)"}
                      {level === "M" && "Medio (15%)"}
                      {level === "Q" && "Alto (25%)"}
                      {level === "H" && "Máximo (30%)"}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-start text-[10px] text-muted-foreground bg-background/40 p-3 rounded-lg border border-border/20">
                  <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Recomendado Nivel Máximo (H) para chapitas de mascotas:</strong> Si la chapita metálica grabada se raya, gasta o ensucia con el uso del collar (hasta un 30%), el QR continuará siendo 100% legible y escaneable.
                  </span>
                </div>
              </div>

              {/* Márgenes */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase text-muted-foreground tracking-wider">Margen Exterior (Zonas de Silencio)</span>
                  <span className="font-mono text-foreground font-bold">{margin} módulos</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-foreground"
                />
                <p className="text-[9px] text-muted-foreground">
                  Un margen blanco libre alrededor del QR garantiza que los teléfonos móviles puedan enfocar y descifrar el código sin interferencia de los bordes físicos de la chapita.
                </p>
              </div>

              {/* Tamaño */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase text-muted-foreground tracking-wider">Tamaño de Generación</span>
                  <span className="font-mono text-foreground font-bold">{qrSize} x {qrSize} px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

              {/* Fondo Transparente */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                    Fondo del Código QR
                  </label>
                  <Badge variant="outline" className={`text-[10px] ${transparentBackground ? 'text-emerald-400 border-emerald-500/30' : 'text-muted-foreground'}`}>
                    {transparentBackground ? "Transparente" : "Blanco"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTransparentBackground(false)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      !transparentBackground
                        ? "bg-foreground text-background border-foreground font-black"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Fondo Blanco (Estándar)
                  </button>
                  <button
                    onClick={() => setTransparentBackground(true)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      transparentBackground
                        ? "bg-foreground text-background border-foreground font-black"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Fondo Transparente
                  </button>
                </div>
                <p className="text-[9px] text-muted-foreground">
                  El fondo transparente es ideal para superponer el QR en tus propios diseños o directamente para LightBurn, evitando que se dibuje un cuadrado blanco de fondo.
                </p>
              </div>
            </div>
          </div>

          {/* QR Preview Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-card/30 border border-border p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6">
              <h2 className="text-lg font-bold font-heading text-foreground w-full border-b border-border pb-3">
                Vista Previa de Grabado
              </h2>

              {/* Canvas Render */}
              <div className={`p-6 rounded-2xl border border-border/85 shadow-2xl flex items-center justify-center select-none transition-all ${
                transparentBackground 
                  ? "bg-[linear-gradient(45deg,#e0e0e0_25%,transparent_25%),linear-gradient(-45deg,#e0e0e0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e0e0e0_75%),linear-gradient(-45deg,transparent_75%,#e0e0e0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-white" 
                  : "bg-white"
              }`}>
                <canvas ref={canvasRef} className="max-w-full h-auto aspect-square rounded" />
              </div>

              {/* Preview de la URL final */}
              <div className="w-full space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Enlace codificado en el QR
                </p>
                <div className="bg-background/80 border border-border py-2.5 px-3 rounded-lg flex justify-between items-center w-full">
                  <span className="font-mono text-xs text-foreground truncate max-w-[85%]">
                    {finalUrl}
                  </span>
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Abrir y verificar enlace en navegador"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Botones de descarga */}
              <div className="w-full flex flex-col gap-2 pt-2">
                <Button
                  onClick={downloadSVG}
                  className="w-full py-5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Download className="h-4 w-4" />
                  Descargar SVG (Vectores)
                </Button>
                <Button
                  onClick={downloadPNG}
                  variant="outline"
                  className="w-full py-5 text-sm font-semibold rounded-xl gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Descargar PNG (Imagen Plana)
                </Button>
              </div>
            </div>

            {/* Recomendaciones adicionales */}
            <div className="bg-foreground/5 border border-border p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Compatibilidad con Láser
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Usa siempre el formato <strong>SVG</strong> para importar en programas vectoriales como <strong>LightBurn</strong>. Los archivos vectoriales garantizan bordes limpios sin pixelado, optimizando los trayectos de grabado del cabezal láser.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
