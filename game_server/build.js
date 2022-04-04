const target = "./dist";

require("esbuild").buildSync({
  entryPoints: [
    "./src/server.ts",
    "./src/loop.ts",
    "./src/config.ts",
    "./src/game/Player.ts",
  ],
  bundle: true,
  outdir: target,
});

// Deplacer le fichier uWS dans le dossier dist



const fs = require("fs");
fs.readdir(target, (err, files) => {
  files.forEach(file => {
    if (file.endsWith(".node")) {
      fs.unlinkSync(target + "/" + file);
    }
  });
});

const uws_target = 'uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node'; 

fs.copyFileSync("./node_modules/uWebSockets.js/" + uws_target, "./dist/" + uws_target, fs.constants.COPYFILE_EXCL);