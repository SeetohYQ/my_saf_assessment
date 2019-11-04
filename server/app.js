//Load the libraries
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const mkQuery = require('./db-util');

//Configure the application
const app = express();
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
const pool = mysql.createPool(require('./config'));

//SQL Statements
const query = '';
//
const getSomething = mkQuery(query, pool);

//Install standard middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', (req,res) => {
    
})


//Response 404 in JSON
app.use((req, res) => {
    res.status(404).json({ message: `Error. ${req.url} is not found.` })
});

//Start up server
app.listen(PORT, () => {
    console.log(`App started and is listening on port ${PORT} at ${new Date()}.`);
})
