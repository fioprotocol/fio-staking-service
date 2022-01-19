import fioRoute from './routes/fio';
import fioCtrl from './api/fio';

const fs = require('fs');
const cors = require("cors");

const route = require("express").Router();
const pathFIO = "controller/api/logs/FIO.log";
class MainCtrl {
    async start(app) {  
        if(fs.existsSync(pathFIO)) { //check file exist
            console.log("The file exists.");
        } else {
            console.log('The file does not exist.');
            fs.writeFile(pathFIO, "", function(err) { //create new file
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }
        setInterval(fioCtrl.saveRoeToFile, 86400000); //excute unwrap action every 60 seconds

        this.initRoutes(app);
    }
    initRoutes(app) {
        route.use(cors({ origin: "*" }));
        app.use(fioRoute);
    }
}

export default new MainCtrl();