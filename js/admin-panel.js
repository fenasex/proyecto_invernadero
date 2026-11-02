function panelAdmin() {
    const usuarioActivo = JSON.parse(sessionStorage.getItem('usuario_activo'));

    return {
        usuarioActivo,
        usuariosLista: [...usuarios],
        accesos: JSON.parse(localStorage.getItem('accesos_app') || '[]'),
        sensoresCompartidos: JSON.parse(localStorage.getItem('sensores_compartidos_admin') || '[]'),
        cultivosCompartidos: JSON.parse(localStorage.getItem('cultivos_compartidos_admin') || '[]'),
        nombreNuevo: '',
        claveNueva: '',
        rolNuevo: 'usuario',
        mensaje: '',

        init() {
            window.addEventListener('storage', evento => {
                if (evento.key === 'usuarios_app') {
                    usuarios = JSON.parse(evento.newValue || '[]');
                    this.usuariosLista = [...usuarios];
                }
                if (evento.key === 'accesos_app') {
                    this.accesos = JSON.parse(evento.newValue || '[]');
                }
                if (evento.key === 'sensores_compartidos_admin') {
                    this.sensoresCompartidos = JSON.parse(evento.newValue || '[]');
                }
                if (evento.key === 'cultivos_compartidos_admin') {
                    this.cultivosCompartidos = JSON.parse(evento.newValue || '[]');
                }
            });
        },

        usuariosTotales() {
            return this.usuariosLista.length;
        },

        cultivosTotales() {
            const nombres = new Set(this.cultivosCompartidos.map(cultivo => cultivo.nombre.trim().toLowerCase()));
            this.usuariosLista.forEach(usuario => {
                (usuario.cultivos || []).forEach(cultivo => nombres.add(cultivo.nombre.trim().toLowerCase()));
            });
            return nombres.size;
        },

        sensoresTotales() {
            const nombres = new Set(this.sensoresCompartidos.map(sensor => sensor.nombre.trim().toLowerCase()));
            this.usuariosLista.forEach(usuario => {
                (usuario.sensores || []).forEach(sensor => nombres.add(sensor.nombre.trim().toLowerCase()));
            });
            return nombres.size;
        },

        rolUsuario(usuario) {
            return usuario.destino === 'vistasAdmin/admin.html' ? 'Administrador' : 'Usuario';
        },

        fechaAcceso(acceso) {
            const fecha = new Date(acceso.fecha);
            return Number.isNaN(fecha.getTime()) ? acceso.fecha : fecha.toLocaleString('es-CL');
        },

        crearUsuario() {
            if (!this.usuarioActivo || this.usuarioActivo.destino !== 'vistasAdmin/admin.html') {
                this.mensaje = 'Solo los administradores pueden crear usuarios.';
                return;
            }

            const nombre = this.nombreNuevo.trim();
            const clave = this.claveNueva.trim();
            if (!nombre || !clave) {
                this.mensaje = 'Completa el nombre y la contraseña.';
                return;
            }

            if (usuarios.some(usuario => usuario.nombreUsuario.toLowerCase() === nombre.toLowerCase())) {
                this.mensaje = 'Ese nombre de usuario ya está registrado.';
                return;
            }

            const nuevoUsuario = {
                id: Math.max(0, ...usuarios.map(usuario => Number(usuario.id) || 0)) + 1,
                nombreUsuario: nombre,
                clave,
                destino: this.rolNuevo === 'administrador'
                    ? 'vistasAdmin/admin.html'
                    : 'vistasUser/inicio_usuario.html',
                cultivos: [],
                sensores: []
            };

            usuarios = [...usuarios, nuevoUsuario];
            guardarUsuariosEnStorage();
            this.usuariosLista = [...usuarios];
            this.nombreNuevo = '';
            this.claveNueva = '';
            this.rolNuevo = 'usuario';
            this.mensaje = `Se creó la cuenta de ${nombre}.`;
        },

        eliminarUsuario(usuario) {
            if (!this.usuarioActivo || this.usuarioActivo.destino !== 'vistasAdmin/admin.html') {
                this.mensaje = 'Solo los administradores pueden eliminar usuarios.';
                return;
            }

            if (usuario.id === this.usuarioActivo.id &&
                usuario.nombreUsuario === this.usuarioActivo.nombreUsuario) {
                this.mensaje = 'No puedes eliminar la cuenta con la que has iniciado sesión.';
                return;
            }

            const administradores = usuarios.filter(cuenta =>
                cuenta.destino === 'vistasAdmin/admin.html'
            );
            if (usuario.destino === 'vistasAdmin/admin.html' && administradores.length <= 1) {
                this.mensaje = 'Debe quedar al menos un administrador registrado.';
                return;
            }

            if (!window.confirm(`¿Eliminar la cuenta de ${usuario.nombreUsuario}?`)) {
                return;
            }

            usuarios = usuarios.filter(cuenta =>
                !(cuenta.id === usuario.id && cuenta.nombreUsuario === usuario.nombreUsuario)
            );
            guardarUsuariosEnStorage();
            this.usuariosLista = [...usuarios];

            this.accesos = this.accesos.filter(acceso =>
                acceso.nombreUsuario.toLowerCase() !== usuario.nombreUsuario.toLowerCase()
            );
            localStorage.setItem('accesos_app', JSON.stringify(this.accesos));
            this.mensaje = `Se eliminó la cuenta de ${usuario.nombreUsuario}.`;
        }
    };
}
