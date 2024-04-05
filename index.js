
const Express = require("express");
const MongoClient =  require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const boxManager = require("./router/boxManager");
const taskManager = require("./router/taskManager");


const app = Express();
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING =
  'mongodb+srv://userone:dbUserPassword@cluster0.ku6cdjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const DATABASE = "task-manager";

let database;
app.listen(8000, () =>  {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    database = client.db(DATABASE);
    console.log("Mono DB")
    app.use('/api/boxManager', boxManager(database));
    app.use('/api/taskManager', taskManager(database));
  })
})








