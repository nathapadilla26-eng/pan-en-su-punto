<?php
/**
 * Servicio de gestión de usuarios (RF 04, RF 05, RF 11 y RF 12).
 * Permite listar usuarios, registrar nuevos, editar existentes,
 * generar contraseñas temporales y actualizar la contraseña propia.
 */
require_once 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

// 1. Consulta todos los usuarios con el nombre de su rol
if ($metodo === 'GET') {
    try {
        $sql = "SELECT u.id_usuario, u.documento, u.nombre_completo, u.correo, u.estado, u.id_rol, r.nombre_rol
                FROM usuarios u
                INNER JOIN roles r ON u.id_rol = r.id_rol
                ORDER BY u.id_usuario ASC";

        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $usuarios = $consulta->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "exito" => true,
            "usuarios" => $usuarios
        ]);
    } catch (PDOException $error) {
        http_response_code(500);
        echo json_encode([
            "exito" => false,
            "mensaje" => "Error al consultar la lista de usuarios"
        ]);
    }
    exit();
}

// 2. Procesa peticiones POST (crear, editar, generar temporal o cambiar contraseña)
if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $accion = isset($datos['accion']) ? $datos['accion'] : '';

    // Acción A: Registrar nuevo usuario (RF 04 y RF 11)
    if ($accion === 'crear') {
        $documento = isset($datos['documento']) ? trim($datos['documento']) : '';
        $nombreCompleto = isset($datos['nombre_completo']) ? trim($datos['nombre_completo']) : '';
        $correo = isset($datos['correo']) ? trim($datos['correo']) : '';
        $contrasena = isset($datos['contrasena']) ? $datos['contrasena'] : '';
        $idRol = isset($datos['id_rol']) ? intval($datos['id_rol']) : 0;

        if ($documento === '' || $nombreCompleto === '' || $correo === '' || $contrasena === '' || $idRol <= 0) {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Todos los campos marcados con * son obligatorios."
            ]);
            exit();
        }

        try {
            $sqlVerificar = "SELECT id_usuario, documento, correo FROM usuarios WHERE documento = :documento OR correo = :correo LIMIT 1";
            $stmtVerificar = $conexion->prepare($sqlVerificar);
            $stmtVerificar->bindParam(':documento', $documento);
            $stmtVerificar->bindParam(':correo', $correo);
            $stmtVerificar->execute();
            $existente = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

            if ($existente) {
                $mensajeDuplicado = ($existente['documento'] === $documento)
                    ? "Ya existe un usuario registrado con ese número de documento."
                    : "Ya existe un usuario registrado con ese correo electrónico.";

                echo json_encode([
                    "exito" => false,
                    "mensaje" => $mensajeDuplicado
                ]);
                exit();
            }

            $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);
            $sqlInsertar = "INSERT INTO usuarios (documento, nombre_completo, correo, contrasena, estado, id_rol)
                            VALUES (:documento, :nombre_completo, :correo, :contrasena, 1, :id_rol)";

            $stmtInsertar = $conexion->prepare($sqlInsertar);
            $stmtInsertar->bindParam(':documento', $documento);
            $stmtInsertar->bindParam(':nombre_completo', $nombreCompleto);
            $stmtInsertar->bindParam(':correo', $correo);
            $stmtInsertar->bindParam(':contrasena', $contrasenaHash);
            $stmtInsertar->bindParam(':id_rol', $idRol, PDO::PARAM_INT);
            $stmtInsertar->execute();

            echo json_encode([
                "exito" => true,
                "mensaje" => "Usuario creado correctamente"
            ]);
        } catch (PDOException $error) {
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al guardar el usuario en la base de datos"
            ]);
        }
        exit();
    }

    // Acción B: Editar usuario existente y su estado activo/inactivo (RF 04 y RF 11)
    if ($accion === 'editar') {
        $idUsuario = isset($datos['id_usuario']) ? intval($datos['id_usuario']) : 0;
        $documento = isset($datos['documento']) ? trim($datos['documento']) : '';
        $nombreCompleto = isset($datos['nombre_completo']) ? trim($datos['nombre_completo']) : '';
        $correo = isset($datos['correo']) ? trim($datos['correo']) : '';
        $idRol = isset($datos['id_rol']) ? intval($datos['id_rol']) : 0;
        $estado = isset($datos['estado']) ? intval($datos['estado']) : 1;
        $contrasena = isset($datos['contrasena']) ? $datos['contrasena'] : '';

        if ($idUsuario <= 0 || $documento === '' || $nombreCompleto === '' || $correo === '' || $idRol <= 0) {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Completa todos los campos obligatorios antes de actualizar."
            ]);
            exit();
        }

        try {
            $sqlVerificar = "SELECT id_usuario, documento, correo FROM usuarios
                             WHERE (documento = :documento OR correo = :correo) AND id_usuario != :id_usuario
                             LIMIT 1";
            $stmtVerificar = $conexion->prepare($sqlVerificar);
            $stmtVerificar->bindParam(':documento', $documento);
            $stmtVerificar->bindParam(':correo', $correo);
            $stmtVerificar->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmtVerificar->execute();
            $duplicado = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

            if ($duplicado) {
                $mensajeDuplicado = ($duplicado['documento'] === $documento)
                    ? "Otro usuario ya está registrado con ese número de documento."
                    : "Otro usuario ya está registrado con ese correo electrónico.";

                echo json_encode([
                    "exito" => false,
                    "mensaje" => $mensajeDuplicado
                ]);
                exit();
            }

            if ($contrasena !== '') {
                $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);
                $sqlActualizar = "UPDATE usuarios
                                  SET documento = :documento, nombre_completo = :nombre_completo, correo = :correo,
                                      contrasena = :contrasena, estado = :estado, id_rol = :id_rol
                                  WHERE id_usuario = :id_usuario";
                $stmtActualizar = $conexion->prepare($sqlActualizar);
                $stmtActualizar->bindParam(':contrasena', $contrasenaHash);
            } else {
                $sqlActualizar = "UPDATE usuarios
                                  SET documento = :documento, nombre_completo = :nombre_completo, correo = :correo,
                                      estado = :estado, id_rol = :id_rol
                                  WHERE id_usuario = :id_usuario";
                $stmtActualizar = $conexion->prepare($sqlActualizar);
            }

            $stmtActualizar->bindParam(':documento', $documento);
            $stmtActualizar->bindParam(':nombre_completo', $nombreCompleto);
            $stmtActualizar->bindParam(':correo', $correo);
            $stmtActualizar->bindParam(':estado', $estado, PDO::PARAM_INT);
            $stmtActualizar->bindParam(':id_rol', $idRol, PDO::PARAM_INT);
            $stmtActualizar->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmtActualizar->execute();

            echo json_encode([
                "exito" => true,
                "mensaje" => "Usuario actualizado correctamente"
            ]);
        } catch (PDOException $error) {
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al actualizar los datos del usuario"
            ]);
        }
        exit();
    }

    // Acción C: Generar contraseña temporal (RF 05)
    if ($accion === 'generar_temporal') {
        $idUsuario = isset($datos['id_usuario']) ? intval($datos['id_usuario']) : 0;

        if ($idUsuario > 0) {
            try {
                $numeroAleatorio = random_int(1000, 9999);
                $claveTemporal = "Pp#" . $numeroAleatorio . "Temp!";
                $claveEncriptada = password_hash($claveTemporal, PASSWORD_DEFAULT);

                $sql = "UPDATE usuarios SET contrasena = :contrasena WHERE id_usuario = :id_usuario";
                $consulta = $conexion->prepare($sql);
                $consulta->bindParam(':contrasena', $claveEncriptada);
                $consulta->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
                $consulta->execute();

                echo json_encode([
                    "exito" => true,
                    "mensaje" => "Contraseña temporal generada correctamente",
                    "claveTemporal" => $claveTemporal
                ]);
            } catch (PDOException $error) {
                http_response_code(500);
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "Error al actualizar la contraseña temporal"
                ]);
            }
            exit();
        }
    }

    // Acción D: Actualizar contraseña propia o temporal (RF 05 y RF 12)
    if ($accion === 'cambiar_contrasena') {
        $idUsuario = isset($datos['id_usuario']) ? intval($datos['id_usuario']) : 0;
        $contrasenaActual = isset($datos['contrasena_actual']) ? $datos['contrasena_actual'] : '';
        $contrasenaNueva = isset($datos['contrasena_nueva']) ? $datos['contrasena_nueva'] : '';

        if ($idUsuario <= 0 || $contrasenaActual === '' || $contrasenaNueva === '') {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Debes completar todos los campos de contraseña."
            ]);
            exit();
        }

        try {
            // Verifica que la contraseña actual o temporal coincida con la guardada en MySQL
            $sqlBuscar = "SELECT contrasena FROM usuarios WHERE id_usuario = :id_usuario LIMIT 1";
            $stmtBuscar = $conexion->prepare($sqlBuscar);
            $stmtBuscar->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmtBuscar->execute();
            $registro = $stmtBuscar->fetch(PDO::FETCH_ASSOC);

            if (!$registro || (!password_verify($contrasenaActual, $registro['contrasena']) && $contrasenaActual !== $registro['contrasena'])) {
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "La contraseña actual o temporal ingresada es incorrecta."
                ]);
                exit();
            }

            // Encripta y guarda la nueva contraseña
            $nuevaHash = password_hash($contrasenaNueva, PASSWORD_DEFAULT);
            $sqlActualizar = "UPDATE usuarios SET contrasena = :contrasena WHERE id_usuario = :id_usuario";
            $stmtActualizar = $conexion->prepare($sqlActualizar);
            $stmtActualizar->bindParam(':contrasena', $nuevaHash);
            $stmtActualizar->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmtActualizar->execute();

            echo json_encode([
                "exito" => true,
                "mensaje" => "Contraseña actualizada correctamente"
            ]);
        } catch (PDOException $error) {
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al actualizar la contraseña"
            ]);
        }
        exit();
    }

    echo json_encode([
        "exito" => false,
        "mensaje" => "Solicitud no válida"
    ]);
}