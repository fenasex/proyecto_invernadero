const CULTIVOS_COMPARTIDOS_KEY = 'cultivos_compartidos_admin';

function gestorCultivos() {
    const usuarioActivo = JSON.parse(sessionStorage.getItem('usuario_activo'));

    return {
        usuarioActivo,
        cultivosUsuario: usuarioActivo && Array.isArray(usuarioActivo.cultivos) ? usuarioActivo.cultivos : [],
        cultivosCompartidos: JSON.parse(localStorage.getItem(CULTIVOS_COMPARTIDOS_KEY) || '[]'),
        esAdministrador: usuarioActivo && usuarioActivo.destino === 'vistasAdmin/admin.html',
        mostrarMenu: false,
        busqueda: '',
        mensaje: '',

        init() {
            window.addEventListener('storage', evento => {
                if (evento.key === CULTIVOS_COMPARTIDOS_KEY) {
                    this.cultivosCompartidos = JSON.parse(evento.newValue || '[]');
                }

                if (evento.key === 'usuarios_app') {
                    usuarios = JSON.parse(evento.newValue || '[]');
                    const usuarioActualizado = usuarios.find(usuario =>
                        usuario.id === this.usuarioActivo.id &&
                        usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
                    );

                    if (usuarioActualizado) {
                        this.usuarioActivo = usuarioActualizado;
                        this.cultivosUsuario = usuarioActualizado.cultivos || [];
                    }
                }
            });
        },

        cultivosVisibles() {
            const cultivosUnicos = new Map();

            [...this.cultivosUsuario, ...this.cultivosCompartidos].forEach(cultivo => {
                const clave = cultivo.nombre.trim().toLowerCase();
                if (!cultivosUnicos.has(clave)) {
                    cultivosUnicos.set(clave, cultivo);
                }
            });

            return [...cultivosUnicos.values()];
        },

        cultivosFiltrados() {
            const busqueda = this.busqueda.trim().toLowerCase();

            return this.cultivosVisibles().filter(cultivo =>
                `${cultivo.nombre} ${cultivo.tipo}`.toLowerCase().includes(busqueda)
            );
        },

        tiposDisponibles() {
            return [...new Set(cultivos.map(cultivo => cultivo.tipo))];
        },

        cultivosDisponibles(tipo) {
            return cultivos.filter(cultivo => cultivo.tipo === tipo);
        },

        tieneCultivo(cultivo) {
            return this.cultivosUsuario.some(asignado =>
                asignado.nombre.trim().toLowerCase() === cultivo.nombre.trim().toLowerCase()
            );
        },

        estaCompartido(cultivo) {
            return this.cultivosCompartidos.some(compartido =>
                compartido.nombre.trim().toLowerCase() === cultivo.nombre.trim().toLowerCase()
            );
        },

        guardarCultivos(cultivosActualizados) {
            const usuarioGuardado = usuarios.find(usuario =>
                usuario.id === this.usuarioActivo.id &&
                usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
            );

            if (!usuarioGuardado) {
                this.mensaje = 'No se encontró el usuario para guardar los cambios.';
                return false;
            }

            usuarioGuardado.cultivos = cultivosActualizados;
            guardarUsuariosEnStorage();
            this.usuarioActivo = usuarioGuardado;
            this.cultivosUsuario = usuarioGuardado.cultivos;
            sessionStorage.setItem('usuario_activo', JSON.stringify(usuarioGuardado));
            return true;
        },

        agregarCultivo(cultivo) {
            if (!this.esAdministrador) {
                this.mensaje = 'Solo los administradores pueden añadir cultivos.';
                return;
            }

            if (this.estaCompartido(cultivo)) {
                this.mensaje = 'Este cultivo ya está compartido con los usuarios.';
                return;
            }

            if (!this.tieneCultivo(cultivo)) {
                if (!this.guardarCultivos([...this.cultivosUsuario, { ...cultivo }])) {
                    return;
                }
            }

            this.cultivosCompartidos = [...this.cultivosCompartidos, { ...cultivo }];
            localStorage.setItem(CULTIVOS_COMPARTIDOS_KEY, JSON.stringify(this.cultivosCompartidos));
            this.mensaje = `Se añadió ${cultivo.nombre}. Ahora está visible para los usuarios.`;
            this.mostrarMenu = false;
        },

        eliminarCultivo(nombre) {
            if (!this.esAdministrador) {
                this.mensaje = 'Solo los administradores pueden eliminar cultivos.';
                return;
            }

            const nombreNormalizado = nombre.trim().toLowerCase();
            const compartidosActualizados = this.cultivosCompartidos.filter(cultivo =>
                cultivo.nombre.trim().toLowerCase() !== nombreNormalizado
            );
            const existe = usuarios.some(usuario =>
                Array.isArray(usuario.cultivos) && usuario.cultivos.some(cultivo =>
                    cultivo.nombre.trim().toLowerCase() === nombreNormalizado
                )
            ) || compartidosActualizados.length !== this.cultivosCompartidos.length;

            if (!existe) {
                this.mensaje = 'No se encontró el cultivo que quieres eliminar.';
                return;
            }

            usuarios = usuarios.map(usuario => ({
                ...usuario,
                cultivos: (usuario.cultivos || []).filter(cultivo =>
                    cultivo.nombre.trim().toLowerCase() !== nombreNormalizado
                )
            }));
            guardarUsuariosEnStorage();

            const usuarioActualizado = usuarios.find(usuario =>
                usuario.id === this.usuarioActivo.id &&
                usuario.nombreUsuario === this.usuarioActivo.nombreUsuario
            );
            if (!usuarioActualizado) {
                this.mensaje = 'No se encontró la cuenta administradora para actualizar los cambios.';
                return;
            }

            this.usuarioActivo = usuarioActualizado;
            this.cultivosUsuario = usuarioActualizado.cultivos;
            sessionStorage.setItem('usuario_activo', JSON.stringify(usuarioActualizado));
            this.cultivosCompartidos = compartidosActualizados;
            localStorage.setItem(CULTIVOS_COMPARTIDOS_KEY, JSON.stringify(compartidosActualizados));
            this.mensaje = `Se eliminó ${nombre}.`;
        }
    };
}
