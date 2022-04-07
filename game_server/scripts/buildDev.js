const target = "./dist";
require("esbuild")
  .build({
    entryPoints: [
      "./src/server.ts",
      "./src/loop.ts",
      "./src/config.ts",
      "./src/game/Player.ts",
      "./src/benchmarks.ts",
      "./src/enums.ts",
    ],
    bundle: true,
    outdir: target,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("En attente de modification pour rebuild...");
      },
    },
  })
  .then((result) => {
    console.log("En attente de modification pour rebuild...");
  });
