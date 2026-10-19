


// Datos de los cultivos
const cultivos = [
  { id: 1, nombre: "tomate pomarola", tipo: "fruta", fechacultivo: "2026-07-18", estacional: true },
  { id: 2, nombre: "pepino", tipo: "verdura", fechacultivo: "2025-08-20", estacional: false },
  { id: 3, nombre: "habas", tipo: "verdura", fechacultivo: "2026-06-10", estacional: true },
  { id: 4, nombre: "manzana", tipo: "fruta", fechacultivo: "2024-09-15", estacional: false }
];


//=================== =================== =================== =================== ===================//


// Sensores del usuario
const sensores = [
  { nombre: "temperatura_1", descripcion: "temperatura del invernadero", unidad: "Celsius" },
  { nombre: "humedad_1", descripcion: "humedad del invernadero", unidad: "%" }
];


//=================== =================== =================== =================== ===================//


//datos del sensor 
//dos muestras por sensor 
const datosSensor = [
{fecha: "2026-09-08_08:00", sensorNombre: "temperatura_1", valor: 20.0},
{fecha: "2026-09-08_20:00", sensorNombre: "temperatura_1", valor: 22.00},
{fecha: "2026-09-08_09:00", sensorNombre: "humedad_1", valor: 55},
{fecha: "2026-09-08_21:00", sensorNombre: "humedad_1", valor: 60},
];


//=================== =================== =================== =================== ===================//


// usuario que se verán en la pagina del administrados
const usuarios = [
{id: 1,
nombreUsuario: "Ftoloza",
clave: "1111",                    // NUEVO
destino: "admin.html",             // NUEVO

cultivos: cultivos,
sensores: sensores,
},

//------------------- ------------------- ------------------- //

{
id :2,
nombreUsuario: "AVega",
clave: "2222",                    // NUEVO
destino: "inicio_usuario.html",   // NUEVO


cultivos: [
{id:2, nombre: "Manzana", tipo: "fruta", fechacultivo: "2024-09-14", estacional: false}
],

sensores: [
{nombre: "temperatura_1", descripción: "temperatura invernadero sur", unidad: "C"}
]},

//------------------- ------------------- ------------------- //

{
  //yo tambn queria estar

    id:3,
    nombreUsuario: "hola", clave: "3333",
    destino: "admin.html",

    cultivos: cultivos,
    sensores: sensores,

}

];


//=================== =================== =================== =================== ===================//


