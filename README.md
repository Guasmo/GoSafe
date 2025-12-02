# GoSafe - Aplicación de Seguridad y Turismo

## 📱 Descripción
GoSafe es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios explorar Cuenca de forma segura, visualizando zonas de peligro en un mapa interactivo y configurando alertas de seguridad.

## 🏗️ Estructura del Proyecto

```
GoSafe/
├── app/                          # Navegación con Expo Router
│   ├── login.tsx                # Pantalla de inicio de sesión
│   ├── _layout.tsx              # Layout raíz
│   └── (tabs)/                  # Tabs principales
│       ├── index.tsx            # Tab de Maps
│       ├── config.tsx           # Tab de Configuración
│       └── _layout.tsx          # Layout de tabs
│
├── src/
│   └── presentation/            # Capa de presentación
│       ├── screens/             # Pantallas
│       │   ├── auth/
│       │   │   └── LoginScreen.tsx
│       │   ├── map/
│       │   │   └── MapScreen.tsx
│       │   └── config/
│       │       └── ConfigScreen.tsx
│       │
│       ├── components/          # Componentes reutilizables
│       │   └── common/
│       │       ├── Button.tsx
│       │       └── Input.tsx
│       │
│       └── theme/               # Sistema de diseño
│           ├── colors.ts
│           ├── spacing.ts
│           └── typography.ts
│
└── assets/                      # Recursos estáticos
```

## 🚀 Características Implementadas

### ✅ Autenticación
- Pantalla de login con validación
- Navegación a la app principal después del login
- Diseño moderno con tema oscuro

### ✅ Mapa Interactivo
- Mapa simulado con React Native puro (sin dependencias nativas)
- Visualización de zonas de peligro con polígonos de colores
- Marcadores de lugares turísticos
- Leyenda de zonas (Segura, Precaución, Peligrosa, Sin datos)
- Controles de zoom y ubicación
- Barra de búsqueda
- Indicador de ubicación del usuario
- **Nota:** Implementación visual sin mapas reales para evitar dependencias nativas

### ✅ Configuración
- **Alertas de Seguridad:**
  - Toggle para activar/desactivar alertas
  - Selección de tipos de incidentes (Asaltos, Robos, Zonas poco iluminadas)
  - Slider de radio de notificación
  - Configuración de sonido de notificación

- **Preferencias de Ruta:**
  - Toggle para evitar zonas de alto riesgo
  - Selección de prioridad de ruta (Más segura, Más corta, Equilibrada)
  - Recalcular ruta automáticamente

- **General:**
  - Selección de idioma
  - Ayuda y soporte

## 🎨 Sistema de Diseño

### Colores
- **Primary:** #2563EB (Azul)
- **Background:** #1A1D26 (Oscuro)
- **Zonas:**
  - Segura: #10B981 (Verde)
  - Precaución: #F59E0B (Naranja)
  - Peligrosa: #EF4444 (Rojo)
  - Sin datos: #6B7280 (Gris)

### Componentes Reutilizables
- **Button:** Botón con variantes primary/secondary y estado de carga
- **Input:** Campo de entrada con iconos, validación y soporte para contraseñas

## 📦 Dependencias Principales

```json
{
  "expo": "~54.0.25",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "~6.0.15",
  "@expo/vector-icons": "^15.0.3"
}
```

**Nota:** Esta aplicación no requiere dependencias nativas adicionales y funciona completamente con Expo Go.

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- pnpm
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Instalación
```bash
# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm start

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios
```

## 🎯 Flujo de Navegación

1. **Inicio:** La app carga en la pantalla de Login
2. **Login:** Usuario ingresa credenciales y presiona "Iniciar Sesión"
3. **Tabs Principales:**
   - **Maps:** Visualización del mapa con zonas de peligro
   - **Config:** Configuración de alertas y preferencias

## 📝 Próximos Pasos (No implementados)

- [ ] Implementar hooks y context
- [ ] Integrar con backend (Firebase)
- [ ] Implementar geolocalización en tiempo real
- [ ] Sistema de alertas push
- [ ] Integración con API de turismo
- [ ] Tests unitarios y de integración
- [ ] Modo offline con cache

## 👨‍💻 Desarrollo

Este proyecto sigue una arquitectura limpia con separación de capas:
- **Presentation:** UI y componentes visuales
- **Application:** Lógica de orquestación (hooks, context, services)
- **Domain:** Reglas de negocio puras
- **Infrastructure:** Implementaciones de APIs y repositorios

Actualmente solo está implementada la capa de **Presentation** (maquetado).

## 📄 Licencia

Este proyecto es privado y está en desarrollo.
