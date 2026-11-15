# ScoreVault

Aplicación web full-stack para la gestión y clasificación de puntuaciones de jugadores (*leaderboard*), desarrollada con arquitectura desacoplada mediante una API REST en **Django REST Framework** y una interfaz reactiva en **React (Vite)**.

## Tecnologías utilizadas

* **Backend:** Python 3, Django, Django REST Framework (`djangorestframework`), `django-cors-headers`
* **Autenticación:** Token Authentication (`rest_framework.authtoken`)
* **Base de datos:** SQLite3
* **Frontend:** React, Vite, JavaScript (ES6+), Fetch API

## Estructura del repositorio

```text
ScoreVault/
├── backend/                # API REST en Django
│   ├── core/               # Configuración global (settings.py, urls.py)
│   ├── scores/             # App de puntuaciones (models, serializers, views, urls)
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # Cliente web en React + Vite
│   ├── src/
│   │   ├── components/     # Login.jsx, ScoreForm.jsx, ScoreList.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## Requisitos previos

* Python 3.10 o superior
* Node.js 18 o superior y `npm`
* Git

## Instalación y ejecución

El proyecto requiere ejecutar dos servidores locales de forma simultánea (uno para la API y otro para la interfaz web).

### 1. Configuración del Backend (Django)

1. Abrir una terminal en la raíz del repositorio y entrar a `backend/`:
   ```bash
   cd backend
   ```
2. Crear y activar el entorno virtual:
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Aplicar migraciones y crear un usuario administrador:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. Iniciar el servidor de desarrollo en `http://127.0.0.1:8000`:
   ```bash
   python manage.py runserver
   ```

### 2. Configuración del Frontend (React)

1. Abrir una segunda terminal en la raíz del repositorio y entrar a `frontend/`:
   ```bash
   cd frontend
   ```
2. Instalar paquetes de Node:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo de Vite en `http://localhost:5173`:
   ```bash
   npm run dev
   ```

## Credenciales de prueba

Si se utiliza la base de datos local preconfigurada (o tras ejecutar `createsuperuser` con estos datos):

* **Usuario:** `leax360`
* **Contraseña:** `TU_CONTRASEÑA`

## Endpoints de la API

Todos los endpoints bajo `/api/scores/` y `/api/logout/` requieren enviar el token en la cabecera HTTP:
`Authorization: Token <tu_token>`

| Método | Endpoint | Autenticación | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login/` | Pública | Valida credenciales y retorna el token de acceso | `200`, `400` |
| `POST` | `/api/logout/` | Requerida | Elimina el token activo del usuario en el servidor | `200`, `401` |
| `GET` | `/api/scores/` | Requerida | Lista todas las puntuaciones ordenadas de mayor a menor | `200`, `401` |
| `POST` | `/api/scores/` | Requerida | Crea un nuevo registro de puntuación validado | `201`, `400`, `401` |
| `GET` | `/api/scores/<id>/` | Requerida | Obtiene el detalle de una puntuación específica | `200`, `401`, `404` |
| `PUT` / `PATCH` | `/api/scores/<id>/` | Requerida | Actualiza un registro existente | `200`, `400`, `401`, `404` |
| `DELETE` | `/api/scores/<id>/` | Requerida | Elimina permanentemente un registro | `204`, `401`, `404` |

## Flujo de arquitectura

1. **Autenticación:** El usuario envía sus credenciales desde `Login.jsx` mediante `POST /api/login/`. Django verifica el hash de la contraseña y retorna un token único, el cual React almacena en `localStorage`.
2. **Consumo protegido:** Cada petición (`GET`, `POST`, `PUT`, `DELETE`) adjunta `Authorization: Token <token>`. DRF valida el token mediante `TokenAuthentication` y ejecuta las reglas de negocio definidas en `ScoreSerializer` antes de persistir en SQLite.
3. **Manejo de errores:** Las respuestas `400` (validación), `401` (no autorizado) y `404` (recurso inexistente) son retornadas en JSON por DRF y capturadas en React para informar al usuario sin interrumpir la aplicación.

## Autor

* **Leandro Donoso**