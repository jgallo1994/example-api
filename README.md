# Example API 🚀

REST API construida con Node.js, TypeScript y principios de **Domain-Driven Design (DDD)**, **Clean Architecture** y **SOLID**.

## ✨ Características

- 🏗️ **Arquitectura Limpia** con separación clara de capas
- 🎯 **Domain-Driven Design** con entidades y value objects
- 🔒 **Seguridad robusta** con Helmet.js y rate limiting
- 📝 **Logging estructurado** con Winston
- ✅ **Validación de entrada** con Joi
- 🏥 **Health checks avanzados** con métricas del sistema
- 📖 **Documentación automática** con Swagger/OpenAPI
- 🐳 **Containerización** con Docker
- 🧪 **Testing completo** con Jest
- 🔧 **Calidad de código** con ESLint + Prettier
- ⚡ **Performance** con compresión y optimizaciones

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- MongoDB 6.0+
- Docker (opcional)

### Instalación local

```bash
# Clonar repositorio
git clone <repository-url>
cd example-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Construir proyecto
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### Con Docker

```bash
# Construir y ejecutar con docker-compose
npm run docker:compose

# O construir manualmente
npm run docker:build
npm run docker:run
```

## 🔧 Scripts disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload
npm run build            # Construir proyecto
npm start                # Ejecutar en producción

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura

# Calidad de código
npm run lint             # Verificar ESLint
npm run lint:fix         # Corregir errores de ESLint
npm run format           # Formatear con Prettier
npm run format:check     # Verificar formato

# Utilidades
npm run clean            # Limpiar archivos generados
```

## 🌐 Endpoints de la API

### Health Checks
- `GET /health` - Health check básico
- `GET /health/advanced` - Health check avanzado con métricas del sistema

### Usuarios (API v1)
- `POST /api/v1/users` - Crear usuario
- `GET /api/v1/users` - Obtener todos los usuarios
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (soft delete)

### Documentación
- `GET /api-docs` - Documentación Swagger/OpenAPI

## 🏗️ Arquitectura

```
src/
├── domain/                 # Capa de dominio
│   ├── entities/          # Entidades de negocio
│   ├── value-objects/     # Objetos de valor
│   ├── repositories/      # Interfaces de repositorio
│   └── errors/            # Errores del dominio
├── application/            # Capa de aplicación
│   ├── use-cases/         # Casos de uso
│   ├── dtos/              # Objetos de transferencia
│   └── errors/            # Errores de aplicación
├── infrastructure/         # Capa de infraestructura
│   ├── database/          # Conexión a base de datos
│   ├── repositories/      # Implementaciones de repositorio
│   ├── logging/           # Sistema de logging
│   ├── health/            # Health checks
│   ├── di/                # Inyección de dependencias
│   └── errors/            # Errores de infraestructura
└── presentation/           # Capa de presentación
    ├── controllers/        # Controladores HTTP
    ├── routes/             # Definición de rutas
    ├── middlewares/        # Middlewares de Express
    ├── responses/          # Respuestas HTTP estandarizadas
    └── swagger/            # Configuración de Swagger
```

## 🔒 Seguridad

- **Helmet.js** - Headers de seguridad HTTP
- **Rate Limiting** - Protección contra DDoS
- **Input Validation** - Validación robusta con Joi
- **CORS** - Configuración de Cross-Origin Resource Sharing
- **Compresión** - Optimización de responses

## 📝 Logging

- **Winston** - Logging estructurado
- **Rotación automática** de archivos de log
- **Diferentes niveles** de logging por ambiente
- **Logging automático** de requests HTTP
- **Decoradores** para logging de casos de uso y repositorios

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests específicos
npm test -- --testNamePattern="CreateUserUseCase"
```

### Cobertura de tests

- ✅ **Use Cases** - 100% cobertura
- ✅ **Controllers** - 100% cobertura
- ✅ **Repositories** - 100% cobertura
- ✅ **Value Objects** - 100% cobertura
- ✅ **Entities** - 100% cobertura
- ✅ **Middlewares** - 100% cobertura

## 🐳 Docker

### Desarrollo
```bash
# Ejecutar con MongoDB
docker-compose up --build

# Acceder a la API
curl http://localhost:3000/health
```

## 🔧 Configuración

### Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `HOST` | Host del servidor | `localhost` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/example-api` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `JWT_SECRET` | Secreto para JWT | Requerido |
| `API_KEY` | Clave de API | Requerido |

## 📊 Monitoreo

### Health Checks
- **Básico**: Verificación de conectividad a MongoDB
- **Avanzado**: Métricas del sistema (CPU, memoria, disco, uptime)

### Métricas del sistema
- Uso de CPU y memoria
- Espacio en disco
- Tiempo de respuesta de la base de datos
- Estado general del sistema
