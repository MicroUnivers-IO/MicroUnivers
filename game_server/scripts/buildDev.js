const target = "./dist";
require("esbuild")
  .build({
    entryPoints: [
      "./src/server.ts",
      "./src/loop.ts",
      "./src/config/config.ts",
      "./src/game/Player.ts",
      "./src/config/benchmarks.ts",
      "./src/config/enums.ts",
      "./src/handlers/closeHandler.ts",
      "./src/handlers/connectHandler.ts",
      "./src/handlers/messageHandler.ts"
    ],
    bundle: true,
    outdir: target,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("En attente de modification pour rebuild...");
      },
    },
    platform: 'node',
  })
  .then((result) => {
    console.log("En attente de modification pour rebuild...");
  });
