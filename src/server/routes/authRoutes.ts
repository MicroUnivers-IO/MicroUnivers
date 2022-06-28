import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { matchPass } from "../../lib/crypt";
import { createUser, existingMail, existingUsername, getUser, getUserByVerifyToken, RegisterInfos, UserData, verifyUser } from "../models/User";
import Joi from "joi";

// Config
import { EMAIL_MAXL, EMAIL_MINL, PASSWORD_MAXL, PASSWORD_MINL, USERNAME_MAXL, USERNAME_MINL } from "../config/config";
import { sendVerifMail } from "../modules/sendMail";

async function authRoutes(server: FastifyInstance, options: any) {

    server.get('/auth', { preHandler: unauthService }, getAuthController);

    server.post('/auth', { preHandler: unauthService }, postAuthController);

    server.get('/profil', { preHandler: authService }, getProfilController);

    server.get('/disconnect', anyDisconnectController);

    server.get('/register', { preHandler: unauthService }, getRegisterController);

    server.post('/register', { preHandler: unauthService }, postRegisterController);
    
    server.get('/verify', getVerifyController);

}

export default authRoutes;

/* --------------- Auth Service --------------- */

// Redirect to auth page / account validation page if not logged
export function authService(request: FastifyRequest, reply: FastifyReply, done: any): any {
    const userdata: UserData | undefined = request.session.get('userdata');
    if (!userdata) {
        reply.redirect('auth');
    }

    if(!(userdata?.verifyToken == null)) {
        reply.view('authPages/validation.eta', { userdata });
    }

    // If not verified..
    done();
}

// Redirect to profil if logged
export function unauthService(request: FastifyRequest, reply: FastifyReply, done: any) {
    if (request.session.get('userdata')) {
        reply.redirect('profil');
    }
    done();
}


/* --------------- Profil controllers --------------- */

function getProfilController(request: FastifyRequest, reply: FastifyReply): any {
    const userdata: object = request.session.get('userdata');
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
        // pas d'await sur l'envoi du mail car cela peut durer plusieures secondes
        sendVerifMail(registerInfos.username, registerInfos.email, verifyToken);
        return reply.view('success.eta', { message: `Un email de validation de compte va être envoyé à l'adresse suivante (verifiez vos spams) : ${registerInfos.email}`});
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

        const userdata = await getUser(data.username);

        // L'utilisateur n'existe pas
        if (!userdata) {
            return reply.view("authPages/auth.eta", { formError: "Combinaison utilisateur & mot de passe inexistant." });
        }

        // Le mot de passe n'est pas valide
        if (!matchPass(userdata.hashPass, data.password)) {
            return reply.view("authPages/auth.eta", { formError: "Combinaison utilisateur & mot de passe inexistant." });
        }

        // @ts-ignore
        delete userdata.hashPass;
        request.session.set('userdata', userdata);
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

//getVerifiyController
/* --------------- Verify controller --------------- */

async function getVerifyController(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    // récupérer les infos de la requête si il y a 
    // token: --> verify token
    const queries: any = request.query;

    // Verification qu'un token est bien envoyé
    if(!queries.token) return reply.code(404).send('BAD REQUEST');

    // Vérification que le token appartient bien à l'utilisateur en cours
    const userdata: UserData | undefined = await getUserByVerifyToken(queries.token);
    
    // Pas d'utilisateur à vérifier
    if(!userdata) {
        return reply.send("Le lien a expiré.");
    } else {
        await verifyUser(userdata.userId);
    }
    userdata.verifyToken = null;
    return reply.view('authPages/validation.eta', { userdata });
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
    confirmEmail: Joi.any().valid(Joi.ref('email')).required().messages({
            'any.only': 'Les deux emails doivent correspondrent.'
    }),
    password: Joi.string().min(PASSWORD_MINL).max(PASSWORD_MAXL).required().messages(
        {
            'string.empty': 'Veuillez renseigner votre mot de passe.',
            'string.min': `Le mot de passe doit faire au minimum ${PASSWORD_MINL} caractètres.`,
            'string.max': `Le mot de passe doit faire au maximum ${PASSWORD_MAXL} caractètres.`
        }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages(
        {
            'any.only': 'Les deux mots de passe doivent correspondrent.'
        })
});
