export default function () {
  let ws = new WebSocket("ws://127.0.0.1:7777/ws");
  // ws.send(INFOS_DE_CONNEXIOn)
  setInterval(() => {
    ws.send("Message exemple, PS : Bonjour Raphaël.");
  }, 1000);
}
