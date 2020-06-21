const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes/loadRoutes")
require('log-timestamp');
require("dotenv").config();

const app = express();
var http = require('http').createServer(app);
  
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//PREFLIGHT REQUEST
app.options('*', cors())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("Error connecting to DB...");
        console.log(err)
    }
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("DB connection made ...");
})


if (process.env.DEBUG === "true") {
    console.log("You're working under DEBUG mode. Please pay attention")
  }

routes.loadRoutes(app)


if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }


const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log('Server running... on port: ' + port);
})
 