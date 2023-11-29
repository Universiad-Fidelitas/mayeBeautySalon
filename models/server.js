const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('../database/config');
const { authenticateToken } = require('../middlewares/jsonwebtoken');
require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        this.port = 4000;
        
        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors());
        this.app.options('*',cors());
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });

        // PARSE JSON FORMAT
        this.app.use( express.json() );

        //SERVER STATIC FILE
        this.app.use('/public', express.static('public'));
    }

    routes() {
        this.app.use('/v1/api/usuarios', require('../routes/user'))
        this.app.use('/v1/api/rols', authenticateToken,require('../routes/rols'))
        this.app.use('/v1/api/auth', require('../routes/auth'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`APP RUNNING IN: ${ this.port }`)
        })
    }
}

module.exports = Server;