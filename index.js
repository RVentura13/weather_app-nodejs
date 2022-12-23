import * as dotenv from "dotenv";
import colors from "colors";
dotenv.config();

import {
  inquirerMenu,
  leerInput,
  listarLugares,
  pause,
} from "./helpers/inquirer.js";
import Busquedas from "./models/busqueda.js";

console.log(process.env);

const main = async () => {
  let option;
  const busqueda = new Busquedas();

  let temperatura;

  do {
    option = await inquirerMenu();

    console.log();

    switch (option) {
      case 1:
        //mostrar mensaje
        const lugar = await leerInput("Ciudad: ");

        //ingresar lugar
        const lugares = await busqueda.ciudad(lugar);

        //seleccionar lugar
        const idSeleccionado = await listarLugares(lugares);
        if (idSeleccionado === "0") continue;

        const lugarSeleccionado = lugares.find(
          (lugar) => lugar.id === idSeleccionado
        );

        console.clear();
        console.log();
        console.log();
        console.log();
        console.log("===========================".green);
        console.log(" Cargando la información ".white);
        console.log("===========================\n".green);

        //traer el clima del lugar indicado
        const clima = await busqueda.climaLugar(
          lugarSeleccionado.lat,
          lugarSeleccionado.lng
        );

        //Guardar en DB
        busqueda.agregarHistorial(lugarSeleccionado.nombre, clima.temp);

        //mostrar resultados
        console.clear();
        console.log("=========================".green);
        console.log("\nInformación de la ciudad\n".green);
        console.log("=========================\n".green);
        console.log("Ciudad: ", lugarSeleccionado.nombre.green);
        console.log("Lat: ", lugarSeleccionado.lat);
        console.log("Lng: ", lugarSeleccionado.lng);
        console.log("Temperatura: ", `${clima.temp}°C`.green);
        console.log("Mínima: ", `${clima.min}°C`.green);
        console.log("Máxima: ", `${clima.max}°C`.green);
        console.log("Cielo: ", clima.cielo.blue);

        temperatura = clima.temp;

        break;

      case 2:
        busqueda.historialCapitalizado.forEach((lugar = "", i) => {
          const idx = `${i + 1}.`.green;
          console.log(
            `${idx} ${lugar.lugar}:`,
            `${lugar.temperatura}°C`.green,
            `${lugar.fecha}`.white
          );
        });
        break;
    }

    if (option !== 0) await pause();
    console.clear();
  } while (option !== 0);
};

main();
