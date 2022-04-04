const target = "./dist";

require("esbuild").buildSync({
  entryPoints: [
    "./src/server.ts",
    "./src/loop.ts",
    "./src/config.ts",
    "./src/game/Player.ts",
    "./src/benchmarks.ts",
    "./src/enums.ts"
  ],
  bundle: true,
  outdir: target,
});

