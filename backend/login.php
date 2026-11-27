<?php
/**
 * Servicio de autenticación (RF 01, RF 02, RF 03 y RF 05).
 * Valida credenciales, bloqueo por intentos fallidos e indicador de cambio obligatorio de clave.
 */
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["exito" => false, "mensaje" => "Método no permitido"]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"), true);
$usuarioInput = isset($datos['usuario']) ? trim($datos['usuario']) : '';
$contrasenaInput = isset($datos['contrasena']) ? $datos['contrasena'] : '';

if ($usuarioInput === '' || $contrasenaInput === '') {
    echo json_encode(["exito" => false, "mensaje" => "Por favor, ingrese su usuario y contraseña"]);
    exit();
}

try {
    $sql = "SELECT u.id_usuario, u.documento, u.nombre_completo, u.correo, u.contrasena, u.estado,
                   u.intentos_fallidos, u.bloqueado_hasta, u.debe_cambiar_contrasena, r.nombre_rol
            FROM usuarios u
            INNER JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.correo = :usuario OR u.documento = :usuario
            LIMIT 1";

    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':usuario', $usuarioInput);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(["exito" => false, "mensaje" => "Usuario o contraseña incorrectos"]);
        exit();
    }

    if (intval($usuario['estado']) !== 1) {
        echo json_encode(["exito" => false, "mensaje" => "Esta cuenta se encuentra inactiva. Contacte al administrador."]);
        exit();
    }

    if (!empty($usuario['bloqueado_hasta'])) {
        $ahora = new DateTime();
        $finBloqueo = new DateTime($usuario['bloqueado_hasta']);

        if ($ahora < $finBloqueo) {
            $diferencia = $ahora->diff($finBloqueo);
            $minutosRestantes = max(1, ($diferencia->h * 60) + $diferencia->i + ($diferencia->s > 0 ? 1 : 0));

            echo json_encode([
                "exito" => false,
                "mensaje" => "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en {$minutosRestantes} minuto(s)."
            ]);
            exit();
        } else {
            $sqlDesbloquear = "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = :id";
            $stmtDesb = $conexion->prepare($sqlDesbloquear);
            $stmtDesb->bindParam(':id', $usuario['id_usuario'], PDO::PARAM_INT);
            $stmtDesb->execute();
            $usuario['intentos_fallidos'] = 0;
        }
    }

    $claveValida = password_verify($contrasenaInput, $usuario['contrasena']) || ($contrasenaInput === $usuario['contrasena']);

    if (!$claveValida) {
        $nuevosIntentos = intval($usuario['intentos_fallidos']) + 1;

        if ($nuevosIntentos >= 5) {
            $bloqueoHasta = (new DateTime('+15 minutes'))->format('Y-m-d H:i:s');
            $sqlBloquear = "UPDATE usuarios SET intentos_fallidos = :intentos, bloqueado_hasta = :bloqueo WHERE id_usuario = :id";
            $stmtBloq = $conexion->prepare($sqlBloquear);
            $stmtBloq->bindParam(':intentos', $nuevosIntentos, PDO::PARAM_INT);
            $stmtBloq->bindParam(':bloqueo', $bloqueoHasta);
            $stmtBloq->bindParam(':id', $usuario['id_usuario'], PDO::PARAM_INT);
            $stmtBloq->execute();

            echo json_encode([
                "exito" => false,
                "mensaje" => "Has superado los 5 intentos fallidos. Tu cuenta ha sido bloqueada durante 15 minutos."
            ]);
        } else {
            $intentosRestantes = 5 - $nuevosIntentos;
            $sqlFallo = "UPDATE usuarios SET intentos_fallidos = :intentos WHERE id_usuario = :id";
            $stmtFallo = $conexion->prepare($sqlFallo);
            $stmtFallo->bindParam(':intentos', $nuevosIntentos, PDO::PARAM_INT);
            $stmtFallo->bindParam(':id', $usuario['id_usuario'], PDO::PARAM_INT);
            $stmtFallo->execute();

            echo json_encode([
                "exito" => false,
                "mensaje" => "Usuario o contraseña incorrectos. Te quedan {$intentosRestantes} intento(s)."
            ]);
        }
        exit();
    }

    $sqlReiniciar = "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = :id";
    $stmtReiniciar = $conexion->prepare($sqlReiniciar);
    $stmtReiniciar->bindParam(':id', $usuario['id_usuario'], PDO::PARAM_INT);
    $stmtReiniciar->execute();

    $usuario['debe_cambiar_contrasena'] = intval($usuario['debe_cambiar_contrasena']);
    unset($usuario['contrasena'], $usuario['intentos_fallidos'], $usuario['bloqueado_hasta']);

    echo json_encode([
        "exito" => true,
        "mensaje" => "Inicio de sesión exitoso",
        "usuario" => $usuario
    ]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(["exito" => false, "mensaje" => "Error interno al validar credenciales"]);
}