import { Zap, Target, Users } from "lucide-react"

const values = [
  {
    icon: Zap,
    title: "Precisión",
    description: "Tecnología láser de última generación para grabados con detalles milimétricos."
  },
  {
    icon: Target,
    title: "Compromiso",
    description: "Cada proyecto es tratado con la dedicación que tu marca merece."
  },
  {
    icon: Users,
    title: "Colaboración",
    description: "Trabajamos junto a vos para lograr exactamente lo que necesitás."
  },
]

export function About() {
  return (
    <section id="nosotros" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Sobre nosotros
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
              Grabamos historias en cada pieza
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              FREQ.AR nació de la pasión por la precisión y el detalle. Somos especialistas 
              en grabado láser para empresas que buscan diferenciarse con productos únicos 
              y personalizados.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Con tecnología de última generación y un equipo comprometido, transformamos 
              objetos cotidianos en piezas que comunican la identidad de tu marca. 
              Cada grabado es una oportunidad de dejar huella.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-10">
              <div>
                <div className="text-3xl font-bold text-foreground">5+</div>
                <div className="mt-1 text-sm text-muted-foreground">Años de experiencia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="mt-1 text-sm text-muted-foreground">Producción local</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">24hs</div>
                <div className="mt-1 text-sm text-muted-foreground">Respuesta cotización</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="flex gap-6 rounded-lg border border-border bg-background p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground">
                  <value.icon className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
