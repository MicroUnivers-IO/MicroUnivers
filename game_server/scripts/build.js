const target = "./dist";

require("esbuild").buildSync({
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
  minify: true,
  platform: 'node'
});

