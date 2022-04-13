const fs = require("fs");

require("esbuild").build({
    entryPoints: ["./src/server/server.ts"],
    bundle: true,
    outdir: "./dist",
    platform: 'node',
    watch: {
        onRebuild(error, result) {
          if (error) console.error('rebuild failed')
          else console.log('rebuildbuild succeeded:')
        },
    },
}).then((result) => {
    let uws_target = 'uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node';
    
    try{
        fs.copyFileSync("./node_modules/uWebSockets.js/" + uws_target, "./dist/" + uws_target, fs.constants.COPYFILE_EXCL);
    }catch(e){}
    
    console.log("Server build success !!");
}).catch((error) => {
    console.log("build failed : " + error);
    process.exit(1);
});

