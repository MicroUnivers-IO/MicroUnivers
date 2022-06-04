async function mainRoutes(server: any, options: any) {

    server.get('/', function (request: any, reply: any) {
        reply.view("home.eta", { title: "MicroUnivers - Accueil" });
    });
    
}

export default mainRoutes;