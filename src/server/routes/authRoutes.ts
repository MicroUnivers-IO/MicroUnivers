import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { matchPass } from "../../lib/crypt";
import { createUser, existingMail, existingUsername, getUser, RegisterInfos } from "../models/User";
import Joi from "joi";

// Config
import { EMAIL_MAXL, EMAIL_MINL, PASSWORD_MAXL, PASSWORD_MINL, USERNAME_MAXL, USERNAME_MINL } from "../config/config";

async function authRoutes(server: FastifyInstance, options: any) {

    server.get('/auth', { preHandler: unauthService }, getAuthController);

    server.post('/auth', { preHandler: unauthService }, postAuthController);

    server.get('/profil', { preHandler: authService }, getProfilController);

    server.get('/disconnect', anyDisconnectController);

    server.get('/register', { preHandler: unauthService }, getRegisterController);

    server.post('/register', { preHandler: unauthService }, postRegisterController);

}

export default authRoutes;

/* --------------- Auth Service --------------- */

// Redirect to auth page / account validation page if not logged
export function authService(request: FastifyRequest, reply: FastifyReply, done: any): any {
    if (!request.session.get('userData')) {
        reply.redirect('auth');
    }
    // If not verified..
    done();
}

// Redirect to profil if logged
export function unauthService(request: FastifyRequest, reply: FastifyReply, done: any) {
    if (request.session.get('userData')) {
        reply.redirect('profil');
    }
    done();
}


/* --------------- Profil controllers --------------- */

function getProfilController(request: FastifyRequest, reply: FastifyReply): any {
    const userdata: object = request.session.get('userData');
    reply.view("authPages/profil.eta", { userdata: userdata });
}
/* --------------- Register controllers --------------- */

function getRegisterController(request: FastifyRequest, reply: FastifyReply): any {
    reply.view("authPages/register.eta");
}

async function postRegisterController(request: FastifyRequest, reply: FastifyReply): Promise<any> {

    const registerInfos = request.body as RegisterInfos;

    const validation = registerSchema.validate(registerInfos);
    if (validation.error) {
        return reply.view("authPages/register.eta", { formError: validation.error.message });
    }

    // vérification mail / utilisateur inexistant
    const errors = [];
    if(await existingMail(registerInfos.email)) errors.push("Adresse email déjà utilisée.");
    if(await existingUsername(registerInfos.username)) errors.push("Nom d'utilisateur déjà utilisé.");

    if(errors.length > 0) {
        return reply.view("authPages/register.eta", { formError: errors });
    }

    const verifyToken = await createUser(registerInfos);
    if(!verifyToken) {
        return reply.view("error.eta", { error: 'Un problème est survenu lors de l\'inscription.' });
    } else {
        return reply.redirect("auth");
    }
}

/* --------------- Auth controllers --------------- */

async function postAuthController(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {

        const data: any = request.body;

        const validation = authSchema.validate(request.body);
        // Vérifications que les champs soient bien renseignés
        if (validation.error) {
            return reply.view("authPages/auth.eta", { formError: validation.error.message });
        }

        const userData = await getUser(data.username);

        // L'utilisateur n'existe pas
        if (!userData) {
            return reply.view("authPages/auth.eta", { formError: "Combinaison utilisateur & mot de passe inexistant." });
        }

        // Le mot de passe n'est pas valide
        if (!matchPass(userData.hashPass, data.password)) {
            return reply.view("authPages/auth.eta", { formError: "Combinaison utilisateur & mot de passe inexistant." });
        }

        // @ts-ignore
        delete userData.hashPass;
        request.session.set('userData', userData);
        request.session.save()

        // Valider
        return reply.redirect('/profil');
    } catch (e) {
        console.error('Post Auth Controller :', e);
        reply.send('Une erreur est survenue...');
    }

}

function getAuthController(request: FastifyRequest, reply: FastifyReply): any {
    reply.view("authPages/auth.eta");
}
/* --------------- Disconnect controller --------------- */

function anyDisconnectController(request: FastifyRequest, reply: FastifyReply): any {
    request.session.destroy();
    reply.redirect('/profil');
}

/* ---------------------------- SCHEMA VALIDATORS ---------------------------- */

// Auth
const authSchema = Joi.object({
    username: Joi.string().required().messages({ 'string.empty': 'Veuillez renseigner votre nom d\'utilisateur.' }),
    password: Joi.string().required().messages({ 'string.empty': 'Veuillez renseigner votre mot de passe.' })
});

// Register
const registerSchema = Joi.object({
    username: Joi.string().min(USERNAME_MINL).max(USERNAME_MAXL).required().messages(
        {
            'string.empty': 'Veuillez renseigner votre nom d\'utilisateur.',
            'string.min': `Le nom d'utilisateur doit faire au minimum ${USERNAME_MINL} caractètres.`,
            'string.max': `Le nom d'utilisateur doit faire au maximum ${USERNAME_MAXL} caractètres.`
        }),
    email:
        Joi.string().min(EMAIL_MINL).max(EMAIL_MAXL).email().required().messages(
            {
                'string.empty': 'Veuillez renseigner votre adresse email.',
                'string.email': 'Veuillez renseigner une email valide.',
                'string.min': `Adresse email trop courte.`,
                'string.max': `Adresse email trop longue.`
            }),
    password: Joi.string().min(PASSWORD_MINL).max(PASSWORD_MAXL).required().messages(
        {
            'string.empty': 'Veuillez renseigner votre mot de passe.',
            'string.min': `Le mot de passe doit faire au minimum ${PASSWORD_MINL} caractètres.`,
            'string.max': `Le mot de passe doit faire au maximum ${PASSWORD_MAXL} caractètres.`
        }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages(
        {
            'any.only': 'Les deux mots de passe doivent correspondre.'
        })
});
