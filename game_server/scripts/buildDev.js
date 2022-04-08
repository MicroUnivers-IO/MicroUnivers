const target = "./dist";
const entryPoints = require("./entryPoints");

require("esbuild")
  .build({
    entryPoints,
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
