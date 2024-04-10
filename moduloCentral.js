const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8765 });

class SistemaControlTrafico {

    constructor() {
        this.velocidad;
        this.posicion;
        this.RFID;

    }


    async conectar() {
        server.on('connection', (socket) => {
            console.log('Cliente conectado.');
        });
    }

    async mensajes() {
        /*await new Promise(resolve => setTimeout(resolve, 2000));*/
        server.on('connection', (socket) => {


            // Escuchar mensajes del cliente
            socket.on('message', (message) => {


                if (`${message}`.includes("Velocidad")) {
                    // Extraer el valor de velocidad y convertirlo a número
                    this.velocidad = parseFloat(`${message}`.split(": ")[1]);

                }
                if (`${message}`.includes("Posicion")) {
                    // Extraer el valor de posición
                    this.posicion = `${message}`.split(": ")[1];

                }
                if (`${message}`.includes("Detectado")) {
                    // Extraer el valor de RFID
                    this.RFID = `${message}`.split(": ")[1];

                }
                /*  console.log(`${message}`);*/


            });

        });
        while (true){
        await new Promise(resolve => setTimeout(resolve, 1000));
            sistemaControlTrafico.logicaSemaforo()}

    }

    async logicaSemaforo() {

        if (this.RFID === "Activo"&& this.velocidad !== null) {
            console.log("Velocidad:", this.velocidad);
            console.log("RFID:", this.RFID);
            console.log("Posición:", this.posicion);
            console.log("Color semáforo: Verde");
        } else if (this.posicion === "Activo" && this.RFID === "Inactivo" && this.velocidad !== null) {
            console.log("Velocidad:", this.velocidad);
            console.log("RFID:", this.RFID);
            console.log("Posición:", this.posicion);

            // Calcular tiempo en base a distancia y velocidad para pasar 20 vehículos
            let distancia = 0.5;  // Coloca tu valor de distancia aquí
            let tiempo_calculado = distancia / this.velocidad;
            console.log(`Color semáforo: Verde por ${tiempo_calculado} segundos`);
        } else if (this.posicion === "Inactivo" && this.RFID === "Inactivo" && this.velocidad !== null) {
            console.log("Velocidad:", this.velocidad);
            console.log("RFID:", this.RFID);
            console.log("Posición:", this.posicion);
            console.log("Color semáforo: Rojo");
        } else {
            console.log("Estado no reconocido");


        }



    }
}




const sistemaControlTrafico = new SistemaControlTrafico();


sistemaControlTrafico.conectar()

sistemaControlTrafico.mensajes()



