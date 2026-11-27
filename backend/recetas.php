<?php
/**
 * Servicio del módulo de recetas (RF 22 al RF 30).
 * Gestiona resumen del panel, listado con costo unitario, catálogos,
 * consulta de detalle, creación y edición transaccional de fórmulas.
 */
require_once 'conexion.php';

$metodo =$_SERVER['REQUEST_METHOD'];

// 1. Consultas GET
if ($metodo === 'GET') {$accion = isset($_GET['accion']) ?$_GET['accion'] : 'resumen';

    try {
        // Acción A: Métricas y últimas recetas para RecetasInicio
        if ($accion === 'resumen') {$sqlConteo = "SELECT
                            SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) AS activas,
                            SUM(CASE WHEN estado = 0 THEN 1 ELSE 0 END) AS inactivas
                          FROM recetas";
            $stmtConteo =$conexion->prepare($sqlConteo);$stmtConteo->execute();
            $conteo =$stmtConteo->fetch(PDO::FETCH_ASSOC);

            $sqlRecientes = "SELECT r.id_receta, r.rendimiento, r.estado,
                                    p.codigo AS codigo_producto, p.nombre AS nombre_producto
                             FROM recetas r
                             INNER JOIN productos_terminados p ON r.id_producto = p.id_producto
                             ORDER BY r.id_receta DESC
                             LIMIT 5";
            $stmtRecientes =$conexion->prepare($sqlRecientes);$stmtRecientes->execute();
            $recientes =$stmtRecientes->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "exito" => true,
                "activas" => intval($conteo['activas'] ?? 0),
                "inactivas" => intval($conteo['inactivas'] ?? 0),
                "recientes" => $recientes
            ]);
            exit();
        }

        // Acción B: Listado completo de recetas con costo total y costo unitario calculado (RF 28)
        if ($accion === 'listar') {$sqlListar = "SELECT
                            r.id_receta,
                            r.instrucciones,
                            r.rendimiento,
                            r.estado,
                            r.id_producto,
                            p.codigo AS codigo_producto,
                            p.nombre AS nombre_producto,
                            p.precio_venta,
                            COALESCE(SUM(dr.cantidad_requerida * mp.costo_unitario), 0) AS costo_total,
                            CASE
                                WHEN r.rendimiento > 0 THEN COALESCE(SUM(dr.cantidad_requerida * mp.costo_unitario), 0) / r.rendimiento
                                ELSE 0
                            END AS costo_unitario
                          FROM recetas r
                          INNER JOIN productos_terminados p ON r.id_producto = p.id_producto
                          LEFT JOIN detalles_receta dr ON r.id_receta = dr.id_receta
                          LEFT JOIN materias_primas mp ON dr.id_materia_prima = mp.id_materia_prima
                          GROUP BY
                            r.id_receta,
                            r.instrucciones,
                            r.rendimiento,
                            r.estado,
                            r.id_producto,
                            p.codigo,
                            p.nombre,
                            p.precio_venta
                          ORDER BY r.id_receta ASC";

            $stmtListar =$conexion->prepare($sqlListar);$stmtListar->execute();
            $recetas =$stmtListar->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "exito" => true,
                "recetas" => $recetas
            ]);
            exit();
        }

        // Acción C: Productos sin receta asignada y materias primas activas para NuevaReceta
        if ($accion === 'catalogos') {$sqlProductos = "SELECT p.id_producto, p.codigo, p.nombre
                             FROM productos_terminados p
                             LEFT JOIN recetas r ON p.id_producto = r.id_producto
                             WHERE p.estado = 1 AND r.id_receta IS NULL
                             ORDER BY p.nombre ASC";
            $stmtProductos =$conexion->prepare($sqlProductos);$stmtProductos->execute();
            $productos =$stmtProductos->fetchAll(PDO::FETCH_ASSOC);

            $sqlMaterias = "SELECT id_materia_prima, nombre, unidad_medida, costo_unitario, stock_actual
                            FROM materias_primas
                            WHERE estado = 1
                            ORDER BY nombre ASC";
            $stmtMaterias =$conexion->prepare($sqlMaterias);$stmtMaterias->execute();
            $materiasPrimas =$stmtMaterias->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "exito" => true,
                "productos" => $productos,
                "materias_primas" => $materiasPrimas
            ]);
            exit();
        }

        // Acción D: Detalle completo de una receta e ingredientes para EditarReceta y ConsultarReceta
        if ($accion === 'detalle') {$idReceta = isset($_GET['id_receta']) ? intval($_GET['id_receta']) : 0;

            if ($idReceta <= 0) {
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "Identificador de receta no válido."
                ]);
                exit();
            }

            $sqlReceta = "SELECT r.id_receta, r.instrucciones, r.rendimiento, r.estado, r.id_producto,
                                 p.codigo AS codigo_producto, p.nombre AS nombre_producto, p.precio_venta
                          FROM recetas r
                          INNER JOIN productos_terminados p ON r.id_producto = p.id_producto
                          WHERE r.id_receta = :id_receta
                          LIMIT 1";
            $stmtReceta =$conexion->prepare($sqlReceta);$stmtReceta->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtReceta->execute();
            $receta =$stmtReceta->fetch(PDO::FETCH_ASSOC);

            if (!$receta) {
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "No se encontró la receta solicitada."
                ]);
                exit();
            }

            $sqlIngredientes = "SELECT dr.id_detalle_receta, dr.cantidad_requerida, dr.id_materia_prima,
                                       mp.nombre, mp.unidad_medida, mp.costo_unitario, mp.stock_actual
                                FROM detalles_receta dr
                                INNER JOIN materias_primas mp ON dr.id_materia_prima = mp.id_materia_prima
                                WHERE dr.id_receta = :id_receta
                                ORDER BY dr.id_detalle_receta ASC";
            $stmtIngredientes =$conexion->prepare($sqlIngredientes);$stmtIngredientes->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtIngredientes->execute();
            $ingredientes =$stmtIngredientes->fetchAll(PDO::FETCH_ASSOC);

            // Productos disponibles (libres o el actualmente vinculado a esta receta)
            $sqlProductos = "SELECT p.id_producto, p.codigo, p.nombre
                             FROM productos_terminados p
                             LEFT JOIN recetas r ON p.id_producto = r.id_producto
                             WHERE p.estado = 1 AND (r.id_receta IS NULL OR r.id_receta = :id_receta)
                             ORDER BY p.nombre ASC";
            $stmtProductos =$conexion->prepare($sqlProductos);$stmtProductos->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtProductos->execute();
            $productos =$stmtProductos->fetchAll(PDO::FETCH_ASSOC);

            $sqlMaterias = "SELECT id_materia_prima, nombre, unidad_medida, costo_unitario, stock_actual
                            FROM materias_primas
                            WHERE estado = 1
                               OR id_materia_prima IN (
                                   SELECT id_materia_prima FROM detalles_receta WHERE id_receta = :id_receta
                               )
                            ORDER BY nombre ASC";
            $stmtMaterias =$conexion->prepare($sqlMaterias);$stmtMaterias->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtMaterias->execute();
            $materiasPrimas =$stmtMaterias->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "exito" => true,
                "receta" => $receta,
                "ingredientes" => $ingredientes,
                "productos" => $productos,
                "materias_primas" => $materiasPrimas
            ]);
            exit();
        }
    } catch (PDOException $error) {
        http_response_code(500);
        echo json_encode([
            "exito" => false,
            "mensaje" => "Error al consultar los datos de recetas en la base de datos"
        ]);
        exit();
    }
}

// 2. Peticiones POST (crear, editar o cambiar estado)
if ($metodo === 'POST') {$datos = json_decode(file_get_contents("php://input"), true);
    $accion = isset($datos['accion']) ?$datos['accion'] : '';

    // Acción A: Registrar nueva receta y sus ingredientes en transacción
    if ($accion === 'crear') {$idProducto = isset($datos['id_producto']) ? intval($datos['id_producto']) : 0;
        $rendimiento = isset($datos['rendimiento']) ? intval($datos['rendimiento']) : 0;
        $tiempoPreparacion = isset($datos['tiempo_preparacion']) ? trim($datos['tiempo_preparacion']) : '';$temperaturaHorneado = isset($datos['temperatura_horneado']) ? trim($datos['temperatura_horneado']) : '';
        $tiempoHorneado = isset($datos['tiempo_horneado']) ? trim($datos['tiempo_horneado']) : '';$pasoAPaso = isset($datos['paso_a_paso']) ? trim($datos['paso_a_paso']) : '';
        $ingredientes = isset($datos['ingredientes']) && is_array($datos['ingredientes']) ?$datos['ingredientes'] : [];

        if ($idProducto <= 0 ||$rendimiento <= 0 || $pasoAPaso === '' || count($ingredientes) === 0) {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Completa el producto, el rendimiento, el paso a paso y al menos un ingrediente."
            ]);
            exit();
        }

        try {
            $sqlVerificar = "SELECT id_receta FROM recetas WHERE id_producto = :id_producto LIMIT 1";
            $stmtVerificar =$conexion->prepare($sqlVerificar);$stmtVerificar->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);$stmtVerificar->execute();

            if ($stmtVerificar->fetch(PDO::FETCH_ASSOC)) {
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "El producto seleccionado ya tiene una receta registrada."
                ]);
                exit();
            }

            $detallesTiempo = [];
            if ($tiempoPreparacion !== '') {$detallesTiempo[] = "Tiempo de preparación: {$tiempoPreparacion} min";
            }
            if ($temperaturaHorneado !== '') {$detallesTiempo[] = "Temperatura de horneado: {$temperaturaHorneado} °C";
            }
            if ($tiempoHorneado !== '') {$detallesTiempo[] = "Tiempo de horneado: {$tiempoHorneado} min";
            }

            $instruccionesFinales = count($detallesTiempo) > 0
                ? implode(" | ", $detallesTiempo) . "\n\n" . $pasoAPaso
                : $pasoAPaso;

            $conexion->beginTransaction();

            $sqlReceta = "INSERT INTO recetas (instrucciones, rendimiento, estado, id_producto)
                          VALUES (:instrucciones, :rendimiento, 1, :id_producto)";
            $stmtReceta =$conexion->prepare($sqlReceta);$stmtReceta->bindParam(':instrucciones', $instruccionesFinales);$stmtReceta->bindParam(':rendimiento', $rendimiento, PDO::PARAM_INT);$stmtReceta->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);$stmtReceta->execute();

            $idRecetaNueva = intval($conexion->lastInsertId());

            $sqlDetalle = "INSERT INTO detalles_receta (cantidad_requerida, id_receta, id_materia_prima)
                           VALUES (:cantidad_requerida, :id_receta, :id_materia_prima)";
            $stmtDetalle = $conexion->prepare($sqlDetalle);

            foreach ($ingredientes as $ingrediente) {$idMateriaPrima = isset($ingrediente['id_materia_prima']) ? intval($ingrediente['id_materia_prima']) : 0;
                $cantidadRequerida = isset($ingrediente['cantidad_requerida']) ? floatval($ingrediente['cantidad_requerida']) : 0;

                if ($idMateriaPrima <= 0 || $cantidadRequerida <= 0) {$conexion->rollBack();
                    echo json_encode([
                        "exito" => false,
                        "mensaje" => "Todos los ingredientes deben tener materia prima seleccionada y cantidad mayor a cero."
                    ]);
                    exit();
                }

                $stmtDetalle->bindParam(':cantidad_requerida', $cantidadRequerida);$stmtDetalle->bindParam(':id_receta', $idRecetaNueva, PDO::PARAM_INT);$stmtDetalle->bindParam(':id_materia_prima', $idMateriaPrima, PDO::PARAM_INT);$stmtDetalle->execute();
            }

            $conexion->commit();

            echo json_encode([
                "exito" => true,
                "mensaje" => "Receta guardada correctamente",
                "id_receta" => $idRecetaNueva
            ]);
        } catch (PDOException $error) {
            if ($conexion->inTransaction()) {$conexion->rollBack();
            }
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al guardar la receta en la base de datos"
            ]);
        }
        exit();
    }

    // Acción B: Editar receta existente y reemplazar su lista de ingredientes
    if ($accion === 'editar') {
        $idReceta = isset($datos['id_receta']) ? intval($datos['id_receta']) : 0;
        $idProducto = isset($datos['id_producto']) ? intval($datos['id_producto']) : 0;
        $rendimiento = isset($datos['rendimiento']) ? intval($datos['rendimiento']) : 0;
        $estado = isset($datos['estado']) ? intval($datos['estado']) : 1;
        $tiempoPreparacion = isset($datos['tiempo_preparacion']) ? trim($datos['tiempo_preparacion']) : '';
        $temperaturaHorneado = isset($datos['temperatura_horneado']) ? trim($datos['temperatura_horneado']) : '';
        $tiempoHorneado = isset($datos['tiempo_horneado']) ? trim($datos['tiempo_horneado']) : '';
        $pasoAPaso = isset($datos['paso_a_paso']) ? trim($datos['paso_a_paso']) : '';
        $ingredientes = isset($datos['ingredientes']) && is_array($datos['ingredientes']) ? $datos['ingredientes'] : [];

        if ($idReceta <= 0 || $idProducto <= 0 || $rendimiento <= 0 || $pasoAPaso === '' || count($ingredientes) === 0) {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Completa todos los campos obligatorios y agrega al menos un ingrediente."
            ]);
            exit();
        }

        try {
            $sqlVerificar = "SELECT id_receta FROM recetas
                             WHERE id_producto = :id_producto AND id_receta != :id_receta
                             LIMIT 1";
            $stmtVerificar =$conexion->prepare($sqlVerificar);$stmtVerificar->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);$stmtVerificar->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtVerificar->execute();

            if ($stmtVerificar->fetch(PDO::FETCH_ASSOC)) {
                echo json_encode([
                    "exito" => false,
                    "mensaje" => "Otro registro de receta ya está asociado a ese producto terminado."
                ]);
                exit();
            }

            $detallesTiempo = [];
            if ($tiempoPreparacion !== '') {$detallesTiempo[] = "Tiempo de preparación: {$tiempoPreparacion} min";
            }
            if ($temperaturaHorneado !== '') {$detallesTiempo[] = "Temperatura de horneado: {$temperaturaHorneado} °C";
            }
            if ($tiempoHorneado !== '') {$detallesTiempo[] = "Tiempo de horneado: {$tiempoHorneado} min";
            }

            $instruccionesFinales = count($detallesTiempo) > 0
                ? implode(" | ", $detallesTiempo) . "\n\n" . $pasoAPaso
                : $pasoAPaso;

            $conexion->beginTransaction();

            $sqlActualizar = "UPDATE recetas
                              SET instrucciones = :instrucciones,
                                  rendimiento = :rendimiento,
                                  estado = :estado,
                                  id_producto = :id_producto
                              WHERE id_receta = :id_receta";
            $stmtActualizar =$conexion->prepare($sqlActualizar);$stmtActualizar->bindParam(':instrucciones', $instruccionesFinales);$stmtActualizar->bindParam(':rendimiento', $rendimiento, PDO::PARAM_INT);$stmtActualizar->bindParam(':estado', $estado, PDO::PARAM_INT);$stmtActualizar->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);$stmtActualizar->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtActualizar->execute();

            // Reemplaza los ingredientes anteriores por la lista actualizada
            $sqlLimpiar = "DELETE FROM detalles_receta WHERE id_receta = :id_receta";
            $stmtLimpiar =$conexion->prepare($sqlLimpiar);$stmtLimpiar->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtLimpiar->execute();

            $sqlDetalle = "INSERT INTO detalles_receta (cantidad_requerida, id_receta, id_materia_prima)
                           VALUES (:cantidad_requerida, :id_receta, :id_materia_prima)";
            $stmtDetalle = $conexion->prepare($sqlDetalle);

            foreach ($ingredientes as $ingrediente) {$idMateriaPrima = isset($ingrediente['id_materia_prima']) ? intval($ingrediente['id_materia_prima']) : 0;
                $cantidadRequerida = isset($ingrediente['cantidad_requerida']) ? floatval($ingrediente['cantidad_requerida']) : 0;

                if ($idMateriaPrima <= 0 || $cantidadRequerida <= 0) {$conexion->rollBack();
                    echo json_encode([
                        "exito" => false,
                        "mensaje" => "Todos los ingredientes deben tener materia prima válida y cantidad mayor a cero."
                    ]);
                    exit();
                }

                $stmtDetalle->bindParam(':cantidad_requerida', $cantidadRequerida);$stmtDetalle->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtDetalle->bindParam(':id_materia_prima', $idMateriaPrima, PDO::PARAM_INT);$stmtDetalle->execute();
            }

            $conexion->commit();

            echo json_encode([
                "exito" => true,
                "mensaje" => "Receta actualizada correctamente"
            ]);
        } catch (PDOException $error) {
            if ($conexion->inTransaction()) {$conexion->rollBack();
            }
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al actualizar la receta en la base de datos"
            ]);
        }
        exit();
    }

    // Acción C: Activar o inactivar receta
    if ($accion === 'cambiar_estado') {$idReceta = isset($datos['id_receta']) ? intval($datos['id_receta']) : 0;
        $nuevoEstado = isset($datos['estado']) ? intval($datos['estado']) : 0;

        if ($idReceta <= 0 || ($nuevoEstado !== 0 &&$nuevoEstado !== 1)) {
            echo json_encode([
                "exito" => false,
                "mensaje" => "Datos no válidos para cambiar el estado de la receta."
            ]);
            exit();
        }

        try {
            $sqlEstado = "UPDATE recetas SET estado = :estado WHERE id_receta = :id_receta";
            $stmtEstado =$conexion->prepare($sqlEstado);$stmtEstado->bindParam(':estado', $nuevoEstado, PDO::PARAM_INT);$stmtEstado->bindParam(':id_receta', $idReceta, PDO::PARAM_INT);$stmtEstado->execute();

            echo json_encode([
                "exito" => true,
                "mensaje" => $nuevoEstado === 1 ? "Receta activada correctamente" : "Receta inactivada correctamente"
            ]);
        } catch (PDOException $error) {
            http_response_code(500);
            echo json_encode([
                "exito" => false,
                "mensaje" => "Error interno al actualizar el estado de la receta"
            ]);
        }
        exit();
    }
}

echo json_encode([
    "exito" => false,
    "mensaje" => "Solicitud no válida"
]);