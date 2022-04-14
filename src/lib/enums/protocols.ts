import { isInt16Array } from "util/types";

export const PROTOCOLS = Object.freeze({
    CLI_HANDSHAKE: "CLI_HANDSHAKE",
    CLI_UPDATE: "CLI_UPDATE",
    UPDATE: "UPDATE",
    INIT_MAP: "INIT_MAP",
    INIT_PLAYER: "INIT_PLAYER"
});