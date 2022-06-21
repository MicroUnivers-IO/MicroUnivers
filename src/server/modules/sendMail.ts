import nodemailer from "nodemailer";
import { UserData } from "../models/User";


const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});


export async function sendVerifMail(username:string, email:string, verifyToken:string) {

    if(verifyToken == null) {
        return;
    }

    console.log(await transporter.sendMail({ // await
        from: 'MicroUnivers contact@microunivers.io', // sender address
        to: `${email}`, // list of receivers
        subject: "[MicroUnivers] Validation de votre compte ✔", // Subject line
        html: `
        <h1>Bienvenue dans MicroUnivers ${username} !</h1>
        <h4>Veuillez cliquez sur le lien suivant pour valider votre compte</h4>
        <h2><a href="https://microunivers.io/verify?token=${verifyToken}">Valider votre compte</a><h2>
        <br />
        <p>Vous avez une heure pour valider votre compte, dans le cas contraire votre inscription sera annulée.</p>
        `
    }));

}
