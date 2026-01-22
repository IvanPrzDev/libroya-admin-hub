# LibroYa Admin Hub

Panel de administración para la gestión de libros, usuarios y reservas de la plataforma LibroYa.

## Características

- Gestión completa de libros (CRUD con validaciones)
- Administración de usuarios y roles
- Sistema de reservas con estados y transiciones
- Confirmación de reservas mediante QR o código alfanumérico
- Dashboard con métricas y gráficos en tiempo real
- Sistema de alertas (reservas próximas a vencer, pendientes, corruptas)
- Autenticación JWT para administradores
- Diseño responsive con sidebar colapsable

## Stack Tecnológico

### Core

- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.2

### Routing & State

- React Router DOM 6.27.0
- TanStack Query 5.62.7 (React Query)

### UI & Styling

- Tailwind CSS 3.4.1
- shadcn/ui (Radix UI components)
- Recharts 2.15.0 (gráficos)
- Lucide React (iconos)

### Forms & Validation

- React Hook Form 7.54.0
- Zod 3.23.8
- @hookform/resolvers 3.9.1

### HTTP & Utilities

- Axios 1.7.9
- date-fns 4.1.0

## Requisitos Previos

- Node.js >= 16.x
- npm >= 8.x
- Backend API corriendo (ver repositorio del backend)

## Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd libroya-admin-hub

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos de TypeScript
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # AdminLayout, AdminHeader, AdminSidebar, NavLink
│   ├── core/            # ActionButton, Logo, MetricCard, StatusBadge
│   ├── dialogs/         # Wrappers de modales (ConfirmDialog, BookFormDialog...)
│   ├── forms/           # Formularios puros (BookForm, UserForm, ReservationForm)
│   ├── books/           # BooksFilters, BooksGrid
│   ├── users/           # UsersFilters, UsersGrid
│   ├── reservations/    # ReservationsFilters, ReservationsTable, ReservationActions
│   ├── dashboard/       # DashboardAlerts, DashboardCharts, RecentReservationsTable...
│   └── ui/              # Componentes base de shadcn/ui
├── config/
│   └── axios.ts         # Configuración de axios con interceptores JWT
├── constants/
│   ├── endpoints.ts     # Todos los endpoints del backend
│   ├── errors.ts        # Mensajes de error
│   ├── navigation.ts    # Items del menú
│   ├── books.ts         # Géneros y constantes de libros
│   ├── users.ts         # Roles y colores de usuarios
│   └── reservations.ts  # Estados y colores de reservas
├── contexts/
│   ├── auth-context.ts       # Context de autenticación
│   ├── AuthProvider.tsx      # Provider de autenticación
│   ├── sidebar-context.ts    # Context del sidebar
│   └── SidebarContext.tsx    # Provider del sidebar
├── hooks/
│   ├── queries/         # React Query hooks por entidad
│   │   ├── authHooks.ts
│   │   ├── booksHooks.ts
│   │   ├── usersHooks.ts
│   │   ├── reservationsHooks.ts
│   │   └── index.ts
│   ├── use-auth.ts
│   ├── use-auth-provider.ts
│   ├── use-confirm-dialog.ts
│   ├── use-sidebar.ts
│   └── use-toast.ts
├── pages/
│   ├── BooksPage.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Reservations.tsx
│   ├── SettingsPage.tsx
│   └── UsersPage.tsx
├── services/            # Servicios HTTP (llamadas al backend)
│   ├── authService.ts
│   ├── booksService.ts
│   ├── reservationsService.ts
│   └── usersService.ts
├── types/               # TypeScript types e interfaces
│   ├── api.d.ts
│   ├── auth.d.ts
│   └── index.ts
├── utils/
│   ├── dates.ts         # Formateo de fechas
│   ├── errorHandler.ts  # Manejo de errores HTTP
│   └── utils.ts         # Función cn() de shadcn
├── validations/         # Esquemas Zod
│   ├── auth.ts
│   ├── book.ts
│   ├── user.ts
│   └── reservation.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Flujo de Autenticación

1. Login con email y password
2. Backend retorna JWT token
3. Token guardado en localStorage
4. Axios interceptor agrega token a todas las requests
5. Si token expira (401), redirección automática a /login

### Flujo de Data Fetching

1. Componente usa hook de React Query (ej: useBooks())
2. Hook llama función del service (ej: booksService.fetchBooks())
3. Service hace request con axios
4. Data se almacena en caché de React Query
5. Componente recibe data, isLoading, error
6. Mutaciones invalidan caché automáticamente

## Rutas Principales

```
/login              # Autenticación
/dashboard          # Panel principal con métricas
/books              # Gestión de libros
/users              # Gestión de usuarios
/reservations       # Gestión de reservas
/settings           # Configuración
```

## Funcionalidades por Módulo

### Libros

- Listado con filtros (búsqueda, género)
- Crear libro con validaciones (título, autor, ISBN, género)
- Editar libro
- Eliminar libro (con confirmación)
- Marcar disponibilidad con razón
- Ver reservas asociadas a un libro

### Usuarios

- Listado con filtros (búsqueda, rol, estado activo/inactivo)
- Crear usuario (nombre, email, rol)
- Editar usuario
- Eliminar usuario (con confirmación)
- Activar/desactivar usuario
- Ver reservas asociadas a un usuario

### Reservas

- Listado con filtros (búsqueda, estado, usuario, libro)
- Crear reserva manual
- Editar reserva
- Cancelar reserva con razón
- Confirmar reserva mediante QR o código
- Completar reserva
- Ver detalles completos de reserva
- Estados: Pendiente, Confirmada, Completada, Cancelada, Corrupta

### Dashboard

- Métricas: Total reservas activas, usuarios activos, libros disponibles, pendientes
- Alertas: Reservas por expirar (24h), próximas a vencer (7 días), corruptas
- Gráfico de actividad de últimos 7 días
- Distribución de reservas por estado (dona)
- Últimas 6 reservas
- Top 3 libros más reservados
- Top 3 usuarios más activos

Sidebar:

- Desktop: Siempre visible, puede colapsar a 80px
- Mobile: Oculto por defecto, hamburger menu

## Autor

Iván Pérez - Alumno en prácticas de Agilia

## Licencia

Proyecto público educativo
