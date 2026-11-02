const SENSORES_COMPARTIDOS_KEY = 'sensores_compartidos_admin';

function gestorSensores() {
    const usuarioActivo = JSON.parse(sessionStorage.getItem('usuario_activo'));

    return {
        usuarioActivo,
        sensores: usuarioActivo && Array.isArray(usuarioActivo.sensores) ? usuarioActivo.sensores : [],
        sensoresCompartidos: JSON.parse(localStorage.getItem(SENSORES_COMPARTIDOS_KEY) || '[]'),
        esAdministrador: usuarioActivo && usuarioActivo.destino === 'vistasAdmin/admin.html',
        mostrarMenu: false,
        busqueda: '',
        mensaje: '',

        init() {
            window.addEventListener('storage', evento => {
                if (evento.key === SENSORES_COMPARTIDOS_KEY) {
                    this.sensoresCompartidos = JSON.parse(evento.newValue || '[]');
                }

                if (evento.key === 'usuarios_app') {
                    usuarios = JSON.parse(evento.newValue || '[]');
                    const usuarioActualizado = usuarios.find(usuario =>
                        usuario.id === this.usuarioActivo.id &&
                        usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
                    );

                    if (usuarioActualizado) {
                        this.usuarioActivo = usuarioActualizado;
                        this.sensores = usuarioActualizado.sensores || [];
                    }
                }
            });
        },

        sensoresVisibles() {
            const sensoresUnicos = new Map();

            [...this.sensores, ...this.sensoresCompartidos].forEach(sensor => {
                const clave = sensor.nombre.trim().toLowerCase();
                if (!sensoresUnicos.has(clave)) {
                    sensoresUnicos.set(clave, sensor);
                }
            });

            return [...sensoresUnicos.values()];
        },

        sensoresFiltrados() {
            const busqueda = this.busqueda.trim().toLowerCase();

            return this.sensoresVisibles().filter(sensor => {
                const detalle = this.detalleSensor(sensor);
                return `${sensor.nombre} ${detalle.descripcion || ''} ${detalle.tipo || ''}`
                    .toLowerCase()
                    .includes(busqueda);
            });
        },

        sensoresDisponibles(tipo) {
            return catalogoSensores.filter(sensor => sensor.tipo === tipo);
        },

        detalleSensor(sensor) {
            return catalogoSensores.find(disponible => disponible.nombre === sensor.nombre) || sensor;
        },

        tieneSensor(sensor) {
            return this.sensores.some(asignado => asignado.nombre === sensor.nombre);
        },

        estaCompartido(sensor) {
            return this.sensoresCompartidos.some(compartido =>
                compartido.nombre.trim().toLowerCase() === sensor.nombre.trim().toLowerCase()
            );
        },

        ultimaLectura(sensor) {
            return datosSensor
                .filter(dato => dato.sensorNombre === sensor.nombre)
                .reduce((ultima, dato) => !ultima || dato.fecha > ultima.fecha ? dato : ultima, null);
        },

        guardarSensores(sensoresActualizados) {
            const usuarioGuardado = usuarios.find(usuario =>
                usuario.id === this.usuarioActivo.id &&
                usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
            );

            if (!usuarioGuardado) {
                this.mensaje = 'No se encontró el usuario para guardar los cambios.';
                return false;
            }

            usuarioGuardado.sensores = sensoresActualizados;
            guardarUsuariosEnStorage();
            this.usuarioActivo = usuarioGuardado;
            this.sensores = usuarioGuardado.sensores;
            sessionStorage.setItem('usuario_activo', JSON.stringify(usuarioGuardado));
            return true;
        },

        agregarSensor(sensor) {
            if (!this.esAdministrador) {
                this.mensaje = 'Solo los administradores pueden añadir sensores.';
                return;
            }

            if (this.estaCompartido(sensor)) {
                this.mensaje = 'Este sensor ya está compartido con los usuarios.';
                return;
            }

            if (!this.tieneSensor(sensor) && !this.guardarSensores([...this.sensores, { ...sensor }])) {
                return;
            }

            this.sensoresCompartidos = [...this.sensoresCompartidos, { ...sensor }];
            localStorage.setItem(SENSORES_COMPARTIDOS_KEY, JSON.stringify(this.sensoresCompartidos));
            this.mensaje = `Se añadió ${sensor.nombre}. Ahora está visible para los usuarios.`;
            this.mostrarMenu = false;
        },

        eliminarSensor(nombre) {
            if (!this.esAdministrador) {
                this.mensaje = 'Solo los administradores pueden eliminar sensores.';
                return;
            }

            const nombreNormalizado = nombre.trim().toLowerCase();
            const sensoresCompartidosActualizados = this.sensoresCompartidos.filter(sensor =>
                sensor.nombre.trim().toLowerCase() !== nombreNormalizado
            );
            const sensorExiste = usuarios.some(usuario =>
                Array.isArray(usuario.sensores) && usuario.sensores.some(sensor =>
                    sensor.nombre.trim().toLowerCase() === nombreNormalizado
                )
            ) || sensoresCompartidosActualizados.length !== this.sensoresCompartidos.length;

            if (!sensorExiste) {
                this.mensaje = 'No se encontró el sensor que quieres eliminar.';
                return;
            }

            usuarios = usuarios.map(usuario => ({
                ...usuario,
                sensores: (usuario.sensores || []).filter(sensor =>
                    sensor.nombre.trim().toLowerCase() !== nombreNormalizado
                )
            }));
            guardarUsuariosEnStorage();

            const usuarioActualizado = usuarios.find(usuario =>
                usuario.id === this.usuarioActivo.id &&
                usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
            );
            this.usuarioActivo = usuarioActualizado;
            this.sensores = usuarioActualizado.sensores;
            sessionStorage.setItem('usuario_activo', JSON.stringify(usuarioActualizado));
            this.sensoresCompartidos = sensoresCompartidosActualizados;
            localStorage.setItem(SENSORES_COMPARTIDOS_KEY, JSON.stringify(sensoresCompartidosActualizados));
            this.mensaje = `Se eliminó ${nombre}.`;
        }
    };
}
