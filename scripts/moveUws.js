const fs = require("fs");


try{

    if (!fs.existsSync("./dist/")){
        fs.mkdirSync("./dist/");
    }

    let uws_target = 'uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node';
    fs.copyFileSync("./node_modules/uWebSockets.js/" + uws_target, "./dist/" + uws_target, fs.constants.COPYFILE_EXCL);
}catch(e){
    console.log(e);
}