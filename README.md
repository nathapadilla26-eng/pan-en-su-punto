# Pan en su punto - Sistema de gestión de panadería

Aplicación web desarrollada con **React**, **PHP** y **MySQL** para la administración de usuarios, control de acceso y gestión de recetas estandarizadas.

## Estructura del proyecto

- `backend/`: Servicios API en PHP con conexión PDO (`conexion.php`, `login.php`, `usuarios.php`, `recetas.php`).
- `database/`: Script SQL de la base de datos (`pan_en_su_punto.sql`).
- `frontend/`: Interfaz de usuario desarrollada en React con Vite.

## Requisitos previos

- XAMPP (Apache y MySQL en ejecución).
- Node.js instalado en el equipo.

## Instalación y ejecución

1. Copiar la carpeta del proyecto dentro de `C:\xampp\htdocs\Pan en su punto`.
2. Encender **Apache** y **MySQL** desde el panel de control de XAMPP.
3. Abrir `http://localhost/phpmyadmin`, crear la base de datos `pan_en_su_punto` e importar el archivo `database/pan_en_su_punto.sql`.
4. Abrir una terminal en la carpeta `frontend` y ejecutar:

       npm install
       npm run dev

5. Abrir en el navegador la dirección `http://localhost:5173`.

## Credenciales de acceso de prueba

- **Usuario (Administrador):** `admin@panensupunto.com`
- **Contraseña:** `123456` (o la clave actualizada en la base de datos).

## Repositorio en GitHub

https://github.com/nathapadilla26-eng/pan-en-su-punto