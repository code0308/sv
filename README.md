## 🛡️ **API de Autenticación – Documentación para Frontend**

### 🌐 Base URL

```
http://localhost:3000/api/auth
```
---

## 📋 **Resumen de Endpoints**

| Método | Endpoint           | Descripción                            | Autenticación |
| ------ | ------------------ | -------------------------------------- | ------------- |
| POST   | `/register`        | Registra un nuevo usuario              | ❌             |
| POST   | `/login`           | Inicia sesión                          | ❌             |
| POST   | `/refresh-token`   | Obtiene nuevo access token             | ✅ (cookie)    |
| POST   | `/logout`          | Cierra sesión                          | ✅ (cookie)    |
| POST   | `/forgot-password` | Solicita link de reseteo de contraseña | ❌             |
| POST   | `/reset-password`  | Cambia la contraseña con un token      | ❌             |

---

## 🔐 Autenticación

* El **access token** se retorna como `accessToken` en la respuesta del login o refresh.
* El **refresh token** se almacena en una **cookie segura** `HttpOnly`.

Perfecto. Acá tenés el flujo resumido reemplazando el diagrama de Mermaid por una versión más textual, clara y legible para Markdown:

---

### 🔄 Flujo resumido

1. **Login**

   * El frontend envía: `POST /login` con email y contraseña.
   * El backend:

     * Verifica las credenciales.
     * Devuelve un `accessToken` (en JSON).
     * Setea una cookie `refreshToken` segura (`HttpOnly`, `Secure`, `SameSite=Strict`).

2. **Acceso a rutas protegidas**

   * El frontend incluye el `accessToken` en los headers:

     ```
     Authorization: Bearer <accessToken>
     ```
   * El backend verifica el token y responde con los datos solicitados.

3. **Renovar access token**

   * Cuando el access token expira, el frontend llama a:

     ```
     POST /refresh-token
     ```

     con la cookie `refreshToken` (automáticamente si usás `credentials: include`).
   * El backend verifica el refresh token y devuelve un nuevo `accessToken`.

4. **Logout**

   * El frontend hace `POST /logout`.
   * El backend elimina el `refreshToken` de la base de datos y borra la cookie.

---

## 📌 Detalle de Endpoints

### 📝 POST `/register`

Registra un nuevo usuario.

#### Body

```json
{
  "email": "user@example.com",
  "password": "strongPassword"
}
```

#### Respuesta

```json
{
  "message": "User registered successfully"
}
```

---

### 🔐 POST `/login`

Inicia sesión y retorna access token + setea cookie con refresh token.

#### Body

```json
{
  "email": "user@example.com",
  "password": "strongPassword"
}
```

#### Respuesta

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
}
```

#### Set-Cookie (automático)

```http
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

---

### 🔄 POST `/refresh-token`

Usa la cookie `refreshToken` para generar un nuevo `accessToken`.

#### Headers

```http
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIs...
```

> ⚠️ No requiere token en Authorization header

#### Respuesta

```json
{
  "accessToken": "nuevoAccessToken..."
}
```

---

### 🚪 POST `/logout`

Elimina el `refreshToken` del backend y borra la cookie.

#### Respuesta

```json
{
  "message": "Logged out successfully"
}
```

---

### 📩 POST `/forgot-password`

Envía un link de reseteo de contraseña al email.

#### Body

```json
{
  "email": "user@example.com"
}
```

#### Respuesta

```json
{
  "message": "If that email exists, a reset link was sent"
}
```

---

### 🔑 POST `/reset-password`

Cambia la contraseña usando un token que llegó por email.

#### Body

```json
{
  "token": "resetTokenDesdeEmail",
  "newPassword": "newStrongPassword"
}
```

#### Respuesta

```json
{
  "message": "Password reset successfully"
}
```

---

## 📦 ¿Cómo usar los tokens en el frontend?

### Para autenticar requests protegidas:

```http
Authorization: Bearer <accessToken>
```

---

## 🍪 ¿Cómo manejar cookies (refresh token)?

### En fetch / axios (ejemplo con fetch):

```ts
await fetch('/api/auth/refresh-token', {
  method: 'POST',
  credentials: 'include' // 🔥 IMPORTANTE para enviar cookies
});
```

> ⚠️ `credentials: 'include'` es esencial para que se envíen cookies entre dominios si estás trabajando con frontend y backend separados.
