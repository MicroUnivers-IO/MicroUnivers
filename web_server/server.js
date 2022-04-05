import express from "express";
const PORT = 3000;
const server = express();

server.use(express.static("../client/dist/"));

server.listen(PORT, () => {
  console.log(`> Serveur démarré sur le port ${PORT} : http://localhost:${PORT}/`);
});