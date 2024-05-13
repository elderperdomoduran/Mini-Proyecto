import http from "node:http";
import {
  getUsuarios,
  importFromFile,
  index,
  saveToFile,
} from "./controller.js";

const server = http.createServer(async (request, response) => {
  const url = request.url;
  const method = request.method;

  if (method === "GET") {
    switch (url) {
      case "/":
        index(response);
        break;

      case "/api/usuarios":
        getUsuarios(response);
        break;

      case "/api/usuarios/export":
        saveToFile(response);
        break;

      case "/api/usuarios/import":
        importFromFile(response);
        break;

      default:
        response.end("no se encontro ruta");
        break;
    }
  }
});

server.listen(5000, () =>
console.log("Servidor Ejecutandose en http://localhost:5000")
);
