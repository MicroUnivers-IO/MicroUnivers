const target = "./dist";

require("esbuild").buildSync({
  entryPoints: [
    "./src/server.ts",
    "./src/loop.ts",
    "./src/config/config.ts",
    "./src/game/Player.ts",
    "./src/config/benchmarks.ts",
    "./src/config/enums.ts"
  ],
  bundle: true,
  outdir: target,
  minify: true
});

