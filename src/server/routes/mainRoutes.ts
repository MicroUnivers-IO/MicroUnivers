import { FastifyReply, FastifyRequest } from "fastify";
import { encrypt } from "../../lib/crypt";
import { Lobby } from "../game_server/Lobby";
import { UserData } from "../models/User";
import { gameServer } from "../Server";
import { authService } from "./authRoutes";

async function mainRoutes(server: any, options: any) {

    server.get('/', getHomeController);

    server.get('/play', { preHandler: authService }, getPlayController);

    server.get('/guestServs', getGuestServsController);

    server.post('/getServToken', { preHandler: authService }, postJoinservController);

}

export default mainRoutes;


function getHomeController(request: FastifyRequest, reply: FastifyReply): any {
    const userdata = request.session.get('userdata');
    reply.view('home.eta', { userdata: userdata });
}

function getGuestServsController(request: FastifyRequest, reply: FastifyReply) {
    reply.view('gamePages/guestServs.eta', { lobbies: gameServer.getLobbies(true) });
}

function getPlayController(request: FastifyRequest, reply: FastifyReply): any {
    reply.view('gamePages/gameHome.eta', { lobbies: gameServer.getLobbies() });
}

function postJoinservController(request: FastifyRequest, reply: FastifyReply): any {
    const data: any = request.body;
    if (!data) reply.send('ERROR');

    console.log(data.lobbyUrl);
    const url = data.lobbyUrl;

    let cookie = null;
    const lobbies = gameServer.getLobbies();

    for(let i =0; i < lobbies.length; ++i) {
        console.log(lobbies[i]);
        if (lobbies[i].url == url) {
            console.log("oui !");
            const userdata: UserData = request.session.get('userdata');
            console.log("oui ! 2", userdata);

            cookie = encrypt(JSON.stringify({
                userId: userdata.userId,
                username: userdata.username
            }), lobbies[i].secret, );
            
            console.log("oui ! 3", cookie);
        }
    }
    
    if(cookie != null) {
        reply.code(200);
        reply.send({ servToken: cookie });
    } else {
        reply.code(404);
        reply.send({ error: "An error occured." });
    }


}