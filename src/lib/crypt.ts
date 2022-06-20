import { scryptSync, randomBytes, createCipheriv, createDecipheriv } from "crypto";



/* -------------------- HASHING -------------------- */

/* Usage :
import { hashPass, matchPass } from '../lib/crypt';

let hashedPass = hashPass('chaise');
matchPass(hashedPass, 'chaise'); --> True
matchPass(hashedPass, 'pomme'); --> False

*/

const KEY_LEN = 32;
const SALT_LEN = 16;

export function hashPass(password: string) {
    const salt = randomBytes(SALT_LEN).toString("hex");
    return salt + '.' + scryptSync(password, salt, KEY_LEN).toString("hex");
}

export function hashPassSalt(password: string, salt: string) {
    return scryptSync(password, salt, KEY_LEN).toString("hex");
}


export function matchPass(hashedPass: string, password: string) {

    const parts = hashedPass.split('.');
    const salt = parts[0];
    const hash = parts[1];

    return hash ==  hashPassSalt(password, salt);
}


/* -------------------- ENCRYPTION -------------------- */

/* Usage :
import { encrypt, decrypt } from '../lib/crypt';

const secretKey = "SECRET KEY !";

let hash = encrypt('chaise', secretKey);
decrypt(hash, secretKey); --> 'chaise'
*/

const ALGORITHM = 'aes-256-ctr';

export const encrypt = (text:string, secretKey:string) : string => {
    const iv = randomBytes(16);

    const cipher = createCipheriv(ALGORITHM, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
    return iv.toString('hex') + '.' + encrypted.toString('hex');
};

export const decrypt = (hash:string, secretKey:string) : string => {

    const [ iv, content ] = hash.split('.');

    const decipher = createDecipheriv(ALGORITHM, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};
