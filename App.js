
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';

const dinero = (valor) => '$' + Number(valor || 0).toFixed(2);

const fechaHoy = () => {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
};

const porcentajeGanancia = (costo, precio) => {
  if (Number(costo) === 0) {
    return Number(precio) > 0 ? 'No definido' : '0%';
  }
  return `${(((precio - costo) / costo) * 100).toFixed(1)}%`;
};

export default function App() {
  // SESIÓN
  const [sesionActiva, setSesionActiva] = useState(false);
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [claveLogin, setClaveLogin] = useState('');

  const [usuario, setUsuario] = useState('admin');
  const [contrasena, setContrasena] = useState('admin2024');

  // NEGOCIO
  const [nombreLibreria, setNombreLibreria] = useState('Librería Emmanuel');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  // APARIENCIA
  const [modoOscuro, setModoOscuro] = useState(false);

  // NAVEGACIÓN
  const [pantalla, setPantalla] = useState('Inicio');

  // INVENTARIO
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [costo, setCosto] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  // VENTAS
  const [ventas, setVentas] = useState([]);
  const [mensajeVenta, setMensajeVenta] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const colores = modoOscuro
    ? {
        fondo: '#101827',
        tarjeta: '#1D293B',
        texto: '#F1F5F9',
        secundario: '#B5C1D1',
        borde: '#35445B',
        input: '#263449',
        encabezado: '#0B1423',
        boton: '#2563A5',
        verde: '#174D3B',
        verdeTexto: '#9BE7BD',
        aviso: '#253B5A',
        avisoTexto: '#D5E7FF',
        peligro: '#FCA5A5',
      }
    : {
        fondo: '#F4F7FC',
        tarjeta: '#FFFFFF',
        texto: '#172B4D',
        secundario: '#718096',
        borde: '#E9EEF6',
        input: '#F8FAFD',
        encabezado: '#123B70',
        boton: '#123B70',
        verde: '#E8F7EF',
        verdeTexto: '#176B45',
        aviso: '#E8F1FF',
        avisoTexto: '#385779',
        peligro: '#B42318',
      };

  const totalUnidades = productos.reduce(
    (total, p) => total + p.cantidad, 0
  );

  const valorInventario = productos.reduce(
    (total, p) => total + p.costo * p.cantidad, 0
  );

  const ventasDelDia = ventas.filter(
    (venta) => venta.dia === fechaHoy()
  );

  const totalVentas = ventas.reduce(
    (total, venta) => total + venta.total, 0
  );

  const totalVentasDia = ventasDelDia.reduce(
    (total, venta) => total + venta.total, 0
  );

  const gananciaTotalDia = ventasDelDia.reduce(
    (total, venta) => total + venta.ganancia, 0
  );

  const unidadesVendidasDia = ventasDelDia.reduce(
    (total, venta) => total + venta.cantidad, 0
  );

  // INICIAR SESIÓN
  const iniciarSesion = () => {
    if (!usuarioLogin.trim() || !claveLogin.trim()) {
      Alert.alert('Datos incompletos', 'Escribe tu usuario y contraseña.');
      return;
    }

    if (
      usuarioLogin.trim().toLowerCase() === usuario.toLowerCase() &&
      claveLogin === contrasena
    ) {
      setSesionActiva(true);
      setPantalla('Inicio');
      setClaveLogin('');
      setBusqueda('');
    } else {
      Alert.alert('Acceso denegado', 'El usuario o la contraseña son incorrectos.');
    }
  };

  // CERRAR SESIÓN
  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          onPress: () => {
            setSesionActiva(false);
            setUsuarioLogin('');
            setClaveLogin('');
            setPantalla('Inicio');
          },
        },
      ]
    );
  };

  // AGREGAR PRODUCTO
  const guardarProducto = () => {
    const costoNumero = Number(costo);
    const precioNumero = Number(precio);
    const cantidadNumero = Number(cantidad);

    if (
      !nombre.trim() ||
      !categoria.trim() ||
      costo.trim() === '' ||
      precio.trim() === '' ||
      cantidad.trim() === ''
    ) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return;
    }

    if (
      !Number.isFinite(costoNumero) ||
      !Number.isFinite(precioNumero) ||
      !Number.isInteger(cantidadNumero) ||
      costoNumero < 0 ||
      precioNumero < 0 ||
      cantidadNumero < 0
    ) {
      Alert.alert(
        'Datos incorrectos',
        'Ingresa precios válidos y una cantidad entera mayor o igual a cero.'
      );
      return;
    }

    const nuevoProducto = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      costo: costoNumero,
      precio: precioNumero,
      cantidad: cantidadNumero,
    };

    setProductos((actuales) => [...actuales, nuevoProducto]);

    setNombre('');
    setCategoria('');
    setCosto('');
    setPrecio('');
    setCantidad('');

    Alert.alert('¡Producto agregado!', 'El producto se guardó correctamente.');
  };

  // ELIMINAR PRODUCTO
  const eliminarProducto = (id) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProductos((actuales) =>
              actuales.filter((p) => p.id !== id)
            );
          },
        },
      ]
    );
  };

  // REGISTRAR VENTA
  const registrarVenta = (producto) => {
    const productoActual = productos.find((p) => p.id === producto.id);

    if (!productoActual || productoActual.cantidad < 1) {
      setMensajeVenta('No hay existencias disponibles de este producto.');
      return;
    }

    setProductos((actuales) =>
      actuales.map((p) =>
        p.id === producto.id
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );

    const ahora = new Date();

    const nuevaVenta = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      nombre: productoActual.nombre,
      total: productoActual.precio,
      ganancia: productoActual.precio - productoActual.costo,
      cantidad: 1,
      dia: fechaHoy(),
      fecha: ahora.toLocaleString(),
    };

    setVentas((actuales) => [...actuales, nuevaVenta]);

    setMensajeVenta(
      `¡Venta registrada! ${productoActual.nombre} · ${dinero(productoActual.precio)}`
    );
    setBusqueda('');
  };

  // GUARDAR PERFIL
  const guardarPerfil = () => {
    if (!nombreLibreria.trim()) {
      Alert.alert('Campo obligatorio', 'Escribe el nombre de la librería.');
      return;
    }

    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Datos incompletos', 'El usuario y la contraseña no pueden quedar vacíos.');
      return;
    }

    Alert.alert('Perfil actualizado', 'Los datos de tu cuenta se actualizaron correctamente.');
  };

  // ESTILOS DINÁMICOS
  const st = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    encabezado: {
      backgroundColor: colores.encabezado,
      paddingHorizontal: 22,
      paddingTop: 20,
      paddingBottom: 22,
      borderBottomLeftRadius: 26,
      borderBottomRightRadius: 26,
    },
    etiqueta: {
      color: '#BFD7FF',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 2,
      marginBottom: 8,
    },
    titulo: {
      color: '#FFFFFF',
      fontSize: 25,
      fontWeight: '900',
    },
    subtitulo: {
      color: '#D7E5F8',
      fontSize: 12,
      marginTop: 6,
    },
    estado: {
      alignSelf: 'flex-start',
      marginTop: 13,
      backgroundColor: '#214C7E',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
    },
    textoEstado: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    scroll: { flex: 1 },
    contenido: {
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 30,
    },
    tituloPantalla: {
      color: colores.texto,
      fontSize: 23,
      fontWeight: '900',
    },
    bienvenida: {
      color: colores.texto,
      fontSize: 23,
      fontWeight: '900',
    },
    descripcion: {
      color: colores.secundario,
      fontSize: 13,
      marginTop: 7,
      lineHeight: 20,
    },
    tituloSeccion: {
      color: colores.texto,
      fontSize: 17,
      fontWeight: '800',
      marginTop: 23,
      marginBottom: 12,
    },
    tarjeta: {
      backgroundColor: colores.tarjeta,
      borderRadius: 17,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colores.borde,
    },
    tarjetaResumen: {
      backgroundColor: colores.tarjeta,
      borderRadius: 17,
      padding: 16,
      marginTop: 15,
      borderWidth: 1,
      borderColor: colores.borde,
    },
    valor: {
      color: colores.texto,
      fontSize: 23,
      fontWeight: '900',
      marginTop: 5,
    },
    texto: {
      color: colores.secundario,
      fontSize: 12,
      marginTop: 7,
      lineHeight: 18,
    },
    nombre: {
      color: colores.texto,
      fontSize: 16,
      fontWeight: '800',
    },
    input: {
      backgroundColor: colores.input,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 13,
      paddingVertical: 12,
      color: colores.texto,
      fontSize: 14,
      marginTop: 7,
    },
    etiquetaCampo: {
      color: colores.texto,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 13,
    },
    boton: {
      backgroundColor: colores.boton,
      paddingVertical: 14,
      paddingHorizontal: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 15,
    },
    textoBoton: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    botonEliminar: {
      borderWidth: 1,
      borderColor: '#E5A5A5',
      borderRadius: 10,
      padding: 10,
      alignSelf: 'flex-start',
      marginTop: 13,
    },
    textoEliminar: {
      color: colores.peligro,
      fontSize: 12,
      fontWeight: '700',
    },
    verde: {
      backgroundColor: colores.verde,
      padding: 13,
      borderRadius: 12,
      marginTop: 14,
    },
    verdeTexto: {
      color: colores.verdeTexto,
      fontWeight: '800',
      fontSize: 13,
    },
    aviso: {
      backgroundColor: colores.aviso,
      padding: 16,
      borderRadius: 15,
      marginTop: 18,
    },
    avisoTexto: {
      color: colores.avisoTexto,
      fontSize: 12,
      lineHeight: 19,
    },
    modulo: {
      backgroundColor: colores.tarjeta,
      borderRadius: 16,
      padding: 16,
      width: '48%',
      borderWidth: 1,
      borderColor: colores.borde,
      marginBottom: 10,
    },
    fila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 18,
    },
    vacio: {
      backgroundColor: colores.tarjeta,
      padding: 22,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 12,
      borderWidth: 1,
      borderColor: colores.borde,
    },
    navegacion: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colores.tarjeta,
      borderTopWidth: 1,
      borderTopColor: colores.borde,
      paddingVertical: 11,
    },
    opcionNav: {
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    textoNav: {
      color: colores.secundario,
      fontSize: 10,
      marginTop: 4,
    },
    textoNavActivo: {
      color: modoOscuro ? '#8FC5FF' : '#123B70',
      fontSize: 10,
      fontWeight: '900',
      marginTop: 4,
    },
    pie: {
      color: colores.secundario,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 25,
    },
  });

  // PANTALLA DE INICIO DE SESIÓN
  if (!sesionActiva) {
    return (
      <SafeAreaView style={st.contenedor}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colores.encabezado}
        />

        <View style={[st.encabezado, { paddingTop: 45, paddingBottom: 35 }]}>
          <Text style={st.etiqueta}>SISTEMA DE ADMINISTRACIÓN</Text>
          <Text style={st.titulo}>{nombreLibreria}</Text>
          <Text style={st.subtitulo}>Bienvenido a tu sistema de administración</Text>
        </View>

        <ScrollView contentContainerStyle={st.contenido}>
          <View style={[st.tarjeta, { marginTop: 35, padding: 22 }]}>
            <Text style={[st.tituloPantalla, { textAlign: 'center' }]}>
              🔐 Iniciar sesión
            </Text>
            <Text style={[st.descripcion, { textAlign: 'center', marginBottom: 12 }]}>
              Ingresa tus datos para acceder a la aplicación.
            </Text>

            <Text style={st.etiquetaCampo}>Nombre de usuario</Text>
            <TextInput
              style={st.input}
              value={usuarioLogin}
              onChangeText={setUsuarioLogin}
              placeholder="Escribe tu usuario"
              placeholderTextColor={colores.secundario}
              autoCapitalize="none"
            />

            <Text style={st.etiquetaCampo}>Contraseña</Text>
            <TextInput
              style={st.input}
              value={claveLogin}
              onChangeText={setClaveLogin}
              placeholder="Escribe tu contraseña"
              placeholderTextColor={colores.secundario}
              secureTextEntry
            />

            <Pressable style={st.boton} onPress={iniciarSesion}>
              <Text style={st.textoBoton}>ENTRAR A LA APLICACIÓN</Text>
            </Pressable>

            <Text style={[st.texto, { textAlign: 'center', marginTop: 18 }]}>
              Usuario inicial: admin
            </Text>
            <Text style={[st.texto, { textAlign: 'center' }]}>
              Contraseña inicial: admin2024
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // INICIO
  const renderInicio = () => (
    <>
      <Text style={st.bienvenida}>¡Bienvenido!</Text>
      <Text style={st.descripcion}>
        Administra {nombreLibreria} desde tu dispositivo móvil.
      </Text>

      <Text style={st.tituloSeccion}>Resumen del negocio</Text>

      <View style={st.fila}>
        <View style={[st.modulo, { width: '48%' }]}>
          <Text style={{ fontSize: 23 }}>💰</Text>
          <Text style={st.valor}>{dinero(totalVentasDia)}</Text>
          <Text style={st.texto}>Ventas de hoy</Text>
        </View>

        <View style={[st.modulo, { width: '48%' }]}>
          <Text style={{ fontSize: 23 }}>📦</Text>
          <Text style={st.valor}>{totalUnidades}</Text>
          <Text style={st.texto}>Unidades disponibles</Text>
        </View>
      </View>

      <Text style={st.tituloSeccion}>Módulos principales</Text>

      <View style={st.fila}>
        {[
          ['📦', 'Inventario'],
          ['🛒', 'Ventas'],
          ['📊', 'Reportes'],
          ['👤', 'Mi perfil'],
        ].map(([icono, nombreModulo]) => (
          <Pressable
            key={nombreModulo}
            style={st.modulo}
            onPress={() => setPantalla(nombreModulo)}
          >
            <Text style={{ fontSize: 27 }}>{icono}</Text>
            <Text style={[st.nombre, { marginTop: 10 }]}>{nombreModulo}</Text>
            <Text style={st.texto}>Toca para abrir ›</Text>
          </Pressable>
        ))}
      </View>

      <View style={st.aviso}>
        <Text style={[st.nombre, { color: colores.avisoTexto }]}>
          💡 Control de tu negocio
        </Text>
        <Text style={[st.avisoTexto, { marginTop: 7 }]}>
          Registra productos, controla existencias, realiza ventas y consulta
          tus ganancias del día.
        </Text>
      </View>
    </>
  );

  // INVENTARIO
  const renderInventario = () => (
    <>
      <Text style={st.tituloPantalla}>📦 Inventario</Text>
      <Text style={st.descripcion}>
        Registra y administra los productos de tu librería.
      </Text>

      <View style={st.tarjeta}>
        <Text style={st.nombre}>＋ Nuevo producto</Text>

        <Text style={st.etiquetaCampo}>Nombre del producto</Text>
        <TextInput
          style={st.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Lapicero azul"
          placeholderTextColor={colores.secundario}
        />

        <Text style={st.etiquetaCampo}>Categoría</Text>
        <TextInput
          style={st.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej. Papelería"
          placeholderTextColor={colores.secundario}
        />

        <Text style={st.etiquetaCampo}>Costo de compra ($)</Text>
        <TextInput
          style={st.input}
          value={costo}
          onChangeText={setCosto}
          placeholder="Ej. 0.25"
          placeholderTextColor={colores.secundario}
          keyboardType="decimal-pad"
        />

        <Text style={st.etiquetaCampo}>Precio de venta ($)</Text>
        <TextInput
          style={st.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="Ej. 0.40"
          placeholderTextColor={colores.secundario}
          keyboardType="decimal-pad"
        />

        <Text style={st.etiquetaCampo}>Cantidad inicial</Text>
        <TextInput
          style={st.input}
          value={cantidad}
          onChangeText={setCantidad}
          placeholder="Ej. 100"
          placeholderTextColor={colores.secundario}
          keyboardType="number-pad"
        />

        <View style={st.verde}>
          <Text style={st.verdeTexto}>Ganancia estimada por unidad</Text>
          <Text style={[st.valor, { color: colores.verdeTexto }]}>
            {costo.trim() !== '' && precio.trim() !== '' &&
            Number.isFinite(Number(costo)) && Number.isFinite(Number(precio))
              ? dinero(Number(precio) - Number(costo))
              : '—'}
          </Text>
          <Text style={st.verdeTexto}>
            Porcentaje: {costo.trim() !== '' && precio.trim() !== ''
              ? porcentajeGanancia(Number(costo), Number(precio))
              : '—'}
          </Text>
        </View>

        <Pressable style={st.boton} onPress={guardarProducto}>
          <Text style={st.textoBoton}>＋ Agregar producto</Text>
        </Pressable>
      </View>

      <Text style={st.tituloSeccion}>Productos registrados</Text>

      <View style={st.tarjetaResumen}>
        <Text style={st.texto}>Tipos de productos: {productos.length}</Text>
        <Text style={st.texto}>Unidades en existencia: {totalUnidades}</Text>
        <Text style={st.texto}>
          Valor al costo de compra: {dinero(valorInventario)}
        </Text>
      </View>

      {productos.length === 0 ? (
        <View style={st.vacio}>
          <Text style={{ fontSize: 35 }}>📭</Text>
          <Text style={[st.nombre, { marginTop: 8 }]}>Inventario vacío</Text>
          <Text style={st.texto}>Agrega tu primer producto usando el formulario.</Text>
        </View>
      ) : (
        productos.map((producto) => (
          <View key={producto.id} style={st.tarjeta}>
            <Text style={st.nombre}>{producto.nombre}</Text>
            <Text style={st.texto}>Categoría: {producto.categoria}</Text>
            <Text style={st.texto}>Stock: {producto.cantidad}</Text>
            <Text style={st.texto}>Costo: {dinero(producto.costo)}</Text>
            <Text style={st.texto}>Precio de venta: {dinero(producto.precio)}</Text>
            <Text style={[st.verdeTexto, { marginTop: 9 }]}>
              Ganancia por unidad: {dinero(producto.precio - producto.costo)}
            </Text>
            <Text style={[st.verdeTexto, { marginTop: 5 }]}>
              Porcentaje de ganancia: {porcentajeGanancia(producto.costo, producto.precio)}
            </Text>

            <Pressable
              style={st.botonEliminar}
              onPress={() => eliminarProducto(producto.id)}
            >
              <Text style={st.textoEliminar}>Eliminar producto</Text>
            </Pressable>
          </View>
        ))
      )}
    </>
  );

  // VENTAS
  const renderVentas = () => {
    const productosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase().trim())
    );

    return (
      <>
        <Text style={st.tituloPantalla}>🛒 Ventas</Text>
        <Text style={st.descripcion}>
          Busca el producto que deseas vender y selecciónalo.
        </Text>

        {mensajeVenta !== '' && (
          <View style={st.verde}>
            <Text style={st.verdeTexto}>{mensajeVenta}</Text>
          </View>
        )}

        <View style={st.tarjetaResumen}>
          <Text style={st.texto}>Total vendido hoy</Text>
          <Text style={st.valor}>{dinero(totalVentasDia)}</Text>
          <Text style={st.texto}>
            Operaciones de hoy: {ventasDelDia.length}
          </Text>
        </View>

        <Text style={st.tituloSeccion}>Buscar producto</Text>
        <TextInput
          style={st.input}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="🔎 Escribe el nombre del producto..."
          placeholderTextColor={colores.secundario}
        />

        <Text style={st.tituloSeccion}>Selecciona el producto vendido</Text>

        {productos.length === 0 ? (
          <View style={st.vacio}>
            <Text style={{ fontSize: 32 }}>🛍️</Text>
            <Text style={[st.nombre, { marginTop: 8 }]}>No hay productos</Text>
            <Text style={st.texto}>Primero agrega productos desde Inventario.</Text>
            <Pressable style={st.boton} onPress={() => setPantalla('Inventario')}>
              <Text style={st.textoBoton}>Ir a Inventario</Text>
            </Pressable>
          </View>
        ) : productosFiltrados.length === 0 ? (
          <View style={st.vacio}>
            <Text style={st.nombre}>No se encontraron resultados</Text>
            <Text style={st.texto}>Prueba con otro nombre de producto.</Text>
          </View>
        ) : (
          productosFiltrados.map((producto) => (
            <View key={producto.id} style={st.tarjeta}>
              <Text style={st.nombre}>{producto.nombre}</Text>
              <Text style={st.texto}>Categoría: {producto.categoria}</Text>
              <Text style={st.texto}>Disponible: {producto.cantidad} unidades</Text>
              <Text style={st.texto}>Costo: {dinero(producto.costo)}</Text>
              <Text style={st.texto}>Precio de venta: {dinero(producto.precio)}</Text>
              <Text style={[st.verdeTexto, { marginTop: 8 }]}>
                Ganancia: {dinero(producto.precio - producto.costo)}
              </Text>
              <Text style={st.verdeTexto}>
                Porcentaje: {porcentajeGanancia(producto.costo, producto.precio)}
              </Text>

              <Pressable
                style={[
                  st.boton,
                  producto.cantidad < 1 && { backgroundColor: '#8994A5' },
                ]}
                disabled={producto.cantidad < 1}
                onPress={() => registrarVenta(producto)}
              >
                <Text style={st.textoBoton}>
                  {producto.cantidad < 1 ? 'Sin existencias' : '🛒 Vender una unidad'}
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </>
    );
  };

  // REPORTES DEL DÍA
  const renderReportes = () => (
    <>
      <Text style={st.tituloPantalla}>📊 Reportes del día</Text>
      <Text style={st.descripcion}>
        Resumen actualizado de las ventas que realizas hoy.
      </Text>

      <View style={st.tarjetaResumen}>
        <Text style={st.texto}>📅 Fecha del reporte</Text>
        <Text style={[st.nombre, { marginTop: 7 }]}>{new Date().toLocaleDateString()}</Text>

        <Text style={[st.texto, { marginTop: 18 }]}>Total de ventas de hoy</Text>
        <Text style={st.valor}>{dinero(totalVentasDia)}</Text>

        <Text style={st.texto}>Operaciones realizadas: {ventasDelDia.length}</Text>
        <Text style={st.texto}>Unidades vendidas: {unidadesVendidasDia}</Text>

        <Text style={[st.texto, { marginTop: 15 }]}>Ganancia estimada de hoy</Text>
        <Text style={[st.valor, { color: colores.verdeTexto }]}>
          {dinero(gananciaTotalDia)}
        </Text>

        <Text style={st.texto}>Productos registrados: {productos.length}</Text>
        <Text style={st.texto}>Unidades disponibles: {totalUnidades}</Text>
        <Text style={st.texto}>
          Valor del inventario al costo: {dinero(valorInventario)}
        </Text>
      </View>

      <Text style={st.tituloSeccion}>Ventas realizadas hoy</Text>

      {ventasDelDia.length === 0 ? (
        <View style={st.vacio}>
          <Text style={{ fontSize: 32 }}>📊</Text>
          <Text style={[st.nombre, { marginTop: 8 }]}>Sin ventas todavía</Text>
          <Text style={st.texto}>
            Cuando registres ventas aparecerán aquí automáticamente.
          </Text>
        </View>
      ) : (
        [...ventasDelDia].reverse().map((venta) => (
          <View key={venta.id} style={st.tarjeta}>
            <Text style={st.nombre}>{venta.nombre}</Text>
            <Text style={st.texto}>Cantidad: {venta.cantidad}</Text>
            <Text style={st.texto}>Total: {dinero(venta.total)}</Text>
            <Text style={st.texto}>
              Ganancia estimada: {dinero(venta.ganancia)}
            </Text>
            <Text style={st.texto}>{venta.fecha}</Text>
          </View>
        ))
      )}
    </>
  );

  // MI PERFIL
  const renderPerfil = () => (
    <>
      <Text style={st.tituloPantalla}>👤 Mi perfil</Text>
      <Text style={st.descripcion}>
        Edita la información de tu negocio y configura la aplicación.
      </Text>

      <View style={[st.tarjeta, { alignItems: 'center', padding: 22 }]}>
        <View
          style={{
            width: 78,
            height: 78,
            borderRadius: 39,
            backgroundColor: colores.boton,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 25, fontWeight: '900' }}>
            LE
          </Text>
        </View>
        <Text style={st.nombre}>{nombreLibreria}</Text>
        <Text style={st.texto}>Administración del negocio</Text>
        <Text style={st.texto}>Productos: {productos.length}</Text>
        <Text style={st.texto}>Ventas registradas: {ventas.length}</Text>
      </View>

      <Text style={st.tituloSeccion}>Información de la librería</Text>

      <View style={st.tarjeta}>
        <Text style={st.etiquetaCampo}>Nombre de la librería</Text>
        <TextInput
          style={st.input}
          value={nombreLibreria}
          onChangeText={setNombreLibreria}
          placeholder="Nombre del negocio"
          placeholderTextColor={colores.secundario}
        />

        <Text style={st.etiquetaCampo}>Número de teléfono</Text>
        <TextInput
          style={st.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Escribe tu teléfono"
          placeholderTextColor={colores.secundario}
          keyboardType="phone-pad"
        />

        <Text style={st.etiquetaCampo}>Correo electrónico</Text>
        <TextInput
          style={st.input}
          value={correo}
          onChangeText={setCorreo}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={colores.secundario}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={st.boton} onPress={guardarPerfil}>
          <Text style={st.textoBoton}>Guardar información</Text>
        </Pressable>
      </View>

      <Text style={st.tituloSeccion}>Datos de inicio de sesión</Text>

      <View style={st.tarjeta}>
        <Text style={st.etiquetaCampo}>Nombre de usuario</Text>
        <TextInput
          style={st.input}
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Nombre de usuario"
          placeholderTextColor={colores.secundario}
          autoCapitalize="none"
        />

        <Text style={st.etiquetaCampo}>Contraseña de inicio de sesión</Text>
        <TextInput
          style={st.input}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Escribe una contraseña nueva"
          placeholderTextColor={colores.secundario}
          autoCapitalize="none"
        />

        <Text style={st.texto}>
          La contraseña se muestra aquí para que puedas consultarla y modificarla.
        </Text>

        <Pressable style={st.boton} onPress={guardarPerfil}>
          <Text style={st.textoBoton}>Guardar usuario y contraseña</Text>
        </Pressable>
      </View>

      <Text style={st.tituloSeccion}>Apariencia de la aplicación</Text>

      <View style={st.tarjeta}>
        <Text style={st.nombre}>
          {modoOscuro ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado'}
        </Text>
        <Text style={st.texto}>