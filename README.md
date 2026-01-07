# LibroYa Admin Hub

Panel de administración para la gestión de libros, usuarios y reservas de la plataforma LibroYa.

## Características

- Gestión completa de libros (crear, editar, eliminar)
- Administración de usuarios y sus reservas
- Sistema de reservas con estados (pendiente, confirmada, completada, cancelada)
- Confirmación de reservas mediante código QR o localizador alfanumérico
- Dashboard con métricas en tiempo real
- Notificaciones de reservas próximas a vencer
- Sistema de autenticación para administradores

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- Axios
- date-fns

## Requisitos

- Node.js (versión 16 o superior)
- npm

## Instalación

```sh
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Navegar al directorio del proyecto
cd libroya-admin-hub

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar el archivo de ejemplo y configurar con tu URL de API
cp .env.example .env
# Editar .env con la URL correcta de tu backend

# Iniciar el servidor de desarrollo
npm run dev
```

## Scripts disponibles

```sh
# Desarrollo
npm run dev

# Build para producción
npm run build

# Build para desarrollo
npm run build:dev

# Preview del build
npm run preview

# Linting
npm run lint
```

## Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables
├── contexts/        # Context API (autenticación)
├── hooks/          # Custom hooks
├── pages/          # Páginas de la aplicación
├── services/       # Servicios de API
├── types/          # Definiciones de TypeScript
└── utils/          # Utilidades y constantes
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_BASE_URL=<URL_DE_TU_BACKEND>
```

Ejemplo para desarrollo local:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Licencia

Proyecto publico realizado por Iván Pérez - Alumno en prácticas de Agilia.
