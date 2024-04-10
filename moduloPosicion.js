const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8765');

class SensorPosicion {
    constructor() {
        this.activo;
        this.semaphore = false;
    }

    async iniciarConexionModulos() {
        socket.on('open', () => {
            console.log('Conectado al servidor.');
        });
    }

    //patron semaforo
    async adquirirSemaphore() {
        return new Promise(resolve => {
            const wait = () => {
                if (!this.semaphore) {
                    this.semaphore = true;
                    console.log('Semaphore adquirido.');
                    resolve();
                } else {
                    setTimeout(wait, 100);
                }
            };
            wait();
        });
    }

    liberarSemaphore() {
        this.semaphore = false;
        console.log('Semaphore liberado.');
    }
     
    //patron semaforo
    async sensorPosicion() {
        await this.adquirirSemaphore();
        try {
            this.activo = !this.activo;
            socket.send(`Posicion:${this.activo ? ' Activo' : ' Inactivo'}`);
            console.log(`--- Posicion${this.activo ? ' Activo' : ' Inactivo'} ---`);
        } finally {
            this.liberarSemaphore();
        }
    }

    async sensorRFID() {
        await this.adquirirSemaphore();
        try {
            socket.send(`Detectado:${this.activo ? ' Activo' : ' Inactivo'}`);
            console.log(`--- Detectado${this.activo ? ' Activo' : ' Inactivo'} ---`);
        } finally {
            this.liberarSemaphore();
        }
    }

    async sensorVelocidad() {
        await this.adquirirSemaphore();
        try {
            const velocidad = Math.random() * (200 - 0) + 0;
            socket.send(`Velocidad: ${velocidad}`);
            console.log(`--- Velocidad ${velocidad} ---`);
        } finally {
            this.liberarSemaphore();
        }
    }

    async enviarMensajes() {
        setInterval(async () => {
            await this.sensorPosicion();
            await this.sensorRFID();
            await this.sensorVelocidad();
        }, 7000);
    }
}

const sensorPosicion = new SensorPosicion();

sensorPosicion.iniciarConexionModulos();
sensorPosicion.enviarMensajes();
