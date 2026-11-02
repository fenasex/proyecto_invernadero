


// Datos de los cultivos
const cultivos = [
  { id: 1, nombre: "tomate pomarola", tipo: "fruta", fechacultivo: "2026-07-18", estacional: true },
  { id: 2, nombre: "pepino", tipo: "verdura", fechacultivo: "2025-08-20", estacional: false },
  { id: 3, nombre: "habas", tipo: "verdura", fechacultivo: "2026-06-10", estacional: true },
  { id: 4, nombre: "manzana", tipo: "fruta", fechacultivo: "2024-09-15", estacional: false }
];


//=================== =================== =================== =================== ===================//


// Catálogo de sensores disponibles
const catalogoSensores = [
  { nombre: "temperatura_1", descripcion: "Temperatura del invernadero", unidad: "°C", tipo: "Ambientales" },
  { nombre: "humedad_1", descripcion: "Humedad del invernadero", unidad: "%", tipo: "Ambientales" },
  { nombre: "luminosidad_1", descripcion: "Luminosidad del invernadero", unidad: "lux", tipo: "Ambientales" },
  { nombre: "humedad_suelo_1", descripcion: "Humedad del suelo", unidad: "%", tipo: "Suelo y sustrato" },
  { nombre: "temperatura_suelo_1", descripcion: "Temperatura del suelo", unidad: "°C", tipo: "Suelo y sustrato" },
  { nombre: "pH_sustrato_1", descripcion: "pH del sustrato", unidad: "pH", tipo: "Suelo y sustrato" }
];

// Sensores asignados por defecto a los usuarios existentes
const sensores = catalogoSensores.slice(0, 2);


//=================== =================== =================== =================== ===================//


//datos del sensor 
//dos muestras por sensor 
const datosSensor = [
{fecha: "2026-09-08_08:00", sensorNombre: "temperatura_1", valor: 20.0},
{fecha: "2026-09-08_20:00", sensorNombre: "temperatura_1", valor: 22.00},
{fecha: "2026-09-08_09:00", sensorNombre: "humedad_1", valor: 55},
{fecha: "2026-09-08_21:00", sensorNombre: "humedad_1", valor: 60},
{fecha: "2026-09-08_10:00", sensorNombre: "luminosidad_1", valor: 780},
{fecha: "2026-09-08_18:00", sensorNombre: "luminosidad_1", valor: 420},
{fecha: "2026-09-08_10:00", sensorNombre: "humedad_suelo_1", valor: 48},
{fecha: "2026-09-08_18:00", sensorNombre: "humedad_suelo_1", valor: 52},
{fecha: "2026-09-08_10:00", sensorNombre: "temperatura_suelo_1", valor: 18.5},
{fecha: "2026-09-08_18:00", sensorNombre: "temperatura_suelo_1", valor: 19.2},
{fecha: "2026-09-08_10:00", sensorNombre: "pH_sustrato_1", valor: 6.2},
{fecha: "2026-09-08_18:00", sensorNombre: "pH_sustrato_1", valor: 6.4},
];


//=================== usuarios =================== =================== ===================//


//usuarios que se verán en la pagina del administrador
let usuarios = [
{id: 1,
nombreUsuario: "Ftoloza",
clave: "1111",
destino: "vistasAdmin/admin.html", //cambiado

cultivos: cultivos,
sensores: sensores,
},

//------------------- ------------------- ------------------- //

{
id :2,
nombreUsuario: "AVega",
clave: "2222",
destino: "vistasUser/inicio_usuario.html", //cambiado


cultivos: [
{id:2, nombre: "Manzana", tipo: "fruta", fechacultivo: "2024-09-14", estacional: false}
],

sensores: [
{nombre: "temperatura_1", descripción: "temperatura invernadero sur", unidad: "C"}
]},

//------------------- ------------------- ------------------- //

{


    id:3,
    nombreUsuario: "hola", clave: "3333",
    destino: "vistasAdmin/admin.html", //cambiado

    cultivos: cultivos,
    sensores: sensores,

}

];


//=================== ESTO ES PARA guardar datos de usuario  =================== ===================//

//revisamos si existen usuarios guardados en la memoria del navegador
const usuariosGuardados = localStorage.getItem('usuarios_app');

if (usuariosGuardados) {
    //si existen, reemplazamos a usuarios
    usuarios = JSON.parse(usuariosGuardados);
}

   //guarda los cambios en el localstorage del registro
function guardarUsuariosEnStorage() {
    localStorage.setItem('usuarios_app', JSON.stringify(usuarios));
}

//porsiacaso eso de JSON.stingfy y JSON.parse q sale a veces es eso de que pasa de objeto a texto y al revés, porq así le da la ganta manejar los objetos a la web
//según tengo entendido es proque como tal nopuuede manejar objetos, pero si Strings, entonces los cambiamos de tipo tdo el rato

//=================== =================== =================== =================== ===================//
