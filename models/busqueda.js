import fs from "fs";
import axios from "axios";

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    //TODO: leer DB si existe
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((l) => {
      let palabras = l.lugar.split(" ");

      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      palabras = palabras.join(" ");
      let nHistorial = {
        lugar: palabras,
        temperatura: l.temperatura,
        fecha: l.fecha,
      };

      return nHistorial;
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    // peticiones http

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name_es,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        cielo: weather[0].description,
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugarBuscado, temperaturaBuscada) {
    if (this.historial.includes(lugarBuscado.toLocaleLowerCase())) {
      return;
    }

    this.historial = this.historial.splice(0, 4);

    this.historial.unshift({
      lugar: lugarBuscado.toLocaleLowerCase(),
      temperatura: temperaturaBuscada,
      fecha: new Date().toLocaleString("es-ES"),
    });

    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });

    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

export default Busquedas;
