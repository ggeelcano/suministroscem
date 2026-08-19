/* ==========================================================================
   Suministros CEM · Comercial El Maño
   Navegación, catálogo, buscador y cesta
   ========================================================================== */
(function () {
  'use strict';

  var FAMILIAS = window.CEM.familias;
  var PRODUCTOS = window.CEM.productos;
  var IMG = 'img/p/';

  var TEL = '+34934367990';
  var TEL_TXT = '93 436 79 90';
  var WA = '34611888558';
  var MAIL = 'pedidos@suministroscem.com';

  var MARCAS = ['Arcoroc', 'Ariane', 'Duralex', 'Porvasal', 'Lacor', 'Pujadas', 'Porcelanas del Principado',
    'Dalper', 'Sammic', 'Infrico', 'Coreco', 'Repagas', 'Distform', 'Araven', 'Valira',
    'Trilla', 'Soabel', 'SupremInox', 'Proquivi', 'Cim', 'Jay', 'Global', 'Comas & Partners'];

  var NOVEDADES = [
    { img: 'files_novedades_foto_1.jpg', n: 'Máquina de helado Lacor', c: 'Máquinas fabricadoras de helado', t: 'Novedad' },
    { img: 'files_novedades_foto_3.jpg', n: 'Mortero de granito', c: 'Morteros', t: 'Novedad' },
    { img: 'files_novedades_foto_5.jpg', n: 'Plato bandeja azulejo Vintage', c: 'Platos Decorados', t: 'Novedad' },
    { img: 'files_novedades_foto_6.jpg', n: 'Teja de presentación de alimentos', c: 'Alta Gastronomía', t: 'Novedad' },
    { img: 'files_novedades_foto_7.jpg', n: 'Cuchillos Global serie G', c: 'Cuchillo de Cocina Global', t: 'Novedad' }
  ];

  var NOTICIAS = [
    { img: 'files_texto_inicio_foto_37.jpg', t: 'Vajilla Terra de Ariane, cuatro decorados rústicos', d: 'La vajilla para hostelería Terra de Ariane es un conjunto de cuatro decorados rústicos, disponibles en Arena, Rojo, Azul y Moka, que crean un ambiente rural en la mesa.' },
    { img: 'files_texto_inicio_foto_38.jpg', t: 'Vajilla de pizarra para emplatados', d: 'La pizarra natural es uno de los soportes más socorridos para tapas, quesos y postres. La tenemos en varios formatos dentro de la familia de vajilla.' },
    { img: 'files_texto_inicio_foto_42.jpg', t: 'Cuchillos Global, acero japonés en la cocina', d: 'Los cuchillos de la marca Global están fabricados en una sola pieza de acero inoxidable. Trabajamos la serie G y los afiladores de la casa.' }
  ];

  /* ---------- utilidades ---------- */

  function e(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function eur(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function fecha(iso) {
    var m = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var d = iso.split('-');
    return Number(d[2]) + ' de ' + m[Number(d[1]) - 1] + ' de ' + d[0];
  }

  function norm(s) {
    var a = String(s).toLowerCase();
    var de = "áàäâãéèëêíìïîóòöôõúùüûñç";
    var a2 = "aaaaaeeeeiiiiooooouuuunc";
    var r = '';
    for (var i = 0; i < a.length; i++) {
      var j = de.indexOf(a.charAt(i));
      r += j >= 0 ? a2.charAt(j) : a.charAt(i);
    }
    return r;
  }  function fam(slug) {
    for (var i = 0; i < FAMILIAS.length; i++) if (FAMILIAS[i].s === slug) return FAMILIAS[i];
    return null;
  }

  function prod(id) {
    for (var i = 0; i < PRODUCTOS.length; i++) if (PRODUCTOS[i].id === id) return PRODUCTOS[i];
    return null;
  }

  function ico(d, cls) {
    return '<svg viewBox="0 0 24 24" class="' + (cls || '') + '" aria-hidden="true"><path d="' + d + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- cesta ---------- */

  var cesta = [];
  try { cesta = JSON.parse(localStorage.getItem('cem_cesta') || '[]'); } catch (x) { cesta = []; }

  function guardarCesta() {
    try { localStorage.setItem('cem_cesta', JSON.stringify(cesta)); } catch (x) {}
    pintarContador();
  }

  function unidades() {
    return cesta.reduce(function (a, l) { return a + l.q; }, 0);
  }

  function pintarContador() {
    var n = unidades();
    ['contador-cesta', 'contador-cesta-movil'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.textContent = n > 99 ? '99+' : n; el.setAttribute('data-n', n); }
    });
  }

  function addCesta(id, q) {
    var p = prod(id);
    if (!p) return;
    q = q || 1;
    var l = null;
    for (var i = 0; i < cesta.length; i++) if (cesta[i].id === id) l = cesta[i];
    if (l) l.q += q; else cesta.push({ id: id, q: q });
    guardarCesta();
    tostada(p.n + ' añadido a la cesta');
  }

  var tst;
  function tostada(txt) {
    var el = document.getElementById('tostada');
    document.getElementById('tostada-txt').textContent = txt;
    el.classList.add('visible');
    clearTimeout(tst);
    tst = setTimeout(function () { el.classList.remove('visible'); }, 2600);
  }

  /* ---------- componentes ---------- */

  function tarjetaProducto(p, etiqueta) {
    return '<div class="producto">' +
      (etiqueta ? '<span class="etiqueta-prod ' + (etiqueta === 'Novedad' ? 'nueva' : '') + '">' + e(etiqueta) + '</span>' : '') +
      '<a href="#/producto/' + p.id + '" class="producto-img">' +
      '<img src="' + IMG + e(p.img) + '" alt="' + e(p.n) + '" loading="lazy" width="220" height="220">' +
      '</a>' +
      '<div class="producto-cuerpo">' +
      '<span class="producto-cat">' + e(p.c) + '</span>' +
      '<a href="#/producto/' + p.id + '" class="producto-nom" style="color:inherit">' + e(p.n) + '</a>' +
      '<div class="producto-pie">' +
      (p.p
        ? '<span class="producto-precio">' + eur(p.p) + '<small>IVA no incl.</small></span>'
        : '<span class="producto-consultar">Consultar precio</span>') +
      '<button class="btn-add" data-add="' + p.id + '" aria-label="Añadir ' + e(p.n) + ' a la cesta">' +
      ico('M12 5v14M5 12h14') + '</button>' +
      '</div></div></div>';
  }

  function rejilla(lista, etiqueta) {
    if (!lista.length) return '';
    return '<div class="productos">' + lista.map(function (p) { return tarjetaProducto(p, etiqueta); }).join('') + '</div>';
  }

  function migas(items) {
    var h = '<nav class="migas" aria-label="Ruta de navegación"><a href="#/">Inicio</a>';
    items.forEach(function (it, i) {
      h += '<span class="sep" aria-hidden="true">/</span>';
      h += i === items.length - 1
        ? '<span aria-current="page">' + e(it.t) + '</span>'
        : '<a href="' + it.u + '">' + e(it.t) + '</a>';
    });
    return h + '</nav>';
  }

  function cabPagina(titulo, texto, ruta) {
    return '<div class="cab-pagina"><div class="contenedor">' +
      migas(ruta || [{ t: titulo }]) +
      '<h1>' + e(titulo) + '</h1>' +
      (texto ? '<p>' + texto + '</p>' : '') +
      '</div></div>';
  }

  function bloqueMarcas() {
    return '<section class="seccion seccion-alt"><div class="contenedor">' +
      '<div style="text-align:center;margin-bottom:18px">' +
      '<span class="titulo-linea" style="justify-content:center">Marcas que distribuimos</span>' +
      '<p style="color:var(--gris);margin:0;font-size:.9375rem">Distribuimos marcas con recambio y servicio postventa en España.</p>' +
      '</div><div class="marcas">' +
      MARCAS.map(function (m) { return '<span class="marca">' + e(m) + '</span>'; }).join('') +
      '</div></div></section>';
  }

  function fichaContacto(icono, titulo, cuerpo) {
    return '<div class="ficha-contacto">' + ico(icono) +
      '<div><strong>' + e(titulo) + '</strong>' + cuerpo + '</div></div>';
  }

  /* ---------- vistas ---------- */

  function vistaInicio() {
    var conPrecio = PRODUCTOS.filter(function (p) { return p.p; });
    var baratos = conPrecio.slice().sort(function (a, b) { return a.p - b.p; }).filter(function (p) { return p.p > 1; }).slice(0, 8);
    var destacados = PRODUCTOS.filter(function (p) { return p.f === 'cristaleria' || p.f === 'vajilla'; }).slice(0, 8);

    return '' +
      '<section class="portada"><div class="contenedor">' +
      '<span class="portada-marca">' + ico('M12 2l2.4 6.9H22l-6 4.4 2.3 6.9-6.3-4.5-6.3 4.5L7.9 13 2 8.9h7.6z') + ' Más de 30 años equipando hostelería</span>' +
      '<h1>Todo para tu bar, restaurante u <em>hotel</em></h1>' +
      '<p>Maquinaria, mobiliario, menaje, vajilla y todo el material del día a día. Un solo proveedor para no ir persiguiendo a cinco.</p>' +
      '<div class="portada-botones">' +
      '<a href="#/catalogo" class="btn btn-primario">Ver el catálogo</a>' +
      '<a href="#/contacto" class="btn btn-blanco">Pedir presupuesto</a>' +
      '</div>' +
      '<div class="portada-datos">' +
      '<div class="portada-dato"><strong>+30</strong><span>años en el sector</span></div>' +
      '<div class="portada-dato"><strong>+5.000</strong><span>referencias en almacén</span></div>' +
      '<div class="portada-dato"><strong>' + FAMILIAS.length + '</strong><span>familias de producto</span></div>' +
      '</div>' +
      '</div></section>' +

      '<section class="ventajas"><div class="contenedor"><div class="ventajas-grid">' +
      '<div class="ventaja">' + ico('M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z') +
      '<div><strong>Envíos a toda España</strong><span>Normalmente en 24-48 h si está en almacén</span></div></div>' +
      '<div class="ventaja">' + ico('M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z M9.5 12l1.8 1.8L15 10') +
      '<div><strong>Servicio técnico propio</strong><span>Frío industrial y reparaciones en Barcelona</span></div></div>' +
      '<div class="ventaja">' + ico('M4 20h16M7 20V9l5-6 5 6v11M10 14h4') +
      '<div><strong>Tienda física</strong><span>Exposición en C/ Independencia, 349</span></div></div>' +
      '<div class="ventaja">' + ico('M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z') +
      '<div><strong>Atención directa</strong><span>Hablas con quien conoce el producto</span></div></div>' +
      '</div></div></section>' +

      '<section class="seccion"><div class="contenedor">' +
      '<div class="seccion-cab"><div>' +
      '<span class="titulo-linea">Nuestros Productos</span>' +
      '<h2>Todas las familias del catálogo</h2>' +
      '<p>Desde una caja de servilletas hasta el armario refrigerado de la cocina.</p>' +
      '</div><a href="#/catalogo">Ver el catálogo completo →</a></div>' +
      '<div class="familias">' +
      FAMILIAS.map(function (f) {
        return '<a href="#/familia/' + f.s + '" class="familia">' +
          '<span class="familia-ico">' + ico(f.i) + '</span>' +
          '<strong>' + e(f.n) + '</strong>' +
          '<span>' + (f.count
            ? f.count + (f.count === 1 ? ' artículo' : ' artículos')
            : 'Bajo pedido') + '</span>' +
          '</a>';
      }).join('') +
      '</div></div></section>' +

      '<section class="seccion seccion-alt"><div class="contenedor">' +
      '<div class="seccion-cab"><div>' +
      '<span class="titulo-linea">Novedades</span>' +
      '<h2>Lo último que ha entrado</h2>' +
      '</div><a href="#/catalogo">Ver todo →</a></div>' +
      '<div class="carrusel">' +
      NOVEDADES.map(function (n) {
        return '<div class="producto">' +
          '<span class="etiqueta-prod nueva">Novedad</span>' +
          '<div class="producto-img"><img src="img/' + e(n.img) + '" alt="' + e(n.n) + '" loading="lazy" width="220" height="220"></div>' +
          '<div class="producto-cuerpo">' +
          '<span class="producto-cat">' + e(n.c) + '</span>' +
          '<span class="producto-nom">' + e(n.n) + '</span>' +
          '<div class="producto-pie"><span class="producto-consultar">Consultar precio</span>' +
          '<a href="#/contacto" class="btn-add" aria-label="Consultar por ' + e(n.n) + '">' + ico('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z') + '</a>' +
          '</div></div></div>';
      }).join('') +
      '</div></div></section>' +

      '<section class="seccion"><div class="contenedor">' +
      '<div class="seccion-cab"><div>' +
      '<span class="titulo-linea">Con precio publicado</span>' +
      '<h2>Reposición del día a día</h2>' +
      '<p>Artículos que puedes pedir directamente, sin esperar presupuesto.</p>' +
      '</div><a href="#/ofertas">Ver todos →</a></div>' +
      rejilla(baratos) +
      '</div></section>' +

      '<section class="seccion seccion-alt"><div class="contenedor">' +
      '<div class="destacado">' +
      '<div class="destacado-img"><img src="img/images_local_inicio.jpg" alt="Exposición de Comercial El Maño en Barcelona" loading="lazy"></div>' +
      '<div class="destacado-txt">' +
      '<span class="titulo-linea">Reformas y proyectos</span>' +
      '<h3>Montamos tu local llave en mano</h3>' +
      '<p>En 2007 creamos Suministros de Hostelería Moncat para las reformas de hoteles, restaurantes, bares y residencias. Diseño, presupuesto cerrado, obra y fecha de entrega pactada.</p>' +
      '<a href="#/reformas" class="btn btn-verde">Cómo trabajamos</a>' +
      '</div></div>' +
      '</div></section>' +

      '<section class="seccion"><div class="contenedor">' +
      '<div class="seccion-cab"><div>' +
      '<span class="titulo-linea">Mesa y sala</span>' +
      '<h2>Vajilla y cristalería</h2>' +
      '<p>Lo que ve el cliente cuando le sirves.</p>' +
      '</div><a href="#/familia/vajilla">Ver vajilla →</a></div>' +
      rejilla(destacados) +
      '</div></section>' +

      '<section class="seccion seccion-alt"><div class="contenedor">' +
      '<span class="titulo-linea">Qué hacemos</span>' +
      '<h2 style="margin-bottom:20px">Tres servicios, un solo interlocutor</h2>' +
      '<div class="servicios">' +
      '<a href="#/catalogo" class="servicio"><span class="servicio-ico">' + ico('M3 4h7v7H3zM14 4h7v7h-7zM3 13h7v7H3zM14 13h7v7h-7z') + '</span>' +
      '<div><h3>Venta de material</h3><p>Más de 5.000 referencias de menaje, vajilla, cristalería, cubertería, maquinaria y productos de un solo uso.</p><span class="servicio-mas">Ver catálogo →</span></div></a>' +
      '<a href="#/reformas" class="servicio"><span class="servicio-ico">' + ico('M14 6l4 4-9 9H5v-4zM17 3l4 4') + '</span>' +
      '<div><h3>Reformas y proyectos</h3><p>Equipamos el local completo con presupuesto cerrado y una fecha de entrega que se cumple.</p><span class="servicio-mas">Cómo trabajamos →</span></div></a>' +
      '<a href="#/servicio-tecnico" class="servicio"><span class="servicio-ico">' + ico('M14.7 6.3a4 4 0 0 1-5.4 5.4l-6 6a2 2 0 1 0 3 3l6-6a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.4-.4-2.1z') + '</span>' +
      '<div><h3>Servicio técnico</h3><p>Frío industrial, climatización, lavavajillas, cortadoras y tostadores en Barcelona y área metropolitana.</p><span class="servicio-mas">Pedir una visita →</span></div></a>' +
      '</div></div></section>' +

      bloqueMarcas() +

      '<section class="seccion"><div class="contenedor">' +
      '<div class="texto">' +
      '<h2>Qué son los suministros de hostelería</h2>' +
      '<p>Suministros de hostelería es todo el material que necesita un negocio para dar de comer y beber: desde la maquinaria de la cocina hasta la servilleta que pones en la mesa. En una cocina profesional conviven equipos que duran quince años con productos que se reponen cada semana, y ambos tienen que estar cuando toca.</p>' +
      '<h3>Qué productos incluye</h3>' +
      '<p>En nuestro catálogo tienes menaje de cocina industrial, vajilla, cristalería, cubertería, cuchillería, mobiliario de interior y de terraza, maquinaria de frío y de calor, detergentes, papel y productos de un solo uso para llevar. Buscamos y localizamos también los artículos que no aparecen en la web, así que si no encuentras algo, pregúntanos.</p>' +
      '<h3>Para qué sirven</h3>' +
      '<p>Para que el servicio salga adelante. Un plato que no se astilla al tercer pase, una copa que aguanta el lavavajillas y una plancha que calienta de forma uniforme se notan en cada turno. Por eso hacemos una selección estricta del producto y trabajamos con marcas que tienen recambio cuando algo falla.</p>' +
      '</div></div></section>';
  }

  function vistaCatalogo() {
    return cabPagina('Nuestros Productos',
      'Todo el catálogo organizado como está en el almacén. ' + PRODUCTOS.length + ' artículos publicados en ' + FAMILIAS.length + ' familias.',
      [{ t: 'Nuestros Productos' }]) +
      '<div class="contenedor"><div class="seccion">' +
      FAMILIAS.map(function (f) {
        return '<div style="margin-bottom:34px">' +
          '<div class="seccion-cab" style="margin-bottom:14px"><div>' +
          '<h2 style="display:flex;align-items:center;gap:10px;font-size:1.25rem">' +
          '<span class="familia-ico" style="width:34px;height:34px">' + ico(f.i) + '</span>' + e(f.n) + '</h2>' +
          '</div><a href="#/familia/' + f.s + '">' + (f.count === 1 ? 'Ver el artículo' : f.count ? 'Ver los ' + f.count + ' artículos' : 'Pedir precio') + ' →</a></div>' +
          '<div class="chips" style="display:flex;flex-wrap:wrap;overflow:visible">' +
          f.subs.map(function (s) {
            return '<a href="#/familia/' + f.s + '?sub=' + encodeURIComponent(s) + '" class="chip">' + e(s) + '</a>';
          }).join('') +
          '</div></div>';
      }).join('') +
      '</div></div>';
  }

  function vistaFamilia(slug, params) {
    var f = fam(slug);
    if (!f) return vista404();

    var sub = params.get('sub') || '';
    var orden = params.get('orden') || '';
    var lista = PRODUCTOS.filter(function (p) { return p.f === slug; });
    if (sub) lista = lista.filter(function (p) { return norm(p.c) === norm(sub); });

    if (orden === 'precio-asc') lista.sort(function (a, b) { return (a.p || 1e9) - (b.p || 1e9); });
    else if (orden === 'precio-desc') lista.sort(function (a, b) { return (b.p || -1) - (a.p || -1); });
    else if (orden === 'nombre') lista.sort(function (a, b) { return a.n.localeCompare(b.n, 'es'); });

    var conteo = {};
    PRODUCTOS.forEach(function (p) { if (p.f === slug) conteo[norm(p.c)] = (conteo[norm(p.c)] || 0) + 1; });

    var lateral = '<aside class="lateral"><div class="lateral-caja">' +
      '<h3>' + e(f.n) + '</h3><ul>' +
      '<li><a href="#/familia/' + f.s + '" class="' + (sub ? '' : 'activo') + '">Todas<em>' + f.count + '</em></a></li>' +
      f.subs.map(function (s) {
        var n = conteo[norm(s)] || 0;
        return '<li><a href="#/familia/' + f.s + '?sub=' + encodeURIComponent(s) + '" class="' + (norm(sub) === norm(s) ? 'activo' : '') + '">' +
          e(s) + '<em>' + n + '</em></a></li>';
      }).join('') +
      '</ul></div>' +
      '<div class="lateral-caja"><h3>Otras familias</h3><ul>' +
      FAMILIAS.filter(function (x) { return x.s !== slug; }).map(function (x) {
        return '<li><a href="#/familia/' + x.s + '">' + e(x.n) + '<em>' + x.count + '</em></a></li>';
      }).join('') +
      '</ul></div>' +
      '<div class="lateral-caja" style="background:var(--verde-claro);border-color:var(--verde-borde)">' +
      '<h3 style="color:var(--verde-osc)">¿No lo encuentras?</h3>' +
      '<p style="font-size:.875rem;color:var(--verde-osc);margin:0 0 12px">Localizamos el artículo que necesites aunque no esté publicado.</p>' +
      '<a href="#/contacto" class="btn btn-verde btn-bloque btn-peq">Preguntar</a>' +
      '</div></aside>';

    var contenido = lista.length
      ? rejilla(lista)
      : '<div class="vacio">' + ico('M21 21l-4.5-4.5M3 10.5a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0') +
        '<h3>Esta gama la trabajamos bajo pedido</h3>' +
        '<p>Son equipos que se eligen por proyecto y por cocina, así que preferimos pasarte precio ajustado a lo que necesitas en vez de publicar una lista. Dinos qué buscas y te contestamos el mismo día.</p>' +
        '<a href="#/contacto" class="btn btn-verde">Preguntar por ' + e(sub || f.n) + '</a></div>';

    return cabPagina(sub || f.n, sub
      ? 'Dentro de ' + e(f.n) + '.'
      : f.subs.length + ' subcategorías dentro de esta familia.',
      sub
        ? [{ t: 'Nuestros Productos', u: '#/catalogo' }, { t: f.n, u: '#/familia/' + f.s }, { t: sub }]
        : [{ t: 'Nuestros Productos', u: '#/catalogo' }, { t: f.n }]) +

      '<div class="contenedor"><div class="layout">' + lateral +
      '<div>' +
      '<div class="chips">' +
      '<a href="#/familia/' + f.s + '" class="chip ' + (sub ? '' : 'activo') + '">Todas</a>' +
      f.subs.map(function (s) {
        return '<a href="#/familia/' + f.s + '?sub=' + encodeURIComponent(s) + '" class="chip ' + (norm(sub) === norm(s) ? 'activo' : '') + '">' + e(s) + '</a>';
      }).join('') +
      '</div>' +
      '<div class="barra-filtros">' +
      '<span class="resultado"><b>' + lista.length + '</b> ' + (lista.length === 1 ? 'artículo' : 'artículos') + '</span>' +
      '<label class="oculto-visual" for="orden">Ordenar por</label>' +
      '<select class="selector" id="orden" data-fam="' + f.s + '" data-sub="' + e(sub) + '">' +
      '<option value="">Orden del catálogo</option>' +
      '<option value="nombre"' + (orden === 'nombre' ? ' selected' : '') + '>Nombre A-Z</option>' +
      '<option value="precio-asc"' + (orden === 'precio-asc' ? ' selected' : '') + '>Precio: de menor a mayor</option>' +
      '<option value="precio-desc"' + (orden === 'precio-desc' ? ' selected' : '') + '>Precio: de mayor a menor</option>' +
      '</select></div>' +
      contenido +
      '</div></div></div>';
  }

  function vistaProducto(id) {
    var p = prod(Number(id));
    if (!p) return vista404();
    var f = fam(p.f);
    var relacionados = PRODUCTOS.filter(function (x) { return x.c === p.c && x.id !== p.id; }).slice(0, 4);
    if (relacionados.length < 4) {
      PRODUCTOS.filter(function (x) { return x.f === p.f && x.id !== p.id && x.c !== p.c; })
        .slice(0, 4 - relacionados.length).forEach(function (x) { relacionados.push(x); });
    }

    return '<div class="contenedor">' +
      migas([{ t: 'Nuestros Productos', u: '#/catalogo' }, { t: f.n, u: '#/familia/' + f.s },
        { t: p.c, u: '#/familia/' + f.s + '?sub=' + encodeURIComponent(p.c) }, { t: p.n }]) +

      '<div class="ficha">' +
      '<div class="ficha-galeria"><img src="' + IMG + e(p.img) + '" alt="' + e(p.n) + '" width="460" height="460"></div>' +
      '<div class="ficha-info">' +
      '<span class="ficha-ref">Ref. ' + p.id + ' · <a href="#/familia/' + f.s + '?sub=' + encodeURIComponent(p.c) + '">' + e(p.c) + '</a></span>' +
      '<h1>' + e(p.n) + '</h1>' +

      (p.p
        ? '<div class="ficha-precio"><span class="valor">' + eur(p.p) + '</span><span class="iva">IVA no incluido</span></div>'
        : '<div class="ficha-precio"><span class="valor" style="font-size:1.25rem">Precio bajo consulta</span></div>') +

      '<div class="ficha-cantidad">' +
      '<span style="font-size:.875rem;font-weight:700">Cantidad</span>' +
      '<div class="contador-cant">' +
      '<button type="button" data-cant="-1" aria-label="Quitar una unidad">−</button>' +
      '<input type="number" id="cant" value="1" min="1" max="999" aria-label="Cantidad">' +
      '<button type="button" data-cant="1" aria-label="Añadir una unidad">+</button>' +
      '</div></div>' +

      '<div class="ficha-acciones">' +
      '<button class="btn btn-primario btn-bloque" data-add-ficha="' + p.id + '">' +
      ico('M6 6h15l-1.6 9.3a2 2 0 0 1-2 1.7H9.4a2 2 0 0 1-2-1.6L5.2 3.6A1 1 0 0 0 4.2 3H2') + ' Añadir a la cesta</button>' +
      '<a href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, me interesa: ' + p.n + ' (ref. ' + p.id + ')') + '" class="btn btn-verde" target="_blank" rel="noopener">' +
      ico('M20.5 3.5A10 10 0 0 0 3.6 15.3L2.5 21.5l6.4-1.1A10 10 0 1 0 20.5 3.5zM8.4 7.6c.2 0 .4 0 .6.4l.9 2c.1.2 0 .4-.1.5l-.6.7c-.1.2-.2.4 0 .6a8 8 0 0 0 3.6 3.1c.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l2 1c.2.1.3.3.3.5 0 1-1 1.9-2 2-2.6 0-7.4-4.5-7.5-7.4 0-1 .8-2 1.8-2.1z') + ' Consultar</a>' +
      '<a href="tel:' + TEL + '" class="btn btn-linea">' + ico('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z') + ' Llamar</a>' +
      '</div>' +

      '<div class="ficha-aviso">' + ico('M12 8v5M12 16.5v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z') +
      '<span>Los precios que ves son de tarifa general y van dirigidos a profesionales del sector. Si compras con nosotros de forma habitual, llámanos y ajustamos el precio.</span></div>' +

      '<div class="ficha-datos"><dl>' +
      '<dt>Referencia</dt><dd>' + p.id + '</dd>' +
      '<dt>Familia</dt><dd>' + e(f.n) + '</dd>' +
      '<dt>Subcategoría</dt><dd>' + e(p.c) + '</dd>' +
      '<dt>Disponibilidad</dt><dd style="color:var(--verde)">Consultar en almacén</dd>' +
      '<dt>Envío</dt><dd>Normalmente 24-48 h</dd>' +
      '</dl></div>' +

      '</div></div>' +

      (relacionados.length
        ? '<section class="seccion"><h2 style="font-size:1.25rem">También te puede interesar</h2>' + rejilla(relacionados) + '</section>'
        : '') +
      '</div>';
  }

  function vistaBuscar(params) {
    var q = params.get('q') || '';
    var nq = norm(q).trim();
    var lista = nq
      ? PRODUCTOS.filter(function (p) { return norm(p.n).indexOf(nq) >= 0 || norm(p.c).indexOf(nq) >= 0; })
      : [];

    return cabPagina('Resultados de la búsqueda',
      q ? 'Has buscado <strong>' + e(q) + '</strong>. ' + lista.length + ' ' + (lista.length === 1 ? 'artículo encontrado' : 'artículos encontrados') + '.' : 'Escribe qué necesitas en el buscador.',
      [{ t: 'Búsqueda' }]) +
      '<div class="contenedor"><div class="seccion">' +
      (lista.length
        ? rejilla(lista)
        : '<div class="vacio">' + ico('M21 21l-4.5-4.5M3 10.5a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0') +
          '<h3>No hay resultados para «' + e(q) + '»</h3>' +
          '<p>Tenemos más de 5.000 referencias y no todas están publicadas. Dinos qué buscas por teléfono o WhatsApp y te decimos si lo tenemos.</p>' +
          '<a href="#/contacto" class="btn btn-verde">Preguntar por este artículo</a></div>') +
      '</div></div>';
  }

  function vistaOfertas() {
    var lista = PRODUCTOS.filter(function (p) { return p.p; }).sort(function (a, b) { return a.p - b.p; });
    return cabPagina('Artículos con precio',
      'Estos son los artículos que tienen el precio publicado y puedes pedir directamente. Del resto del catálogo te pasamos precio en el día.',
      [{ t: 'Ofertas' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="barra-filtros"><span class="resultado"><b>' + lista.length + '</b> artículos con precio publicado</span></div>' +
      rejilla(lista) +
      '</div></div>';
  }

  function vistaQuienesSomos() {
    return cabPagina('Quiénes Somos',
      'Comercial El Maño lleva más de treinta años surtiendo a la hostelería de Barcelona.',
      [{ t: 'Quiénes Somos' }]) +
      '<div class="contenedor"><div class="layout" style="grid-template-columns:1fr">' +
      '<div class="texto">' +
      '<p>Nos dedicamos desde hace más de treinta años a la venta de productos de hostelería y material para restaurantes. Somos distribuidores de material de hostelería para toda España y tenemos la exposición y el almacén en la calle Independencia de Barcelona.</p>' +
      '<p>Disponemos de maquinaria, mobiliario y en general todo tipo de material de hostelería de marcas que garantizan un buen resultado a lo largo de su vida útil, además de un diseño apropiado para el restaurante que quieres montar.</p>' +

      '<h2>Un solo proveedor para todo el local</h2>' +
      '<p>La variedad es lo que nos define: menaje, cristalería, vajilla, cubertería, cuchillería, menaje de cocina industrial, muebles de interior y exterior, maquinaria, terrazas, detergentes, papel, limpieza, productos de un solo uso y complementos. Con eso podemos dar un servicio integral y evitarte tener cinco proveedores para lo mismo.</p>' +
      '<p>En todo momento hacemos una selección estricta del producto, buscando la mejor relación entre calidad, diseño y precio. Si algo no funciona, lo dejamos de vender.</p>' +

      '<h2>Marcas que confían en nosotros</h2>' +
      '<p>Por el trato directo y personalizado, marcas como Arcoroc, Cim, Duralex, Porvasal, Lacor, Pujadas, Porcelanas del Principado, Dalper, Proquivi, Comas &amp; Partners, SupremInox, Soabel, Valira, Trilla, Araven, Jay, Sammic, Coreco, Infrico, Repagas o Distform han depositado su confianza en nosotros.</p>' +

      '<h2>Si no lo encuentras, pregúntanos</h2>' +
      '<p>Buscamos y localizamos los artículos que necesitas para tu local. La web publica una parte del catálogo, no todo lo que movemos. Una llamada suele resolver antes que media hora buscando.</p>' +

      '<h2>La parte de obra</h2>' +
      '<p>En 2007 creamos Suministros de Hostelería Moncat, orientada a reformas y proyectos de hoteles, restaurantes, bares y residencias. Está en las mismas oficinas y trabajamos juntos, de modo que puedes encargar el equipamiento y la obra en el mismo sitio.</p>' +
      '<p><a href="#/reformas" class="btn btn-verde" style="margin-top:8px">Ver cómo trabajamos las reformas</a></p>' +
      '</div></div></div>' +
      bloqueMarcas();
  }

  function vistaReformas() {
    return cabPagina('Reformas y Proyectos',
      'Equipamos tu bar, restaurante, discoteca o residencia llave en mano, con presupuesto cerrado.',
      [{ t: 'Reformas' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="texto">' +
      '<p>En el año 2007 creamos Suministros de Hostelería Moncat, una empresa orientada a reformas y proyectos de hoteles, restaurantes, bares y residencias. La idea era sencilla: si ya te vendemos el equipamiento, también podemos montarte el local entero y que trates con un solo interlocutor.</p>' +
      '<p>Damos soluciones llave en mano y equipamos tu local con producto de diseño y calidad, del tipo que aguanta el uso diario de una cocina profesional.</p>' +

      '<h2>Cómo va el proceso</h2>' +
      '</div>' +

      '<ol class="pasos">' +
      '<li><strong>Nos cuentas la idea</strong><span>Te asesoramos sobre qué material conviene y qué sistemas son viables para lo que quieres montar y para el sitio que tienes.</span></li>' +
      '<li><strong>Te presentamos un diseño</strong><span>Preparamos una propuesta con la idea de negocio que nos transmitas, no con la plantilla del anterior.</span></li>' +
      '<li><strong>Presupuesto cerrado</strong><span>Un proyecto bien definido con precio cerrado. Sin sorpresas a mitad de obra.</span></li>' +
      '<li><strong>Ejecución supervisada</strong><span>Gestionamos las reformas y supervisamos calidades y acabados. La obra la hacen profesionales especializados en hostelería.</span></li>' +
      '<li><strong>Fecha de entrega pactada</strong><span>Acordamos un día para que puedas ocupar y operar en tus instalaciones. Y lo cumplimos.</span></li>' +
      '</ol>' +

      '<div class="texto">' +
      '<h2>Qué tipo de locales montamos</h2>' +
      '<ul>' +
      '<li>Bares y cafeterías, incluida la barra completa y la zona de office.</li>' +
      '<li>Restaurantes, con cocina de producción, cámaras y sala.</li>' +
      '<li>Hoteles: cocina, office, buffet y terraza.</li>' +
      '<li>Discotecas y locales de copas.</li>' +
      '<li>Residencias y geriátricos, con la normativa de cocina colectiva.</li>' +
      '</ul>' +
      '<p>Realizamos presupuestos sin compromiso. Si estás en fase de mirar números para saber si sale, también te ayudamos con eso.</p>' +
      '</div>' +

      '<div style="margin-top:26px" class="destacado">' +
      '<div class="destacado-img"><img src="img/images_local_inicio.jpg" alt="Exposición y almacén en Barcelona" loading="lazy"></div>' +
      '<div class="destacado-txt">' +
      '<h3>Ven a ver el material</h3>' +
      '<p>Antes de decidir, pásate por la exposición de la calle Independencia. Ver y tocar la silla, el plato o la mesa evita muchos disgustos después.</p>' +
      '<a href="#/donde-estamos" class="btn btn-verde">Cómo llegar</a>' +
      '</div></div>' +
      '</div></div>';
  }

  function vistaServicioTecnico() {
    return cabPagina('Servicio Técnico',
      'Reparamos lo que vendemos. Barcelona y área metropolitana.',
      [{ t: 'Servicio Técnico' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="texto">' +
      '<p>Tenemos servicio técnico de frío industrial y de reparación de maquinaria de hostelería. Cuando una cámara deja de dar frío un viernes por la tarde, el problema no es la avería: es el género que tienes dentro. Por eso intentamos dar salida rápida a las urgencias.</p>' +
      '<h2>Qué reparamos</h2>' +
      '<ul>' +
      '<li>Frío industrial: neveras, armarios refrigerados, arcones, mesas frías y cámaras.</li>' +
      '<li>Aire acondicionado y climatización del local.</li>' +
      '<li>Lavavajillas y lavavasos industriales.</li>' +
      '<li>Cortadoras, tostadores y pequeña maquinaria de elaboración.</li>' +
      '<li>Maquinaria de calor: planchas, freidoras y baños maría.</li>' +
      '</ul>' +
      '<p>Realizamos presupuestos sin compromiso. Si la reparación no sale a cuenta, te lo decimos y valoramos la sustitución con lo que tenemos en almacén.</p>' +
      '<h2>Zona de actuación</h2>' +
      '<p>Barcelona y área metropolitana. Para fuera de esa zona, consúltanos según el equipo y la marca.</p>' +
      '</div>' +

      '<div class="fichas-contacto" style="margin-top:26px">' +
      fichaContacto('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
        'Avisos por teléfono', '<a href="tel:' + TEL + '">' + TEL_TXT + '</a><small>De lunes a viernes en horario de tienda</small>') +
      fichaContacto('M20.5 3.5A10 10 0 0 0 3.6 15.3L2.5 21.5l6.4-1.1A10 10 0 1 0 20.5 3.5z',
        'WhatsApp', '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">611 888 558</a><small>Mándanos la foto de la placa del equipo</small>') +
      '</div>' +
      '<p style="margin-top:20px"><a href="#/contacto" class="btn btn-primario">Solicitar una visita técnica</a></p>' +
      '</div></div>';
  }

  function vistaDondeEstamos() {
    return cabPagina('Donde Estamos',
      'Oficinas, exposición y ventas en la calle Independencia, 349 de Barcelona.',
      [{ t: 'Donde Estamos' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="layout" style="grid-template-columns:1fr;gap:24px;padding:0">' +

      '<div class="mapa">' +
      '<iframe title="Mapa de situación de Suministros CEM" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
      'src="https://www.openstreetmap.org/export/embed.html?bbox=2.1744%2C41.4077%2C2.1844%2C41.4137&amp;layer=mapnik&amp;marker=41.4107%2C2.1794"></iframe>' +
      '</div>' +

      '<div>' +
      '<div class="fichas-contacto">' +
      fichaContacto('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        'Dirección', '<p>C/ Independencia, 349<br>08026 Barcelona</p><small>Oficinas, exposición y ventas</small>') +
      fichaContacto('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
        'Teléfono', '<a href="tel:' + TEL + '">' + TEL_TXT + '</a><small>El fax es el mismo número</small>') +
      fichaContacto('M2.5 4.5h19v15h-19zM3 7l9 6 9-6',
        'Correo', '<a href="mailto:' + MAIL + '">' + MAIL + '</a>') +
      fichaContacto('M20.5 3.5A10 10 0 0 0 3.6 15.3L2.5 21.5l6.4-1.1A10 10 0 1 0 20.5 3.5z',
        'WhatsApp', '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">611 888 558</a>') +
      '</div>' +

      '<div class="lateral-caja" style="margin-top:20px">' +
      '<h3>Horario de la tienda</h3>' +
      '<ul class="horario">' +
      '<li><span>Lunes a jueves</span><span>8:00 - 13:30<br>15:00 - 19:30</span></li>' +
      '<li><span>Viernes</span><span>8:00 - 15:00</span></li>' +
      '<li class="cerrado"><span>Sábado y domingo</span><span>Cerrado</span></li>' +
      '</ul>' +
      '</div>' +

      '<div class="lateral-caja">' +
      '<h3>Cómo llegar</h3>' +
      '<ul class="horario">' +
      '<li><span>Metro</span><span>L5 · Hospital de Sant Pau<br>L5 · Dos de Maig</span></li>' +
      '<li><span>Autobús</span><span>Línea 92</span></li>' +
      '</ul>' +
      '</div>' +

      '<p style="margin-top:18px"><a href="https://www.google.com/maps/search/?api=1&query=Carrer+de+la+Independ%C3%A8ncia+349+Barcelona" target="_blank" rel="noopener" class="btn btn-verde btn-bloque">Abrir en Google Maps</a></p>' +
      '</div>' +

      '</div></div></div>';
  }

  function vistaContacto() {
    return cabPagina('Contacto',
      'Dinos qué necesitas y te respondemos con precio y disponibilidad.',
      [{ t: 'Contacto' }]) +
      '<div class="contenedor"><div class="layout" style="grid-template-columns:1fr">' +
      '<div style="display:grid;gap:28px" class="contacto-grid">' +

      '<div>' +
      '<h2 style="font-size:1.25rem">Escríbenos</h2>' +
      '<div class="aviso-form" id="aviso-form">Te hemos abierto el correo con los datos ya rellenados. Dale a enviar y te contestamos en horario de tienda, normalmente el mismo día.</div>' +
      '<form class="formulario" id="form-contacto" novalidate>' +
      '<div class="campo-fila">' +
      '<div class="campo"><label for="c-nombre">Nombre y apellidos <span>*</span></label><input type="text" id="c-nombre" required></div>' +
      '<div class="campo"><label for="c-negocio">Nombre del negocio</label><input type="text" id="c-negocio"></div>' +
      '</div>' +
      '<div class="campo-fila">' +
      '<div class="campo"><label for="c-email">Correo <span>*</span></label><input type="email" id="c-email" required></div>' +
      '<div class="campo"><label for="c-tel">Teléfono</label><input type="tel" id="c-tel"></div>' +
      '</div>' +
      '<div class="campo"><label for="c-asunto">Motivo</label>' +
      '<select id="c-asunto">' +
      '<option>Presupuesto de material</option>' +
      '<option>Reforma o proyecto de local</option>' +
      '<option>Avería o servicio técnico</option>' +
      '<option>Alta como cliente</option>' +
      '<option>Otra consulta</option>' +
      '</select></div>' +
      '<div class="campo"><label for="c-msg">Cuéntanos <span>*</span></label>' +
      '<textarea id="c-msg" required placeholder="Por ejemplo: monto una cafetería de 40 plazas y necesito presupuesto de barra, vajilla y cristalería."></textarea></div>' +
      '<label class="campo-check"><input type="checkbox" id="c-lopd" required>' +
      '<span>He leído y acepto la <a href="#/politica-de-privacidad">política de privacidad</a>.</span></label>' +
      '<button type="submit" class="btn btn-primario">Enviar el mensaje</button>' +
      '</form>' +
      '</div>' +

      '<div>' +
      '<h2 style="font-size:1.25rem">O directamente</h2>' +
      '<div class="fichas-contacto" style="grid-template-columns:1fr">' +
      fichaContacto('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
        'Teléfono', '<a href="tel:' + TEL + '">' + TEL_TXT + '</a><small>Lunes a jueves de 8:00 a 13:30 y de 15:00 a 19:30. Viernes de 8:00 a 15:00.</small>') +
      fichaContacto('M20.5 3.5A10 10 0 0 0 3.6 15.3L2.5 21.5l6.4-1.1A10 10 0 1 0 20.5 3.5z',
        'WhatsApp', '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">611 888 558</a><small>Manda la foto de lo que buscas y te decimos si lo tenemos.</small>') +
      fichaContacto('M2.5 4.5h19v15h-19zM3 7l9 6 9-6',
        'Pedidos', '<a href="mailto:' + MAIL + '">' + MAIL + '</a>') +
      fichaContacto('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        'Tienda', '<p>C/ Independencia, 349 · 08026 Barcelona</p><small>Metro L5 Hospital de Sant Pau o Dos de Maig · Bus 92</small>') +
      '</div>' +
      '</div>' +

      '</div></div></div>';
  }

  function vistaRegistrese() {
    return cabPagina('Regístrese',
      'El alta como cliente es para profesionales del sector. Con ella ves tu tarifa y el descuento por volumen.',
      [{ t: 'Regístrese' }]) +
      '<div class="contenedor"><div class="layout" style="grid-template-columns:1fr">' +
      '<div class="contacto-grid" style="display:grid;gap:28px">' +

      '<div>' +
      '<h2 style="font-size:1.25rem">Alta de cliente</h2>' +
      '<div class="aviso-form" id="aviso-form">Te hemos abierto el correo con los datos del alta. Dale a enviar y te confirmamos en un día laborable.</div>' +
      '<form class="formulario" id="form-contacto" novalidate>' +
      '<div class="campo-fila">' +
      '<div class="campo"><label for="r-razon">Razón social <span>*</span></label><input type="text" id="r-razon" required></div>' +
      '<div class="campo"><label for="r-nif">NIF / CIF <span>*</span></label><input type="text" id="r-nif" required></div>' +
      '</div>' +
      '<div class="campo"><label for="r-nombre">Persona de contacto <span>*</span></label><input type="text" id="r-nombre" required></div>' +
      '<div class="campo-fila">' +
      '<div class="campo"><label for="r-email">Correo <span>*</span></label><input type="email" id="r-email" required></div>' +
      '<div class="campo"><label for="r-tel">Teléfono <span>*</span></label><input type="tel" id="r-tel" required></div>' +
      '</div>' +
      '<div class="campo"><label for="r-dir">Dirección de entrega</label><input type="text" id="r-dir"></div>' +
      '<div class="campo"><label for="r-tipo">Tipo de negocio</label>' +
      '<select id="r-tipo"><option>Bar o cafetería</option><option>Restaurante</option><option>Hotel</option>' +
      '<option>Residencia o colectividad</option><option>Catering</option><option>Otro</option></select></div>' +
      '<label class="campo-check"><input type="checkbox" required>' +
      '<span>He leído y acepto la <a href="#/politica-de-privacidad">política de privacidad</a> y las <a href="#/condiciones-de-compra">condiciones de compra</a>.</span></label>' +
      '<button type="submit" class="btn btn-primario">Solicitar el alta</button>' +
      '</form>' +
      '</div>' +

      '<div>' +
      '<h2 style="font-size:1.25rem">Ya soy cliente</h2>' +
      '<div class="lateral-caja">' +
      '<p style="margin:0 0 12px;font-size:.9375rem;color:var(--gris)">Si ya trabajas con nosotros y quieres hacer el pedido, llámanos o mándanos la lista. Te atendemos igual de rápido.</p>' +
      '<a href="tel:' + TEL + '" class="btn btn-verde btn-bloque">Llamar al ' + TEL_TXT + '</a>' +
      '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener" class="btn btn-linea btn-bloque" style="margin-top:8px">Pedir por WhatsApp</a>' +
      '</div>' +

      '<div class="lateral-caja" style="margin-top:24px;background:var(--verde-claro);border-color:var(--verde-borde)">' +
      '<h3 style="color:var(--verde-osc)">Qué ganas al registrarte</h3>' +
      '<ul style="margin:0;padding-left:1.1em;font-size:.875rem;color:var(--verde-osc);line-height:1.7">' +
      '<li>Te damos de alta como cliente y hablas siempre con la misma persona.</li>' +
      '<li>Te preparamos presupuesto de lo que necesites, esté o no publicado.</li>' +
      '<li>Guardamos tus datos de entrega para los siguientes pedidos.</li>' +
      '</ul></div>' +
      '</div>' +

      '</div></div></div>';
  }

  function vistaCatalogos() {
    var cats = [
      { t: 'Catálogo general de hostelería', d: 'Menaje, vajilla, cristalería, cubertería y complementos de mesa.' },
      { t: 'Maquinaria de cocina', d: 'Frío, calor, elaboración y lavado industrial con fichas técnicas.' },
      { t: 'Mobiliario de interior y terraza', d: 'Sillas, mesas, taburetes, parasoles y estufas.' },
      { t: 'Un solo uso y take away', d: 'Envases, bolsas, papel, servilletas y tarrinas.' }
    ];
    return cabPagina('Catálogos',
      'Dinos cuál te interesa y te lo hacemos llegar, en PDF o en papel.',
      [{ t: 'Catálogos' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="servicios">' +
      cats.map(function (c) {
        return '<a href="#/contacto" class="servicio">' +
          '<span class="servicio-ico">' + ico('M6 3h9l3 3v15H6zM15 3v3h3M9 12h6M9 16h6') + '</span>' +
          '<div><h3>' + e(c.t) + '</h3><p>' + e(c.d) + '</p>' +
          '<span class="servicio-mas">Pedir este catálogo →</span></div></a>';
      }).join('') +
      '</div>' +
      '<div class="texto" style="margin-top:30px">' +
      '<p>Los catálogos se actualizan cada temporada. Si buscas una referencia concreta que no aparece, escríbenos: movemos mucho más producto del que cabe en un PDF.</p>' +
      '</div>' +
      '</div></div>';
  }

  function vistaNoticias() {
    return cabPagina('Noticias',
      'Novedades de producto y lo que vamos viendo en el sector.',
      [{ t: 'Noticias' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="noticias">' +
      NOTICIAS.map(function (n) {
        return '<a href="#/contacto" class="noticia">' +
          '<img src="img/' + e(n.img) + '" alt="" loading="lazy" width="96" height="96">' +
          '<div><h3>' + e(n.t) + '</h3><p>' + e(n.d) + '</p>' +
          '<span class="servicio-mas">Preguntar por esta gama →</span></div></a>';
      }).join('') +
      '</div></div></div>';
  }

  function vistaTrabaja() {
    return cabPagina('Trabaja con Nosotros',
      'Si conoces el sector y te gusta el trato con el cliente, cuéntanoslo.',
      [{ t: 'Trabaja con Nosotros' }]) +
      '<div class="contenedor"><div class="seccion"><div class="texto">' +
      '<p>Somos un equipo corto, y eso hace que hables siempre con la misma persona y que las cosas se resuelvan sin pasar por tres departamentos. Buscamos gente que sepa de hostelería, aunque sea porque ha estado detrás de una barra.</p>' +
      '<h2>Perfiles que solemos necesitar</h2>' +
      '<ul>' +
      '<li>Comercial de calle para la zona de Barcelona.</li>' +
      '<li>Técnico de frío industrial con carné de manipulador de gases fluorados.</li>' +
      '<li>Mozo de almacén con carné de carretillero.</li>' +
      '<li>Administrativo para pedidos y atención telefónica.</li>' +
      '</ul>' +
      '<p>Manda el currículum a <a href="mailto:' + MAIL + '">' + MAIL + '</a> con el puesto en el asunto. Guardamos las candidaturas un año y llamamos cuando surge algo.</p>' +
      '<p><a href="#/contacto" class="btn btn-verde">Enviar candidatura</a></p>' +
      '</div></div></div>';
  }

  function vistaCarrito() {
    if (!cesta.length) {
      return cabPagina('Mi cesta', '', [{ t: 'Mi cesta' }]) +
        '<div class="contenedor"><div class="seccion">' +
        '<div class="vacio">' + ico('M6 6h15l-1.6 9.3a2 2 0 0 1-2 1.7H9.4a2 2 0 0 1-2-1.6L5.2 3.6A1 1 0 0 0 4.2 3H2') +
        '<h3>La cesta está vacía</h3>' +
        '<p>Añade artículos desde el catálogo y te preparamos el pedido. Si prefieres, mándanos la lista por WhatsApp y lo montamos nosotros.</p>' +
        '<a href="#/catalogo" class="btn btn-verde">Ir al catálogo</a></div>' +
        '</div></div>';
    }

    var lineas = cesta.map(function (l) {
      var p = prod(l.id);
      if (!p) return '';
      var sub = p.p ? p.p * l.q : null;
      return '<div class="carrito-linea">' +
        '<img src="' + IMG + e(p.img) + '" alt="' + e(p.n) + '" loading="lazy">' +
        '<div><a href="#/producto/' + p.id + '" class="carrito-nom" style="color:inherit">' + e(p.n) + '</a>' +
        '<div class="carrito-cat">' + e(p.c) + ' · Ref. ' + p.id + '</div>' +
        '<div class="carrito-ctrl">' +
        '<div class="contador-cant">' +
        '<button type="button" data-linea="' + p.id + '" data-d="-1" aria-label="Quitar una unidad">−</button>' +
        '<input type="number" value="' + l.q + '" min="1" data-linea-input="' + p.id + '" aria-label="Cantidad">' +
        '<button type="button" data-linea="' + p.id + '" data-d="1" aria-label="Añadir una unidad">+</button>' +
        '</div>' +
        '<button class="btn-quitar" data-quitar="' + p.id + '">Quitar</button>' +
        '</div></div>' +
        '<div class="carrito-sub">' + (sub != null ? eur(sub) : 'A consultar') + '</div>' +
        '</div>';
    }).join('');

    var total = cesta.reduce(function (a, l) {
      var p = prod(l.id);
      return a + (p && p.p ? p.p * l.q : 0);
    }, 0);
    var hayConsulta = cesta.some(function (l) { var p = prod(l.id); return p && !p.p; });
    var iva = total * 0.21;

    var texto = cesta.map(function (l) {
      var p = prod(l.id);
      return p ? l.q + ' x ' + p.n + ' (ref. ' + p.id + ')' : '';
    }).filter(Boolean).join('\n');

    return cabPagina('Mi cesta', unidades() + ' ' + (unidades() === 1 ? 'unidad' : 'unidades') + ' en la cesta.', [{ t: 'Mi cesta' }]) +
      '<div class="contenedor"><div class="seccion">' +
      '<div class="layout" style="grid-template-columns:1fr;padding:0">' +
      '<div>' + lineas + '</div>' +
      '<div class="resumen">' +
      '<div class="resumen-fila"><span>Base imponible</span><span>' + eur(total) + '</span></div>' +
      '<div class="resumen-fila"><span>IVA 21 %</span><span>' + eur(iva) + '</span></div>' +
      '<div class="resumen-fila"><span>Portes</span><span>Según destino</span></div>' +
      '<div class="resumen-fila total"><span>Total</span><span>' + eur(total + iva) + '</span></div>' +
      (hayConsulta ? '<small>Hay artículos sin precio publicado. Te confirmamos el importe al preparar el pedido.</small>' : '<small>Los portes se calculan al confirmar el pedido según destino y volumen.</small>') +
      '<a href="#/contacto" class="btn btn-primario btn-bloque">Solicitar presupuesto del pedido</a>' +
      '<a href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, quiero pedir:\n' + texto) + '" target="_blank" rel="noopener" class="btn btn-verde btn-bloque" style="margin-top:8px">Enviar la lista por WhatsApp</a>' +
      '<button class="btn btn-linea btn-bloque" id="vaciar" style="margin-top:8px">Vaciar la cesta</button>' +
      '</div>' +
      '</div></div></div>';
  }

  function paginaTexto(titulo, cuerpo) {
    return cabPagina(titulo, '', [{ t: titulo }]) +
      '<div class="contenedor"><div class="seccion"><div class="texto">' + cuerpo + '</div></div></div>';
  }

  var LEGALES = {
    'forma-de-pago': ['Forma de Pago',
      '<p>Admitimos los siguientes medios de pago:</p>' +
      '<ul>' +
      '<li><strong>Transferencia bancaria.</strong> Preparamos el pedido al confirmar la entrada del importe.</li>' +
      '<li><strong>Tarjeta de crédito o débito</strong> a través de la pasarela segura del banco. Los datos de la tarjeta no pasan por nuestros servidores.</li>' +
      '<li><strong>Contra reembolso</strong> para pedidos de la península. Consulta el recargo que aplica la agencia.</li>' +
      '<li><strong>Recibo domiciliado</strong> para clientes con cuenta abierta, en las condiciones que acordemos.</li>' +
      '</ul>' +
      '<p>El alta como cliente con pago aplazado se estudia caso por caso. Escríbenos desde la página de <a href="#/registrese">registro</a>.</p>'],
    'gastos-de-envio': ['Gastos de Envío',
      '<p>Servimos a toda España. Los portes se calculan según el destino, el peso y el volumen del pedido, y te confirmamos el importe exacto antes de que lo cierres.</p>' +
      '<h3>Península</h3>' +
      '<p>A partir de cierto importe el envío va sin coste. Pregúntanos por tu caso, porque no es lo mismo una caja de servilletas que un armario refrigerado.</p>' +
      '<h3>Baleares, Canarias, Ceuta y Melilla</h3>' +
      '<p>Consulta el coste antes de cerrar el pedido. En Canarias, Ceuta y Melilla el importe no incluye los trámites de aduana ni los impuestos locales.</p>' +
      '<h3>Recogida en tienda</h3>' +
      '<p>Puedes recoger el pedido sin coste en la calle Independencia, 349 de Barcelona en horario comercial. Te avisamos cuando esté preparado.</p>'],
    'condiciones-de-compra': ['Condiciones de Compra',
      '<p>Estas condiciones regulan la venta de productos a través de esta web. Al realizar un pedido aceptas su contenido.</p>' +
      '<h3>Precios</h3>' +
      '<p>Los precios publicados están expresados en euros y no incluyen el IVA, salvo que se indique lo contrario. Van dirigidos a profesionales del sector. Nos reservamos el derecho de modificarlos sin previo aviso, respetando siempre el precio del pedido ya confirmado.</p>' +
      '<h3>Disponibilidad</h3>' +
      '<p>La publicación de un artículo no garantiza su existencia en almacén. Si algo está agotado te avisamos y te damos plazo o alternativa antes de facturar.</p>' +
      '<h3>Pedido mínimo</h3>' +
      '<p>Para los envíos aplicamos un importe mínimo de pedido. Consúltanos y, si no llegas, siempre puedes recoger en tienda.</p>' +
      '<h3>Confirmación</h3>' +
      '<p>Recibirás la confirmación del pedido por correo con el detalle de artículos, importes y dirección de entrega. Revísalo y avísanos de cualquier error el mismo día.</p>'],
    'garantias-y-devoluciones': ['Garantías y Devoluciones',
      '<h3>Garantía</h3>' +
      '<p>Todos los productos tienen la garantía legal que corresponda según la normativa vigente, contada desde la entrega. La maquinaria cuenta además con la garantía del fabricante en las condiciones que cada marca establece.</p>' +
      '<p>La garantía no cubre los daños por uso indebido, instalación incorrecta, falta de mantenimiento o manipulación por personal ajeno al servicio técnico.</p>' +
      '<h3>Devoluciones</h3>' +
      '<p>Si el artículo no es lo que esperabas, dispones de 14 días naturales desde la recepción para devolverlo. Debe estar sin usar y en su embalaje original. Los portes de la devolución corren por cuenta del cliente salvo error nuestro.</p>' +
      '<p>Los artículos fabricados a medida, personalizados o con decoración específica del cliente no admiten devolución.</p>' +
      '<h3>Roturas en el transporte</h3>' +
      '<p>Revisa la mercancía delante del transportista. Si hay bultos golpeados, anótalo en el albarán de entrega y avísanos en 24 horas con fotos. Sin esa anotación la agencia no admite la reclamación.</p>'],
    'aviso-legal': ['Aviso Legal',
      '<p>En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa de los datos identificativos del titular de este sitio web.</p>' +
      '<h3>Titular</h3>' +
      '<ul><li>Denominación social: Suministros de Hostelería Moncat, S.L.</li>' +
      '<li>NIF: B64461072</li>' +
      '<li>Nombre comercial: Comercial El Maño · Suministros CEM</li>' +
      '<li>Domicilio: Calle Independencia, 349 · 08026 Barcelona</li>' +
      '<li>Teléfono: ' + TEL_TXT + '</li>' +
      '<li>Correo: <a href="mailto:' + MAIL + '">' + MAIL + '</a></li></ul>' +
      '<h3>Propiedad intelectual</h3>' +
      '<p>Los contenidos de este sitio, incluidos textos, fotografías, marcas y logotipos, están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción sin autorización.</p>' +
      '<h3>Responsabilidad</h3>' +
      '<p>Procuramos que la información publicada esté actualizada, pero pueden existir errores tipográficos o de precio. Si detectamos uno, te lo comunicamos antes de tramitar el pedido.</p>'],
    'politica-de-privacidad': ['Política de Privacidad',
      '<p>Tratamos los datos que nos facilitas conforme al Reglamento (UE) 2016/679 y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales.</p>' +
      '<h3>Quién trata tus datos</h3>' +
      '<p>Comercial El Maño, con domicilio en la calle Independencia, 349 de Barcelona.</p>' +
      '<h3>Para qué</h3>' +
      '<p>Para gestionar las comunicaciones de la empresa, elaborar presupuestos, facturar y realizar el resto de actividades necesarias para la relación comercial.</p>' +
      '<h3>Con quién se comparten</h3>' +
      '<p>Los datos pueden compartirse con Suministros de Hostelería Moncat, S.L. (NIF B64461072), ubicada en las mismas oficinas y que nos presta servicios de asesoramiento y suministros. Fuera de eso, solo se ceden a las agencias de transporte necesarias para la entrega y a quien lo solicite por imperativo legal.</p>' +
      '<h3>Cuánto tiempo</h3>' +
      '<p>Mientras dure la relación comercial y, después, durante los plazos de prescripción legal.</p>' +
      '<h3>Tus derechos</h3>' +
      '<p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a la calle Independencia, 349, 08026 Barcelona, llamando al ' + TEL_TXT + ' o enviando un correo a <a href="mailto:' + MAIL + '">' + MAIL + '</a>. También puedes reclamar ante la Agencia Española de Protección de Datos.</p>'],
    'condiciones-de-uso': ['Condiciones de Uso',
      '<p>El acceso a este sitio web implica la aceptación de estas condiciones.</p>' +
      '<h3>Uso del sitio</h3>' +
      '<p>Te comprometes a usar la web conforme a la ley y a no realizar actividades que puedan dañar los sistemas o impedir su uso normal a otros usuarios.</p>' +
      '<h3>Cuenta de cliente</h3>' +
      '<p>Eres responsable de custodiar tus claves de acceso y de las operaciones realizadas con ellas. Avísanos de inmediato si sospechas que alguien las conoce.</p>' +
      '<h3>Enlaces externos</h3>' +
      '<p>Podemos enlazar a sitios de terceros sobre cuyos contenidos no tenemos control ni responsabilidad.</p>' +
      '<h3>Legislación aplicable</h3>' +
      '<p>Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Barcelona, salvo que la normativa de consumo establezca otro fuero.</p>'],
    'cookies': ['Política de Cookies',
      '<p>Esta web no instala cookies de publicidad ni de seguimiento.</p>' +
      '<h3>Lo único que guardamos</h3>' +
      '<p>Para que la cesta recuerde lo que has ido añadiendo, guardamos ese dato en el almacenamiento local de tu propio navegador. No se envía a ningún servidor, no identifica quién eres y desaparece si borras los datos de navegación.</p>' +
      '<h3>Cómo borrarlo</h3>' +
      '<p>Desde los ajustes de tu navegador, borrando los datos del sitio. También puedes vaciar la cesta desde la propia página. Si lo haces, la web sigue funcionando igual: solo perderás la lista que tuvieras empezada.</p>'],
    'blog': ['Blog',
      '<p>Publicamos fichas de producto, comparativas y algún consejo de mantenimiento de maquinaria.</p>' +
      '<p>Puedes ver las últimas entradas en la sección de <a href="#/noticias">noticias</a>.</p>']
  };

  function vista404() {
    return '<div class="contenedor"><div class="seccion">' +
      '<div class="vacio">' + ico('M12 8v5M12 16.5v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z') +
      '<h3>No encontramos esta página</h3>' +
      '<p>Puede que el enlace haya cambiado. Prueba desde el catálogo o escríbenos y te decimos dónde está lo que buscas.</p>' +
      '<a href="#/catalogo" class="btn btn-verde">Ir al catálogo</a></div>' +
      '</div></div>';
  }

  /* ---------- router ---------- */

  function render() {
    var h = location.hash.replace(/^#/, '') || '/';
    var partes = h.split('?');
    var ruta = partes[0].replace(/\/$/, '') || '/';
    var params = new URLSearchParams(partes[1] || '');
    var seg = ruta.split('/').filter(Boolean);
    var html, titulo = 'Suministros CEM · Comercial El Maño';

    if (ruta === '/') { html = vistaInicio(); }
    else if (seg[0] === 'familia' && seg[1]) {
      html = vistaFamilia(seg[1], params);
      var f = fam(seg[1]); if (f) titulo = f.n + ' · Suministros CEM';
    }
    else if (seg[0] === 'producto' && seg[1]) {
      html = vistaProducto(seg[1]);
      var p = prod(Number(seg[1])); if (p) titulo = p.n + ' · Suministros CEM';
    }
    else if (seg[0] === 'buscar') { html = vistaBuscar(params); titulo = 'Búsqueda · Suministros CEM'; }
    else if (ruta === '/catalogo') { html = vistaCatalogo(); titulo = 'Nuestros Productos · Suministros CEM'; }
    else if (ruta === '/ofertas') { html = vistaOfertas(); titulo = 'Ofertas · Suministros CEM'; }
    else if (ruta === '/quienes-somos') { html = vistaQuienesSomos(); titulo = 'Quiénes Somos · Suministros CEM'; }
    else if (ruta === '/reformas') { html = vistaReformas(); titulo = 'Reformas y Proyectos · Suministros CEM'; }
    else if (ruta === '/servicio-tecnico') { html = vistaServicioTecnico(); titulo = 'Servicio Técnico · Suministros CEM'; }
    else if (ruta === '/donde-estamos') { html = vistaDondeEstamos(); titulo = 'Donde Estamos · Suministros CEM'; }
    else if (ruta === '/contacto') { html = vistaContacto(); titulo = 'Contacto · Suministros CEM'; }
    else if (ruta === '/registrese') { html = vistaRegistrese(); titulo = 'Regístrese · Suministros CEM'; }
    else if (ruta === '/catalogos') { html = vistaCatalogos(); titulo = 'Catálogos · Suministros CEM'; }
    else if (ruta === '/noticias') { html = vistaNoticias(); titulo = 'Noticias · Suministros CEM'; }
    else if (ruta === '/trabaja-con-nosotros') { html = vistaTrabaja(); titulo = 'Trabaja con Nosotros · Suministros CEM'; }
    else if (ruta === '/carrito') { html = vistaCarrito(); titulo = 'Mi cesta · Suministros CEM'; }
    else if (LEGALES[ruta.slice(1)]) {
      var L = LEGALES[ruta.slice(1)];
      html = paginaTexto(L[0], L[1]);
      titulo = L[0] + ' · Suministros CEM';
    }
    else { html = vista404(); titulo = 'Página no encontrada · Suministros CEM'; }

    document.getElementById('contenido').innerHTML = html;
    document.title = titulo;
    marcarActivos(ruta);
    cerrarMenu();
    window.scrollTo(0, 0);
  }

  function marcarActivos(ruta) {
    document.querySelectorAll('.nav-principal a').forEach(function (a) {
      a.classList.toggle('activo', a.getAttribute('href') === '#' + ruta);
    });
    document.querySelectorAll('.barra-movil a').forEach(function (a) {
      a.classList.toggle('activo', a.getAttribute('data-ruta') === ruta);
    });
  }

  /* ---------- menús ---------- */

  function abrirMenu() {
    document.getElementById('panel-movil').classList.add('abierto');
    document.getElementById('velo').classList.add('abierto');
    document.getElementById('panel-movil').setAttribute('aria-hidden', 'false');
    document.getElementById('btn-menu').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function cerrarMenu() {
    document.getElementById('panel-movil').classList.remove('abierto');
    document.getElementById('velo').classList.remove('abierto');
    document.getElementById('panel-movil').setAttribute('aria-hidden', 'true');
    document.getElementById('btn-menu').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    var np = document.getElementById('nav-productos');
    if (np) { np.classList.remove('abierto'); np.querySelector('button').setAttribute('aria-expanded', 'false'); }
  }

  function pintarMenus() {
    document.getElementById('megamenu').innerHTML = FAMILIAS.map(function (f) {
      return '<a href="#/familia/' + f.s + '" class="mega-fam">' +
        '<span class="mega-fam-nom">' + ico(f.i) + e(f.n) + '</span>' +
        '<span class="mega-fam-subs">' + e(f.subs.slice(0, 4).join(', ')) + (f.subs.length > 4 ? '…' : '') + '</span>' +
        '</a>';
    }).join('');

    document.getElementById('panel-cuerpo').innerHTML =
      '<div class="panel-seccion">Nuestros Productos</div>' +
      FAMILIAS.map(function (f, i) {
        return '<button class="panel-enlace" data-fam-toggle="' + i + '" aria-expanded="false">' +
          '<span style="display:flex;align-items:center;flex:1">' + ico(f.i, 'ico-fam') + e(f.n) + '</span>' +
          '<svg viewBox="0 0 24 24" class="chev"><path d="M6 9l6 6 6-6" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<div class="panel-subs" data-fam-subs="' + i + '">' +
          '<a href="#/familia/' + f.s + '"><strong>Ver toda la familia' + (f.count ? ' (' + f.count + ')' : '') + '</strong></a>' +
          f.subs.map(function (s) {
            return '<a href="#/familia/' + f.s + '?sub=' + encodeURIComponent(s) + '">' + e(s) + '</a>';
          }).join('') +
          '</div>';
      }).join('') +
      '<div class="panel-seccion">La empresa</div>' +
      [['#/quienes-somos', 'Quiénes Somos'], ['#/ofertas', 'Ofertas'], ['#/catalogos', 'Catálogos'],
       ['#/reformas', 'Reformas'], ['#/registrese', 'Regístrese'], ['#/servicio-tecnico', 'Servicio Técnico'],
       ['#/donde-estamos', 'Donde Estamos'], ['#/contacto', 'Contacto'], ['#/noticias', 'Noticias'],
       ['#/trabaja-con-nosotros', 'Trabaja con Nosotros'], ['#/blog', 'Blog']]
        .map(function (x) { return '<a href="' + x[0] + '" class="panel-enlace">' + x[1] + '</a>'; }).join('');
  }

  /* ---------- buscador ---------- */

  function sugerir(q) {
    var caja = document.getElementById('sugerencias');
    var nq = norm(q).trim();
    if (nq.length < 2) { caja.classList.remove('abierto'); caja.innerHTML = ''; return; }
    var r = PRODUCTOS.filter(function (p) {
      return norm(p.n).indexOf(nq) >= 0 || norm(p.c).indexOf(nq) >= 0;
    });
    if (!r.length) {
      caja.innerHTML = '<div style="padding:16px;text-align:center;color:var(--gris);font-size:.875rem">' +
        'Nada con ese nombre. <a href="#/contacto">Pregúntanos</a> y te decimos si lo tenemos.</div>';
      caja.classList.add('abierto');
      return;
    }
    caja.innerHTML = r.slice(0, 6).map(function (p) {
      return '<a href="#/producto/' + p.id + '" class="sug-item">' +
        '<img src="' + IMG + e(p.img) + '" alt="" loading="lazy">' +
        '<span class="sug-txt"><span class="sug-nom">' + e(p.n) + '</span>' +
        '<span class="sug-cat">' + e(p.c) + '</span></span>' +
        (p.p ? '<span class="sug-pre">' + eur(p.p) + '</span>' : '') +
        '</a>';
    }).join('') +
      (r.length > 6 ? '<a href="#/buscar?q=' + encodeURIComponent(q) + '" class="sug-todos">Ver los ' + r.length + ' resultados</a>' : '');
    caja.classList.add('abierto');
  }

  /* ---------- aviso de vacaciones ---------- */

  function avisoVacaciones() {
    var hoy = new Date();
    var y = hoy.getFullYear();
    var desde = new Date(y, 7, 7);
    var hasta = new Date(y, 7, 24, 23, 59);
    if (hoy >= desde && hoy <= hasta) {
      document.getElementById('avisobar-txt').innerHTML =
        'Cerrados por vacaciones del 7 al 24 de agosto, ambos incluidos. Puedes seguir haciendo pedidos por la web y los servimos a la vuelta.';
      document.getElementById('avisobar').hidden = false;
    }
  }

  /* ---------- eventos ---------- */

  document.addEventListener('click', function (ev) {
    var t = ev.target;

    var add = t.closest && t.closest('[data-add]');
    if (add) { ev.preventDefault(); addCesta(Number(add.getAttribute('data-add'))); return; }

    var addF = t.closest && t.closest('[data-add-ficha]');
    if (addF) {
      ev.preventDefault();
      var c = document.getElementById('cant');
      addCesta(Number(addF.getAttribute('data-add-ficha')), Math.max(1, Number(c ? c.value : 1)));
      return;
    }

    var cant = t.closest && t.closest('[data-cant]');
    if (cant) {
      var inp = document.getElementById('cant');
      inp.value = Math.max(1, Number(inp.value) + Number(cant.getAttribute('data-cant')));
      return;
    }

    var lin = t.closest && t.closest('[data-linea]');
    if (lin) {
      var id = Number(lin.getAttribute('data-linea'));
      var d = Number(lin.getAttribute('data-d'));
      cesta.forEach(function (l) { if (l.id === id) l.q = Math.max(1, l.q + d); });
      guardarCesta(); render(); return;
    }

    var quit = t.closest && t.closest('[data-quitar]');
    if (quit) {
      var qid = Number(quit.getAttribute('data-quitar'));
      cesta = cesta.filter(function (l) { return l.id !== qid; });
      guardarCesta(); render(); return;
    }

    if (t.id === 'vaciar') { cesta = []; guardarCesta(); render(); return; }

    var tog = t.closest && t.closest('[data-fam-toggle]');
    if (tog) {
      var i = tog.getAttribute('data-fam-toggle');
      var subs = document.querySelector('[data-fam-subs="' + i + '"]');
      var ab = subs.classList.toggle('abierto');
      tog.classList.toggle('abierto', ab);
      tog.setAttribute('aria-expanded', ab ? 'true' : 'false');
      return;
    }

    if (t.id === 'btn-menu' || (t.closest && t.closest('#btn-menu'))) { abrirMenu(); return; }
    if (t.id === 'velo' || t.id === 'btn-cerrar-menu' || (t.closest && t.closest('#btn-cerrar-menu'))) { cerrarMenu(); return; }

    var np = document.getElementById('nav-productos');
    if (np && t.closest && t.closest('#nav-productos > button')) {
      var abierto = np.classList.toggle('abierto');
      np.querySelector('button').setAttribute('aria-expanded', abierto ? 'true' : 'false');
      return;
    }
    if (np && t.closest && !t.closest('#nav-productos')) {
      np.classList.remove('abierto');
      np.querySelector('button').setAttribute('aria-expanded', 'false');
    }

    if (!t.closest || !t.closest('.buscador')) {
      document.getElementById('sugerencias').classList.remove('abierto');
    }
  });

  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'q') sugerir(ev.target.value);
    if (ev.target.hasAttribute && ev.target.hasAttribute('data-linea-input')) {
      var id = Number(ev.target.getAttribute('data-linea-input'));
      var v = Math.max(1, Number(ev.target.value) || 1);
      cesta.forEach(function (l) { if (l.id === id) l.q = v; });
      guardarCesta();
    }
  });

  document.addEventListener('change', function (ev) {
    if (ev.target.id === 'orden') {
      var s = ev.target;
      var u = '#/familia/' + s.getAttribute('data-fam');
      var qs = [];
      if (s.getAttribute('data-sub')) qs.push('sub=' + encodeURIComponent(s.getAttribute('data-sub')));
      if (s.value) qs.push('orden=' + s.value);
      location.hash = u + (qs.length ? '?' + qs.join('&') : '');
    }
  });

  document.addEventListener('submit', function (ev) {
    if (ev.target.id === 'form-buscar') {
      ev.preventDefault();
      var v = document.getElementById('q').value.trim();
      document.getElementById('sugerencias').classList.remove('abierto');
      if (v) location.hash = '#/buscar?q=' + encodeURIComponent(v);
      return;
    }
    if (ev.target.id === 'form-contacto') {
      ev.preventDefault();
      var f = ev.target;
      var ok = true;
      f.querySelectorAll('[required]').forEach(function (c) {
        var malo = c.type === 'checkbox' ? !c.checked : !c.value.trim();
        c.style.borderColor = malo ? 'var(--naranja)' : '';
        if (malo) ok = false;
      });
      if (!ok) return;

      var lineas = [];
      f.querySelectorAll('input, select, textarea').forEach(function (c) {
        if (c.type === 'checkbox' || !c.value.trim()) return;
        var et = f.querySelector('label[for="' + c.id + '"]');
        var nom = et ? et.textContent.replace('*', '').trim() : c.id;
        lineas.push(nom + ': ' + c.value.trim());
      });
      var asunto = f.querySelector('#c-asunto');
      window.location.href = 'mailto:' + MAIL +
        '?subject=' + encodeURIComponent(asunto ? asunto.value : 'Alta de cliente desde la web') +
        '&body=' + encodeURIComponent(lineas.join('\n'));

      f.style.display = 'none';
      var av = document.getElementById('aviso-form');
      av.classList.add('visible');
      av.scrollIntoView({ block: 'center' });
    }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      cerrarMenu();
      document.getElementById('sugerencias').classList.remove('abierto');
    }
  });

  window.addEventListener('hashchange', render);

  window.addEventListener('scroll', function () {
    document.getElementById('cabecera').classList.toggle('compacta', window.scrollY > 8);
  }, { passive: true });

  /* ---------- arranque ---------- */

  document.getElementById('anio').textContent = new Date().getFullYear();
  pintarMenus();
  pintarContador();
  avisoVacaciones();
  render();

})();
