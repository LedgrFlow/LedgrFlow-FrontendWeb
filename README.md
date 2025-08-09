# LedgrFlow (Frontend)

**Interfaz moderna para la contabilidad en texto plano — construida con React, TypeScript y ViteJS.**

Este es el cliente web oficial de [LedgrFlow](../README.md), diseñado para ofrecer una experiencia visual, ágil y potente para trabajar con archivos Ledger. Combina la precisión contable con un diseño limpio y herramientas interactivas para simplificar el trabajo diario.

---

## 🖥️ Tecnologías utilizadas

- **React 18** — Biblioteca para construir interfaces de usuario.
- **TypeScript** — Tipado estático para mayor robustez y mantenibilidad.
- **ViteJS** — Bundler ultrarrápido para desarrollo y producción.
- **Tailwind CSS** — Estilado moderno y eficiente.
- **ShadCN/UI** — Componentes reutilizables y accesibles.
<!-- - **SWR** — Manejo de estado de datos remoto. -->
<!-- - **Lightweight Charts** — Gráficos financieros interactivos. -->

---

## 🚀 Características del frontend

- Editor contable con autocompletado y validación visual.
- Dashboard dinámico con gráficos y reportes.
- Navegación rápida y carga instantánea gracias a Vite.
- Integración con el backend de LedgrFlow vía API.
<!-- - Diseño responsive y accesible. -->

---

## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- Backend de **LedgrFlow** corriendo (puedes levantarlo con Docker o localmente).

---

## 🛠️ Instalación y ejecución

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tuusuario/ledgrflow.git
cd ledgrflow/frontend
npm install
```

Crea el archivo `.env` en la carpeta `frontend` con la URL del backend:

```env
VITE_API_URL=http://localhost:3000
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

El proyecto estará disponible en:
➡️ **[http://localhost:5173](http://localhost:5173)**

---

## 🏗️ Scripts disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila el proyecto para producción
npm run preview   # Previsualiza el build de producción
npm run lint      # Analiza y corrige errores de estilo y sintaxis
```

---

## 🤝 Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu mejora:

   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```

3. Haz commit de tus cambios:

   ```bash
   git commit -m "Agregada nueva funcionalidad"
   ```

4. Sube tu rama:

   ```bash
   git push origin mi-nueva-funcionalidad
   ```

5. Abre un Pull Request.

---

## 🧑‍💻 Autor

Desarrollado por [@EddyBel](https://github.com/EddyBel) — Contador en formación y amante del texto plano.

-
