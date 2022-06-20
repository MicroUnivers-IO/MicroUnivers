import { GameApp } from "./game/GameApp";


/*GameApp.init(7777, "/dev1");*/

window.addEventListener("resize", () => GameApp.resizeHandler());
window.addEventListener("keydown", e => GameApp.keyPressHandler(e, true));
window.addEventListener("keyup", e => GameApp.keyPressHandler(e, false));
window.addEventListener("click", e => GameApp.mouseClickHandler(e));


// @ts-ignore
globalThis.joinGame = async (e) => {

    const lobbyData = e.target.dataset;
    console.log(lobbyData);
    let TOKEN = undefined;
    
    if (lobbyData.guestlobby == 'false') {
        // Retrieve le cookie jeton
        const res = await fetch(location.origin + '/getServToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                lobbyUrl: lobbyData.url
            })
        });

        if(res.status == 404) {
            return alert('Une erreur est survenue lors de la connexion au serveur.');
        } else {
            TOKEN = (await res.json()).servToken;
        }
        
    } 

    // @ts-ignore
    document.getElementById('pixi-content').classList.remove('display-none');
    GameApp.init(parseInt(lobbyData.port), lobbyData.url, TOKEN);
}
