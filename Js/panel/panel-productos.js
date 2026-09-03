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

const imagenesLocalesAdmin = {
    'entre pierna de broaster': '../Broaster/BroasterEntrePierna.png',
    'pecho de broaster': '../Broaster/BroasterPecho.png',
    'pierna completa de broaster': '../Broaster/BroasterPiernaCompleta.png',
    'ala con pecho de broaster': '../Broaster/BroasterAla.png',
    'salchipapa': '../Broaster/Salchipapa.png',
    'broaster salchipapa': '../Broaster/BroasterSalchipapa.png',
    'porción de chaufa': '../Broaster/PorcionChaufa.png',
    'porcion de chaufa': '../Broaster/PorcionChaufa.png',
    'porción de papa': '../Broaster/PorcionPapa.png',
    'porcion de papa': '../Broaster/PorcionPapa.png',
    'chicha - vaso': '../Bebida/VasoChicha.jpg',
    'chicha - medio litro': '../Bebida/MedioLitroChicha.jpg',
    'chicha - litro': '../Bebida/LitroChicha.jpg',
    'maracuyá - vaso': '../Bebida/VasoMaracuya.jpg',
    'maracuya - vaso': '../Bebida/VasoMaracuya.jpg',
    'maracuyá - medio litro': '../Bebida/MedioLitroMaracuya.jpg',
    'maracuya - medio litro': '../Bebida/MedioLitroMaracuya.jpg',
    'maracuyá - litro': '../Bebida/LitroMaracuya.jpg',
    'maracuya - litro': '../Bebida/LitroMaracuya.jpg'
};

function imagenProductoAdmin(producto) {
    if (producto?.imagen_url) return producto.imagen_url;
    const nombre = String(producto?.nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return imagenesLocalesAdmin[nombre] || '';
}


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
    const archivoImagen = document.getElementById('productoImagenArchivo');
    const urlImagen = document.getElementById('productoImagen');
    if (archivoImagen) archivoImagen.addEventListener('change', () => {
        const f = archivoImagen.files?.[0];
        if (f) actualizarPreviewProducto(URL.createObjectURL(f));
    });
    if (urlImagen) urlImagen.addEventListener('input', () => {
        if (!archivoImagen?.files?.length) actualizarPreviewProducto(urlImagen.value.trim());
    });
    const nombreProductoInput = document.getElementById('productoNombre');
    if (nombreProductoInput) nombreProductoInput.addEventListener('input', () => {
        if (!archivoImagen?.files?.length && !urlImagen?.value.trim()) {
            actualizarPreviewProducto(imagenProductoAdmin({ nombre: nombreProductoInput.value }));
        }
    });
    
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
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        productosGlobal = data || [];
        renderizarTablaProductos(productosGlobal);
    } catch (err) {
        console.error('Error al cargar productos:', err);
        tbody.innerHTML = '<tr><td colspan="7" class="sin-ventas" style="color:var(--danger)">Error al cargar productos.</td></tr>';
    }
}

function determinarServicio(horaInicio, horaFin, categoria = '') {
    const cat = String(categoria || '').toLowerCase();
    if (cat === 'cevicheria') return 'Cevichería';
    if (cat === 'broaster') return 'Broaster';
    if (cat === 'bebida' || cat === 'bebidas') return 'Ambos/Bebidas';
    if (horaInicio === '11:00:00' && horaFin === '15:59:59') return 'Cevichería';
    if (horaInicio === '16:00:00' && horaFin === '23:59:59') return 'Broaster';
    return 'Ambos/Bebidas';
}

function codigoProductoProfesional(p) {
    if (p?.codigo) return p.codigo;
    const limpio = String(p?.id || '').replace(/-/g, '').slice(0, 8).toUpperCase();
    return limpio ? `PRD-${limpio}` : 'PRD-SIN-ID';
}

function categoriaBDDesdeServicio(servicio) {
    if (servicio === 'Cevichería') return 'cevicheria';
    if (servicio === 'Broaster') return 'broaster';
    return 'bebida';
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
        const servicio = determinarServicio(p.hora_inicio, p.hora_fin, p.categoria);
        
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
            <td><strong>${codigoProductoProfesional(p)}</strong></td>
            <td>
                <div class="producto-admin-identidad">
                    ${imagenProductoAdmin(p) ? `<img class="producto-admin-thumb" src="${imagenProductoAdmin(p)}" alt="${p.nombre}">` : `<span class="producto-admin-thumb producto-admin-thumb-vacio"><i class="fa-regular fa-image"></i></span>`}
                    <strong>${p.nombre}</strong>
                </div>
            </td>
            <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
            <td>${p.subcategoria || p.categoria}</td>
            <td>${servicio}</td>
            <td>${estadoBadge}</td>
            <td>
                <div class="acciones-pedido">
                    <button class="btn-editar-pedido-tabla btn-accion-producto" onclick='abrirModalProducto(${JSON.stringify(p.id)})' title="Editar"><i class="fa-solid fa-pen"></i><span>Editar</span></button>
                    ${p.disponible && p.activo !== false ? 
                        `<button class="btn-estado-pedido-tabla btn-accion-producto" onclick='cambiarEstadoProducto(${JSON.stringify(p.id)}, \"agotar\")' title="Agotar"><i class="fa-solid fa-ban"></i><span>Agotar</span></button>` : 
                        `<button class="btn-cerrar-pedido btn-accion-producto" onclick='cambiarEstadoProducto(${JSON.stringify(p.id)}, \"activar\")' title="Activar"><i class="fa-solid fa-check"></i><span>Activar</span></button>`
                    }
                    <button class="btn-eliminar-pedido-tabla btn-accion-producto" onclick='confirmarEliminarProducto(${JSON.stringify(p.id)})' title="Eliminar"><i class="fa-solid fa-trash"></i><span>Eliminar</span></button>
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
        const prodServicio = determinarServicio(p.hora_inicio, p.hora_fin, p.categoria);
        
        const codigo = codigoProductoProfesional(p).toLowerCase();
        const matchSearch = p.nombre.toLowerCase().includes(search) || String(p.id).toLowerCase().includes(search) || codigo.includes(search);
        const matchServicio = servicio === '' || prodServicio === servicio;
        const matchCategoria = categoria === '' || (p.subcategoria || p.categoria) === categoria;
        
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
    actualizarPreviewProducto('');
    actualizarCategoriasModal('Cevichería'); // Default
    
    if (id) {
        const p = productosGlobal.find(prod => prod.id === id);
        if (p) {
            titulo.textContent = 'Editar Producto';
            document.getElementById('productoId').value = p.id;
            document.getElementById('productoNombre').value = p.nombre || '';
            document.getElementById('productoDescripcion').value = p.descripcion || '';
            document.getElementById('productoPrecio').value = p.precio || '';
            
            const servicio = determinarServicio(p.hora_inicio, p.hora_fin, p.categoria);
            document.getElementById('productoServicio').value = servicio;
            actualizarCategoriasModal(servicio, p.subcategoria || null);
            
            document.getElementById('productoImagen').value = p.imagen_url || '';
            actualizarPreviewProducto(imagenProductoAdmin(p));
            
            let estadoVal = 'disponible';
            if (p.activo === false) estadoVal = 'oculto';
            else if (p.disponible === false) estadoVal = 'agotado';
            document.getElementById('productoEstado').value = estadoVal;
            const destacado = document.getElementById('productoDestacado'); if (destacado) destacado.checked = Boolean(p.destacado);
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

function actualizarPreviewProducto(src) {
    const img = document.getElementById('productoImagenPreview');
    const vacio = document.getElementById('productoImagenPreviewVacio');
    if (!img || !vacio) return;
    if (src) { img.src = src; img.hidden = false; vacio.hidden = true; }
    else { img.removeAttribute('src'); img.hidden = true; vacio.hidden = false; }
}

async function subirImagenProducto(file) {
    if (!file) return '';
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Formato de imagen no permitido.');
    if (file.size > 5 * 1024 * 1024) throw new Error('La imagen supera los 5 MB.');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const nombre = `producto-${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const ruta = `catalogo/${nombre}`;
    const { error } = await window.juanekosSupabase.storage.from('productos').upload(ruta, file, { cacheControl:'3600', upsert:false, contentType:file.type });
    if (error) throw error;
    const { data } = window.juanekosSupabase.storage.from('productos').getPublicUrl(ruta);
    return data?.publicUrl || '';
}

async function guardarProducto(e) {
    e.preventDefault();

    const form = e.currentTarget || document.getElementById('formProducto');
    const btn = form?.querySelector('[type="submit"]');
    if (btn?.disabled) return;

    const id = document.getElementById('productoId')?.value?.trim() || '';
    const nombre = document.getElementById('productoNombre')?.value?.trim() || '';
    const descripcion = document.getElementById('productoDescripcion')?.value?.trim() || '';
    const precio = Number(document.getElementById('productoPrecio')?.value || 0);
    const servicio = document.getElementById('productoServicio')?.value || '';
    const categoria = document.getElementById('productoCategoria')?.value || '';
    const archivoImagen = document.getElementById('productoImagenArchivo')?.files?.[0] || null;
    const urlIngresada = document.getElementById('productoImagen')?.value?.trim() || '';
    const estado = document.getElementById('productoEstado')?.value || 'disponible';

    if (!nombre) return mostrarToast?.('Ingresa el nombre del producto', 'error');
    if (!Number.isFinite(precio) || precio < 0) return mostrarToast?.('Ingresa un precio válido', 'error');
    if (!servicio || !categoria) return mostrarToast?.('Selecciona servicio y categoría', 'error');

    const horarios = horariosPorServicio[servicio] || horariosPorServicio['Ambos/Bebidas'];
    let disponible = estado !== 'agotado' && estado !== 'oculto';
    let activo = estado !== 'oculto';

    const existente = id ? productosGlobal.find(p => String(p.id) === String(id)) : null;
    let imagen_url = urlIngresada || existente?.imagen_url || null;

    try {
        if (btn) { btn.disabled = true; btn.dataset.textoOriginal = btn.textContent; btn.textContent = 'Guardando...'; }
        if (archivoImagen) imagen_url = await subirImagenProducto(archivoImagen);

        const payload = {
            nombre,
            descripcion,
            precio,
            categoria: categoriaBDDesdeServicio(servicio),
            subcategoria: categoria,
            imagen_url,
            destacado: Boolean(document.getElementById('productoDestacado')?.checked),
            disponible,
            activo,
            hora_inicio: horarios.inicio,
            hora_fin: horarios.fin
        };

        let respuesta;
        if (id) {
            respuesta = await window.juanekosSupabase
                .from('productos')
                .update(payload)
                .eq('id', id)
                .select('*')
                .maybeSingle();
        } else {
            respuesta = await window.juanekosSupabase
                .from('productos')
                .insert([payload])
                .select('*')
                .single();
        }

        if (respuesta.error) throw respuesta.error;
        if (id && !respuesta.data) throw new Error('Supabase no confirmó la actualización. Revisa las políticas RLS del producto.');

        if (typeof mostrarToast === 'function') mostrarToast(id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente', 'exito');
        else alert(id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');

        cerrarModalProducto();
        await cargarProductosAdmin();
        if (typeof cargarCatalogoSupabase === 'function') await cargarCatalogoSupabase();
    } catch (err) {
        console.error('Error al guardar producto:', err);
        const msg = `No se pudo guardar el producto: ${err?.message || 'error desconocido'}`;
        if (typeof mostrarToast === 'function') mostrarToast(msg, 'error'); else alert(msg);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.textoOriginal || 'Guardar Producto'; }
    }
}
window.guardarProducto = guardarProducto;

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
