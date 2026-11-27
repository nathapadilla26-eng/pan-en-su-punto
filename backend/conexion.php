<?php
/**
 * Archivo de conexión a la base de datos MySQL mediante PDO.
 * Configura además las cabeceras CORS para permitir peticiones desde React.
 */
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Responde de inmediato si el navegador envía una petición previa de verificación
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$baseDatos = "pan_en_su_punto";
$usuarioBd = "root";
$contrasenaBd = "";

try {
    $conexion = new PDO(
        "mysql:host=$host;dbname=$baseDatos;charset=utf8mb4",
        $usuarioBd,
        $contrasenaBd
    );
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode([
        "exito" => false,
        "mensaje" => "Error de conexión con la base de datos: " . $error->getMessage()
    ]);
    exit();
}