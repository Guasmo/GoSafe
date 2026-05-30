# Documentación: Implementación de Login con Facebook usando Firebase en Expo

## Introducción

Esta documentación describe el proceso completo de implementación del login con Facebook utilizando Firebase Authentication en una aplicación Expo (React Native con TypeScript). Se incluyen todos los pasos realizados, configuraciones necesarias en Firebase, Meta Developers y tanto en frontend como backend, así como los problemas reales encontrados durante la implementación y sus soluciones.

---

## 1. Configuración de Firebase

### 1.1. Creación del proyecto

1. Ingresar a la consola de Firebase
2. Crear un nuevo proyecto
3. Copiar el **Project ID** del proyecto

### 1.2. Configuración de aplicaciones (Android e iOS)

Se crearon dos aplicaciones dentro del proyecto Firebase:

#### Aplicación Android
- Descargar el archivo `google-services.json`
- Colocar el archivo en la **raíz del proyecto**

#### Aplicación iOS
- Descargar el archivo `GoogleService-Info.plist`
- Colocar el archivo en la **raíz del proyecto**

> **Nota crítica:** Ambos archivos (`google-services.json` y `GoogleService-Info.plist`) son necesarios para el build de la APK. Si falta alguno de los dos, el proceso de compilación generará errores.

### 1.3. Variables de entorno del Frontend

Se configuraron las siguientes variables de entorno en el proyecto frontend, obtenidas desde la consola de Firebase y de los archivos `google-services.json`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## 2. Configuración de Meta Developers (Facebook)

### 2.1. Creación de cuenta y proyecto

1. Crear una cuenta en **Meta Developers**
2. Verificar la cuenta
3. Crear un nuevo proyecto en Meta Developers

### 2.2. Variables de entorno para Facebook

Se agregaron las siguientes variables de entorno al frontend:

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=
EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN=
```

Ambos valores se obtienen desde el proyecto en Meta Developers.

### 2.3. Configuración de la plataforma Android

Dentro de las configuraciones de la aplicación de Facebook:

1. Crear una nueva plataforma/aplicación
2. Seleccionar **Android**
3. Configurar los siguientes datos:
   - **Nombre del paquete:** `com.gosafe.app`
   - **Nombre de clase:** `.mainApplication`
   - **Key Hash:** (ver sección de problemas)

---

## 3. Problemas Encontrados y Soluciones

### 3.1. Error: Falta de archivos en el build

**Problema:**  
Al intentar construir la APK, se generaban errores de diferentes tipos relacionados con archivos faltantes.

**Causa:**  
No se tenían ambos archivos de configuración de Firebase (`google-services.json` para Android y `GoogleService-Info.plist` para iOS) en la raíz del proyecto.

**Solución:**  
Descargar y colocar ambos archivos en la raíz del proyecto, incluso si solo se está compilando para una plataforma.

---

### 3.2. Error: Invalid Key Hash

**Problema:**  
Al intentar hacer login con Facebook, aparecía el siguiente error:

```
Invalid Key Hash, the Key Hash doesn't match any stored Key Hashes
```

**Causa:**  
El Key Hash generado siguiendo la documentación oficial de Facebook no coincidía con el Key Hash real que utiliza React Native en la APK.

#### Intento fallido con la documentación oficial

Se siguió la documentación oficial de Facebook para generar el Key Hash:

**Documentación oficial:**  
https://developers.facebook.com/docs/android/getting-started/#create_hash

**Comando utilizado:**
```bash
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

**Resultado:** El hash generado por este comando era diferente al que la aplicación realmente utilizaba, causando el error de validación.

#### Solución real

La solución se encontró en un issue de GitHub:

**Issue de referencia:**  
https://github.com/magus/react-native-facebook-login/issues/297

**Método correcto:**

Según los comentarios en el issue, la forma correcta de obtener el Key Hash es:

1. Instalar la APK en un dispositivo físico o emulador
2. Descargar una aplicación específica que permite extraer el Key Hash directamente de la APK instalada de React Native
3. El hash obtenido por este método es el **hash verdadero** que debe configurarse en Meta Developers
4. Una vez configurado este hash correcto, el login funciona correctamente

> **Conclusión:** El Key Hash real que utiliza React Native difiere del generado por el comando oficial de Facebook. Es necesario extraerlo directamente de la APK instalada.

---

## 4. Implementación en Frontend

### 4.1. Librerías instaladas

Se instalaron las siguientes dependencias:

```bash
npm install @react-native-firebase/auth
npm install react-native-fbsdk-next
```

- **@react-native-firebase/auth:** Para la autenticación con Firebase
- **react-native-fbsdk-next:** Para la integración con el SDK de Facebook

### 4.2. Configuración de Firebase (`firebase.ts`)

Se creó un archivo de configuración `firebase.ts` que:
- Solicita los permisos necesarios para utilizar Firebase
- Inicializa la configuración de Firebase con las variables de entorno

```typescript
// Configuración de Firebase
// Inicialización y solicitud de permisos
```

### 4.3. Hook personalizado: `useUsers`

Se modificó el hook `useUsers` para agregar funcionalidad de:
- Subida de fotos de perfil
- Manejo de la foto de perfil que proviene de Facebook

### 4.4. Servicio de autenticación (`auth.service.ts`)

Se implementó el método `loginWithFacebook` que:

1. Inicializa el proceso llamando a Firebase User
2. Valida si el usuario existe en la base de datos
3. Si el usuario **no existe:** crea un nuevo usuario
4. Si el usuario **sí existe:** utiliza el método de login de Facebook

**Flujo del servicio:**
```
loginWithFacebook()
  → Inicializa Firebase User
  → Valida existencia del usuario
    → Si no existe: crear usuario
    → Si existe: login con Facebook
```

### 4.5. Hook de autenticación

Se creó un hook personalizado que desestructura y expone únicamente el método `loginWithFacebook` para su uso en los componentes.

```typescript
// Hook personalizado
const { loginWithFacebook } = useAuth();
```

### 4.6. Botón personalizado de Facebook

Se implementó un botón personalizado en la pantalla de login que:

1. Utiliza el método `loginWithFacebook` como handler (`handleFacebookLogin`)
2. Al presionar el botón, llama al hook
3. El hook inicializa toda la parte del servicio de Firebase
4. Posteriormente ejecuta la autenticación con Facebook
5. Completa el proceso de inicio de sesión

```typescript
// Componente del botón
<CustomFacebookButton onPress={handleFacebookLogin} />
```

---

## 5. Implementación en Backend

### 5.1. Variables de entorno

Se configuraron las siguientes variables en el archivo `.env` del backend:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

**Origen de los valores:**
- Se obtienen del archivo JSON que Firebase proporciona al descargar las credenciales de la cuenta de servicio
- El archivo JSON contiene:
  - `project_id`
  - `client_email`
  - `private_key`

### 5.2. Librería Firebase Admin

Se instaló la librería de Firebase Admin para poder utilizar las configuraciones de Firebase desde el backend:

```bash
npm install firebase-admin
```

### 5.3. Servicio de autenticación (`auth.service.ts`)

Se creó una clase en el `auth.service` para implementar el método de login con Facebook que:

1. Utiliza `firebase-admin` para validar el token de Facebook
2. Verifica la autenticidad del usuario
3. Gestiona la sesión del usuario en el backend

```typescript
// Clase AuthService
class AuthService {
  async loginWithFacebook(token: string) {
    // Implementación del método
  }
}
```

---

## Conclusiones

La implementación del login con Facebook usando Firebase en Expo requiere configuración en múltiples plataformas y servicios. Los principales desafíos encontrados fueron:

1. **Dependencia de archivos:** Es necesario tener ambos archivos de configuración de Firebase (Android e iOS) incluso si solo se compila para una plataforma.

2. **Key Hash incorrecto:** La documentación oficial de Facebook no genera el Key Hash correcto para aplicaciones React Native. Es imprescindible extraerlo directamente de la APK instalada.

3. **Coordinación Frontend-Backend:** La implementación requiere sincronización entre el servicio de autenticación del frontend y el backend para validar correctamente los tokens.

Una vez superados estos obstáculos, el sistema de login con Facebook funciona correctamente y permite una experiencia de usuario fluida.