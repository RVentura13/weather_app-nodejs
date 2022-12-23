import colors from "colors";
import inquirer from "inquirer";

const preguntas = [
  {
    type: "list",
    name: "option",
    message: "¿Que desea hacer? ",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial de busqueda`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();

  console.log("=======================".green);
  console.log(" Seleccione una opción".white);
  console.log("=======================\n".green);

  const { option } = await inquirer.prompt(preguntas);

  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `\nPresione ${"ENTER".green} para continuar\n`,
    },
  ];

  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "descripcion",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { descripcion } = await inquirer.prompt(question);
  return descripcion;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccionar el lugar",
      choices,
    },
  ];
  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const mostrarListaCheckList = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${idx} ${tarea.descripcion}`,
      checked: tarea.completadaEl ? true : false,
    };
  });

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Selecciones",
      choices,
    },
  ];
  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

export {
  inquirerMenu,
  pause,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListaCheckList,
};
