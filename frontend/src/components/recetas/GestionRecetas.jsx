import { useState, useEffect } from 'react';

/**
 * Componente GestionRecetas
 * Muestra la tabla general de recetas estandarizadas con su producto vinculado,
 * rendimiento, costo unitario calculado y modal para activar o inactivar fórmulas.
 */
function GestionRecetas({ onVolver, onNuevaReceta, onEditarReceta }) {
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');

    // Filtros y paginación
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 5;

    // Estados para el modal de activar / inactivar receta
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
    const [procesandoEstado, setProcesandoEstado] = useState(false);

    const cargarRecetas = async () => {
        setCargando(true);
        setErrorCarga('');

        try {
            const respuesta = await fetch(
                'http://localhost/Pan%20en%20su%20punto/backend/recetas.php?accion=listar'
            );
            const datos = await respuesta.json();

            if (datos.exito) {
                setRecetas(datos.recetas);
            } else {
                setErrorCarga(datos.mensaje || 'No se pudieron cargar las recetas.');
            }
        } catch (error) {
            setErrorCarga('Error de conexión con el servidor. Verifica que Apache esté encendido.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarRecetas();
    }, []);

    // Formatea el código de la receta como R-001
    const formatearCodigoReceta = (idReceta) => {
        return `R-${String(idReceta).padStart(3, '0')}`;
    };

    // Formatea valores monetarios en pesos colombianos
    const formatearMoneda = (valor) => {
        return `$ ${Math.round(Number(valor || 0)).toLocaleString('es-CO')}`;
    };

    // Filtra recetas por estado y texto
    const recetasFiltradas = recetas.filter((item) => {
        const estadoTexto = Number(item.estado) === 1 ? 'Activa' : 'Inactiva';
        const coincideEstado = filtroEstado === 'Todos' || estadoTexto === filtroEstado;
        const texto = busqueda.toLowerCase().trim();
        const codigoReceta = formatearCodigoReceta(item.id_receta).toLowerCase();

        const coincideTexto =
            texto === '' ||
            codigoReceta.includes(texto) ||
            item.nombre_producto.toLowerCase().includes(texto) ||
            item.codigo_producto.toLowerCase().includes(texto);

        return coincideEstado && coincideTexto;
    });

    // Cálculos de paginación
    const totalResultados = recetasFiltradas.length;
    const totalPaginas = Math.max(1, Math.ceil(totalResultados / registrosPorPagina));
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const recetasPaginadas = recetasFiltradas.slice(indiceInicio, indiceInicio + registrosPorPagina);

    // Abre el modal de confirmación para cambiar el estado
    const abrirModalEstado = (receta) => {
        setRecetaSeleccionada(receta);
        setModalEstadoAbierto(true);
    };

    // Envía la actualización de estado a PHP
    const confirmarCambioEstado = async () => {
        if (!recetaSeleccionada) return;
        setProcesandoEstado(true);

        const nuevoEstado = Number(recetaSeleccionada.estado) === 1 ? 0 : 1;

        try {
            const respuesta = await fetch('http://localhost/Pan%20en%20su%20punto/backend/recetas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'cambiar_estado',
                    id_receta: recetaSeleccionada.id_receta,
                    estado: nuevoEstado,
                }),
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                setRecetas((prev) =>
                    prev.map((item) =>
                        item.id_receta === recetaSeleccionada.id_receta
                            ? { ...item, estado: nuevoEstado }
                            : item
                    )
                );
                setModalEstadoAbierto(false);
                setRecetaSeleccionada(null);
            } else {
                alert(datos.mensaje || 'No se pudo actualizar el estado de la receta.');
            }
        } catch (error) {
            alert('Error de conexión al intentar cambiar el estado.');
        } finally {
            setProcesandoEstado(false);
        }
    };

    const esActivaSeleccionada = Number(recetaSeleccionada?.estado) === 1;

    return (
        <>
            <div className="encabezado-seccion">
                <div>
                    <h2>Gestión de recetas</h2>
                    <p>Administra las fórmulas estandarizadas y su estado para el área de producción.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="btn-secundario"
                        onClick={onVolver}
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        className="btn-principal"
                        onClick={onNuevaReceta}
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-plus"></i> Nueva receta
                    </button>
                </div>
            </div>

            <div className="tarjeta-datos">
                <div className="barra-filtros">
                    <div className="filtros-select">
                        <select
                            value={filtroEstado}
                            onChange={(e) => {
                                setFiltroEstado(e.target.value);
                                setPaginaActual(1);
                            }}
                        >
                            <option value="Todos">Estado: Todos</option>
                            <option value="Activa">Activa</option>
                            <option value="Inactiva">Inactiva</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        className="buscador-tabla"
                        placeholder="Buscar por código o producto..."
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
                    />
                </div>

                {errorCarga && (
                    <div className="alerta-error" style={{ marginBottom: '16px' }}>
                        {errorCarga}
                    </div>
                )}

                <table className="tabla-datos">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre de la receta</th>
                            <th>Producto vinculado</th>
                            <th>Rendimiento</th>
                            <th>Costo unitario</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    Cargando recetas...
                                </td>
                            </tr>
                        ) : recetasPaginadas.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay recetas registradas para mostrar.
                                </td>
                            </tr>
                        ) : (
                            recetasPaginadas.map((item) => {
                                const estaActiva = Number(item.estado) === 1;
                                return (
                                    <tr key={item.id_receta}>
                                        <td>{formatearCodigoReceta(item.id_receta)}</td>
                                        <td>Fórmula {item.nombre_producto}</td>
                                        <td>
                                            {item.codigo_producto} - {item.nombre_producto}
                                        </td>
                                        <td>{item.rendimiento} und</td>
                                        <td>{formatearMoneda(item.costo_unitario)}</td>
                                        <td>
                                            <span className={estaActiva ? 'estado-activo' : 'estado-inactivo'}>
                                                {estaActiva ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-icono"
                                                title="Editar"
                                                onClick={() => onEditarReceta(item)}
                                                style={{ border: 'none', cursor: 'pointer' }}
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-icono btn-estado-receta"
                                                title="Cambiar estado"
                                                onClick={() => abrirModalEstado(item)}
                                                style={{ border: 'none', cursor: 'pointer' }}
                                            >
                                                <i className="fa-solid fa-power-off"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                <div className="paginacion-tabla">
                    <button
                        type="button"
                        className="btn-pagina"
                        disabled={paginaActual === 1}
                        onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
                        <button
                            key={numero}
                            type="button"
                            className={`btn-pagina ${paginaActual === numero ? 'activo' : ''}`}
                            onClick={() => setPaginaActual(numero)}
                        >
                            {numero}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="btn-pagina"
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Modal de confirmación de estado */}
            {modalEstadoAbierto && recetaSeleccionada && (
                <div id="modal-estado-receta" className="fondo-modal">
                    <div className="contenido-modal centrado">
                        <div className="icono-peligro" id="modal-estado-icono">
                            <i className="fa-solid fa-power-off"></i>
                        </div>
                        <h3 id="modal-estado-titulo">
                            {esActivaSeleccionada ? '¿Inactivar receta?' : '¿Activar receta?'}
                        </h3>
                        <p id="modal-estado-mensaje">
                            {esActivaSeleccionada
                                ? 'Si inactivas esta receta, los panaderos no podrán utilizarla para crear nuevas órdenes de producción.'
                                : 'Al activar esta receta, volverá a estar disponible para programar órdenes de producción.'}
                        </p>
                        <div className="acciones-modal">
                            <button
                                type="button"
                                id="btn-cancelar-estado"
                                className="btn-secundario"
                                onClick={() => setModalEstadoAbierto(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                id="btn-confirmar-estado"
                                className="btn-principal"
                                disabled={procesandoEstado}
                                onClick={confirmarCambioEstado}
                            >
                                {procesandoEstado
                                    ? 'Procesando...'
                                    : esActivaSeleccionada
                                        ? 'Inactivar'
                                        : 'Activar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GestionRecetas;