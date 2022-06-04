// Load env vars
import 'dotenv/config';
// Libs
import Fastify from 'fastify'
import pointOfView from 'point-of-view';
import fastifyCookie from '@fastify/cookie';
import FastifySessionPlugin from '@fastify/session';
import fastifyStatic from '@fastify/static';
import * as Eta from "eta";

import { GameServer } from "./game_server/GameServer";

/*
import connectRedis from "connect-redis";
import { createClient } from 'redis';

const RedisStore = connectRedis(FastifySessionPlugin as any);
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
*/

// Création du serveur web
const server = Fastify({ logger: true });

// Cookies
server.register(fastifyCookie);
// Session
server.register(FastifySessionPlugin as any, {
	secret: process.env.SESSION_SECRET_KEY
	// store: new RedisStore({ client: redisClient }) // Pour stocker les sessions avec Redis : pas de fuite mémoire, fait pour de la production
});

// Déclaration de pointOfView (template engine manager) et du template engine "Eta"
server.register(pointOfView, {
	engine: { eta: Eta },
	root: (__dirname + "/../src/server/views/") // Chemin bizarre car le bundle est dans dist
});

// Fichiers statiques
server.register(fastifyStatic, {
	root: (__dirname + "/../src/client/static/"),
	prefix: '/static/'
});

// Imporation et déclaration des Routes
import authRoutes from './routes/authRoutes';
import mainRoutes from './routes/mainRoutes';
server.register(authRoutes);
server.register(mainRoutes);


// Lancement du serveur
server.listen({
	port: 3000
}, (err, address) => {
	if (err) {
		server.log.error(err, address);
		process.exit(1);
	}
});


// Serveur de jeu
let gameServer = new GameServer("GameServer_Dev", 7777 /*,{
    certPath: "",
    keyPath: "",
}*/);

gameServer.createLobby("/dev1", 50);