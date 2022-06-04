async function authRoutes(server: any, options: any) {

    server.get('/auth', function (request: any, reply: any) {
        reply.view("auth.eta", { title: "MicroUnivers - Authentification", username: "José" });
    });
    
}

export default authRoutes;