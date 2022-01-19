const express = require('express')
const app = express();
const bodyParser = require('body-parser')
import mainCtrl from './controller/main';
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(bodyParser.json())
mainCtrl.start(app).catch(console.error);
app.listen(3010, () => {
  console.log(`server listening on *: 3010`)
});
