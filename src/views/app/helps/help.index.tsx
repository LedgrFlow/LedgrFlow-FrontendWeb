// app/helps/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Helps() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ¿Qué es esta herramienta?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Esta aplicación es una interfaz de usuario moderna diseñada para
            trabajar cómodamente con archivos <code>.ledger</code>.  Proporciona
            una experiencia visual interactiva que facilita la lectura, edición,
            validación y análisis de registros contables directamente desde el
            navegador.
          </p>
          <p>
            A diferencia de los editores de texto tradicionales, esta
            herramienta permite:
          </p>
          <ul className="list-disc pl-6">
            <li>Visualizar transacciones de forma estructurada.</li>
            <li>Rellenar registros contables con formularios amigables.</li>
            <li>Resaltar errores comunes o inconsistencias.</li>
            <li>
              Filtrar y buscar transacciones por cuentas, fechas o etiquetas.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            ¿Qué es un archivo <code>.ledger</code>?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Un archivo <code>.ledger</code> es un archivo de texto plano que
            representa transacciones contables en el formato del software{" "}
            <strong>Ledger CLI</strong>, una poderosa herramienta de
            contabilidad basada en texto.
          </p>
          <p>Puedes encontrar más información sobre Ledger aquí:</p>
          <div className="flex space-x-4">
            <a
              href="https://www.ledger-cli.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Sitio oficial</Button>
            </a>
            <a
              href="https://github.com/ledger/ledger"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Repositorio GitHub</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            ¿Qué ofrece esta app?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
          <ul className="list-disc pl-6">
            <li>
              Editor visual para archivos <code>.ledger</code>.
            </li>
            <li>Lectura estructurada de cuentas, balances y transacciones.</li>
            <li>
              Detección de errores comunes (saldos desbalanceados, fechas
              inválidas, etc.).
            </li>
            <li>Filtros por fechas, cuentas o etiquetas.</li>
            <li>Soporte para múltiples archivos contables.</li>
            <li>Almacenamiento local y en la nube (próximamente).</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Futuras herramientas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
          <ul className="list-disc pl-6">
            <li>
              Integración con automatizaciones (via Zapier, cronjobs, APIs
              externas).
            </li>
            <li>
              Exportación directa a formatos como Excel, CSV o Google Sheets.
            </li>
            <li>Exportación y conexión a bases de datos SQL.</li>
            <li>
              Panel de dashboards interactivos (gráficas de ingresos, egresos,
              categorías).
            </li>
            <li>Colaboración multiusuario y control de versiones.</li>
            <li>Soporte para presupuestos, metas y reportes personalizados.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center pt-8">
        <p className="text-muted-foreground text-sm">
          ¿Tienes sugerencias o deseas contribuir al desarrollo?
        </p>
        <a
          href="https://github.com/tuusuario/tu-proyecto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="mt-2">Ir al repositorio del proyecto</Button>
        </a>
      </div>
    </div>
  );
}
