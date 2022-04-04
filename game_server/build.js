require("esbuild").buildSync({
  entryPoints: [
    "./src/server.ts",
    "./src/loop.ts",
    "./src/config.ts",
    "./src/game/Player.ts",
  ],
  bundle: true,
  outdir: "./dist",
});
