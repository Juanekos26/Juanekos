const categoriasPorServicio = {
    'Cevichería': ['Ceviches', 'Leche de Tigre', 'Arroces', 'Chicharrones', 'Platos Criollos'],
    'Broaster': ['Pollo Broaster', 'Salchipapas', 'Alitas', 'Hamburguesas'],
    'Ambos/Bebidas': ['Gaseosas', 'Chicha', 'Limonada', 'Cervezas', 'Porciones Extra']
};

const horariosPorServicio = {
    'Cevichería': { inicio: '11:00:00', fin: '15:59:59' },
    'Broaster': { inicio: '16:00:00', fin: '23:59:59' },
    'Ambos/Bebidas': { inicio: '11:00:00', fin: '23:59:59' }
};

let productosGlobal = [];

function configurarFiltrosProductos() {
    cargarProductosAdmin();

    const searchInput = document.getElementById('buscarProductoNombre');
    const filterServicio = document.getElementById('filtroProductoServicio');
    const filterCategoria = document.getElementById('filtroProductoCategoria');
    const filterEstado = document.getElementById('filtroProductoDisponibilidad');
    const btnLimpiar = document.getElementById('btnLimpiarFiltrosProductos');
    const btnActualizar = document.getElementById('btnActualizarProductos');
    const btnAgregar = document.getElementById('btnAgregarProductoNuevo');
    
    // Modal
    const modal = document.getElementById('modalProducto');
    const btnCerrarModal = document.getElementById('btnCerrarModalProducto');
    const btnCancelarModal = document.getElementById('btnCancelarProducto');
    const backdropModal = document.getElementById('backdropModalProducto');
    const formProducto = document.getElementById('formProducto');
    const selectServicioModal = document.getElementById('productoServicio');
    
    // Listeners Filtros
    if (searchInput) searchInput.addEventListener('input', filtrarTablaProductos);
    if (filterServicio) {
        filterServicio.addEventListener('change', () => {
            actualizarCategoriasFiltro();
            filtrarTablaProductos();
        });
    }
    if (filterCategoria) filterCategoria.addEventListener('change', filtrarTablaProductos);
    if (filterEstado) filterEstado.addEventListener('change', filtrarTablaProductos);
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterServicio) filterServicio.value = '';
            if (filterCategoria) filterCategoria.innerHTML = '<option value="">Todas</option>';
            if (filterEstado) filterEstado.value = '';
            filtrarTablaProductos();
        });
    }
    if (btnActualizar) btnActualizar.addEventListener('click', cargarProductosAdmin);
    
    // Listeners Modal
    if (btnAgregar) btnAgregar.addEventListener('click', () => abrirModalProducto());
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalProducto);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModalProducto);
    if (backdropModal) backdropModal.addEventListener('click', cerrarModalProducto);
    if (formProducto) formProducto.addEventListener('submit', guardarProducto);
    
    if (selectServicioModal) {
        selectServicioModal.addEventListener('change', () => {
            actualizarCategoriasModal(selectServicioModal.value);
        });
    }
}

async function cargarProductosAdmin() {
    const tbody = document.getElementById('listaProductosCRUD');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="sin-ventas">Cargando productos...</td></tr>';
    
    try {
        const { data, error } = await window.juanekosSupabase
            .from('productos')
            .select('*')
            .order('id', { ascending: false });
            
        if (error) throw error;
        
        productosGlobal = data || [];
        renderizarTablaProductos(productosGlobal);
    } catch (err) {
        console.error('Error al cargar productos:', err);
        tbody.innerHTML = '<tr><td colspan="7" class="sin-ventas" style="color:var(--danger)">Error al cargar productos.</td></tr>';
    }
}

function determinarServicio(horaInicio, horaFin) {
    if (horaInicio === '11:00:00' && horaFin === '15:59:59') return 'Cevichería';
    if (horaInicio === '16:00:00' && horaFin === '23:59:59') return 'Broaster';
    return 'Ambos/Bebidas';
}

function renderizarTablaProductos(productos) {
    const tbody = document.getElementById('listaProductosCRUD');
    if (!tbody) return;
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="sin-ventas">No se encontraron productos.</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    productos.forEach(p => {
        const servicio = determinarServicio(p.hora_inicio, p.hora_fin);
        
        let estadoBadge = '';
        if (p.activo === false) {
            estadoBadge = '<span class="estado-pedido estado-cancelado">Oculto</span>';
        } else if (p.disponible === false) {
            estadoBadge = '<span class="estado-pedido estado-pendiente">Agotado</span>';
        } else {
            estadoBadge = '<span class="estado-pedido estado-listo">Disponible</span>';
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${p.id}</td>
            <td style="font-weight: 700;">${p.nombre}</td>
            <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
            <td>${p.categoria}</td>
            <td>${servicio}</td>
            <td>${estadoBadge}</td>
            <td>
                <div class="acciones-pedido">
                    <button class="btn-editar-pedido-tabla" onclick="abrirModalProducto(${p.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    ${p.disponible && p.activo !== false ? 
                        `<button class="btn-estado-pedido-tabla" style="background:#fffbe6; color:#d48806;" onclick="cambiarEstadoProducto(${p.id}, 'agotar')" title="Agotar"><i class="fa-solid fa-ban"></i></button>` : 
                        `<button class="btn-cerrar-pedido" onclick="cambiarEstadoProducto(${p.id}, 'activar')" title="Activar"><i class="fa-solid fa-check"></i></button>`
                    }
                    <button class="btn-eliminar-pedido-tabla" onclick="confirmarEliminarProducto(${p.id})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarCategoriasFiltro() {
    const filterServicio = document.getElementById('filtroProductoServicio');
    const filterCategoria = document.getElementById('filtroProductoCategoria');
    if (!filterServicio || !filterCategoria) return;
    
    const servicio = filterServicio.value;
    filterCategoria.innerHTML = '<option value="">Todas</option>';
    
    if (servicio && categoriasPorServicio[servicio]) {
        categoriasPorServicio[servicio].forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            filterCategoria.appendChild(opt);
        });
    } else {
        // Todas las categorias
        const todas = new Set();
        Object.values(categoriasPorServicio).forEach(lista => lista.forEach(c => todas.add(c)));
        Array.from(todas).sort().forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            filterCategoria.appendChild(opt);
        });
    }
}

function filtrarTablaProductos() {
    const search = document.getElementById('buscarProductoNombre')?.value.toLowerCase() || '';
    const servicio = document.getElementById('filtroProductoServicio')?.value || '';
    const categoria = document.getElementById('filtroProductoCategoria')?.value || '';
    const estado = document.getElementById('filtroProductoDisponibilidad')?.value || '';
    
    const filtrados = productosGlobal.filter(p => {
        const prodServicio = determinarServicio(p.hora_inicio, p.hora_fin);
        
        const matchSearch = p.nombre.toLowerCase().includes(search) || p.id.toString() === search;
        const matchServicio = servicio === '' || prodServicio === servicio;
        const matchCategoria = categoria === '' || p.categoria === categoria;
        
        let matchEstado = true;
        if (estado === 'disponible') matchEstado = p.disponible === true && p.activo === true;
        if (estado === 'agotado') matchEstado = p.disponible === false && p.activo === true;
        if (estado === 'oculto') matchEstado = p.activo === false;
        
        return matchSearch && matchServicio && matchCategoria && matchEstado;
    });
    
    renderizarTablaProductos(filtrados);
}

function actualizarCategoriasModal(servicio, categoriaSeleccionada = null) {
    const selectCategoria = document.getElementById('productoCategoria');
    if (!selectCategoria) return;
    
    selectCategoria.innerHTML = '';
    
    const categorias = categoriasPorServicio[servicio] || [];
    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        selectCategoria.appendChild(opt);
    });
    
    if (categoriaSeleccionada && categorias.includes(categoriaSeleccionada)) {
        selectCategoria.value = categoriaSeleccionada;
    }
}

function abrirModalProducto(id = null) {
    const modal = document.getElementById('modalProducto');
    const form = document.getElementById('formProducto');
    const titulo = document.getElementById('tituloModalProducto');
    
    if (!modal || !form) return;
    
    form.reset();
    document.getElementById('productoId').value = '';
    actualizarCategoriasModal('Cevichería'); // Default
    
    if (id) {
        const p = productosGlobal.find(prod => prod.id === id);
        if (p) {
            titulo.textContent = 'Editar Producto';
            document.getElementById('productoId').value = p.id;
            document.getElementById('productoNombre').value = p.nombre || '';
            document.getElementById('productoDescripcion').value = p.descripcion || '';
            document.getElementById('productoPrecio').value = p.precio || '';
            
            const servicio = determinarServicio(p.hora_inicio, p.hora_fin);
            document.getElementById('productoServicio').value = servicio;
            actualizarCategoriasModal(servicio, p.categoria);
            
            document.getElementById('productoImagen').value = p.imagen_url || '';
            
            let estadoVal = 'disponible';
            if (p.activo === false) estadoVal = 'oculto';
            else if (p.disponible === false) estadoVal = 'agotado';
            document.getElementById('productoEstado').value = estadoVal;
        }
    } else {
        titulo.textContent = 'Agregar Producto';
    }
    
    modal.removeAttribute('hidden');
    document.body.classList.add('admin-modal-open');
}

function cerrarModalProducto() {
    const modal = document.getElementById('modalProducto');
    if (modal) {
        modal.setAttribute('hidden', '');
        document.body.classList.remove('admin-modal-open');
    }
}

async function guardarProducto(e) {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('productoNombre').value;
    const descripcion = document.getElementById('productoDescripcion').value;
    const precio = document.getElementById('productoPrecio').value;
    const servicio = document.getElementById('productoServicio').value;
    const categoria = document.getElementById('productoCategoria').value;
    const imagen_url = document.getElementById('productoImagen').value;
    const estado = document.getElementById('productoEstado').value;
    
    const horarios = horariosPorServicio[servicio] || horariosPorServicio['Ambos/Bebidas'];
    
    let disponible = true;
    let activo = true;
    
    if (estado === 'agotado') {
        disponible = false;
    } else if (estado === 'oculto') {
        activo = false;
        disponible = false;
    }
    
    const payload = {
        nombre,
        descripcion,
        precio,
        categoria,
        imagen_url,
        disponible,
        activo,
        hora_inicio: horarios.inicio,
        hora_fin: horarios.fin
    };
    
    try {
        let error;
        if (id) {
            const res = await window.juanekosSupabase.from('productos').update(payload).eq('id', id);
            error = res.error;
        } else {
            const res = await window.juanekosSupabase.from('productos').insert([payload]);
            error = res.error;
        }
        
        if (error) throw error;
        
        if (typeof mostrarToast === 'function') {
            mostrarToast('Producto guardado correctamente', 'exito');
        } else {
            alert('Producto guardado correctamente');
        }
        
        cerrarModalProducto();
        cargarProductosAdmin();
        
    } catch (err) {
        console.error('Error al guardar producto:', err);
        if (typeof mostrarToast === 'function') {
            mostrarToast('Error al guardar producto', 'error');
        } else {
            alert('Error al guardar producto');
        }
    }
}

async function cambiarEstadoProducto(id, accion) {
    let payload = {};
    if (accion === 'agotar') {
        payload = { disponible: false };
    } else if (accion === 'activar') {
        payload = { disponible: true, activo: true };
    }
    
    try {
        const { error } = await window.juanekosSupabase.from('productos').update(payload).eq('id', id);
        if (error) throw error;
        
        if (typeof mostrarToast === 'function') mostrarToast('Estado actualizado', 'exito');
        cargarProductosAdmin();
    } catch (err) {
        console.error('Error al cambiar estado:', err);
        if (typeof mostrarToast === 'function') mostrarToast('Error al cambiar estado', 'error');
    }
}

function confirmarEliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
        eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        const { error } = await window.juanekosSupabase.from('productos').delete().eq('id', id);
        if (error) throw error;
        
        if (typeof mostrarToast === 'function') mostrarToast('Producto eliminado', 'exito');
        cargarProductosAdmin();
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        if (typeof mostrarToast === 'function') mostrarToast('Error al eliminar producto', 'error');
    }
}
