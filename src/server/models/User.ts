import { randomBytes } from "crypto";
import { hashPass } from "../../lib/crypt";
import { VERIFY_TOKENL } from "../config/config";
import connectionPool from "./Db";


export interface RegisterInfos {
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
}

export interface UserData {
    userId: number;
    username: string;
    email: string;
    hashPass: string;
    registerDate: string; // Epoch
    verifyToken: string | null;
}


export async function getUser(username: string): Promise<UserData | undefined> {
    let db;
    try {
        db = await connectionPool.getConnection();
        const user = await db.query(`SELECT * FROM MuUser WHERE username = '${username}'`);
        return user[0];
    } catch (e) {
        console.log(e);
    } finally {
        if (db) db.release(); // libére la connexion
    }
}

export async function getUserByVerifyToken(verifyToken: string): Promise<UserData | undefined> {
    let db;
    try {
        db = await connectionPool.getConnection();
        const user = await db.query(`SELECT * FROM MuUser WHERE verifyToken = '${verifyToken}'`);
        return user[0];
    } catch (e) {
        console.log(e);
    } finally {
        if (db) db.release(); // libére la connexion
    }
}

export async function createUser(userInfos: RegisterInfos): Promise<string | null> {
    let db;
    try {
        db = await connectionPool.getConnection();
        const hashedPass = hashPass(userInfos.password);
        const verifyToken = randomBytes(VERIFY_TOKENL).toString("hex");
        await db.execute(`INSERT INTO MuUser (\`username\`, \`email\`, \`hashPass\`, \`verifyToken\`, \`registerDate\`) VALUES ('${userInfos.username}', '${userInfos.email}', '${hashedPass}', '${verifyToken}', '${Date.now()}')`);
        return verifyToken;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (db) db.release(); // libére la connexion
    }
}

/*
UPDATE table
SET colonne_1 = 'valeur 1', colonne_2 = 'valeur 2', colonne_3 = 'valeur 3'
WHERE condition
*/
export async function verifyUser(userId: number) {
    let db;
    try {
        db = await connectionPool.getConnection();
       await db.execute(`UPDATE MuUser SET \`verifyToken\` = NULL WHERE MuUser.userId = ${userId}`);
    } catch (e) {
        console.log(e);
    } finally {
        if (db) db.release(); // libére la connexion
    }
}

export async function existingUsername(username: string): Promise<boolean | undefined> {
    let db;
    try {
        db = await connectionPool.getConnection();
        const res = await db.execute(`SELECT MuUser.username FROM MuUser WHERE MuUser.username = '${username}' LIMIT 1`);
        return res.length > 0;
    } catch (e) {
        console.log(e);
    } finally {
        if (db) db.release(); // libére la connexion
    }
}

export async function existingMail(email: string): Promise<boolean | undefined> {
    let db;
    try {
        db = await connectionPool.getConnection();
        const res = await db.execute(`SELECT MuUser.email FROM MuUser WHERE MuUser.email = '${email}' LIMIT 1`);
        return res.length > 0;
    } catch (e) {
        console.log(e);
    } finally {
        if (db) db.release(); // libére la connexion
    }
}
