const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('../database/config');
const { authenticateToken } = require('../middlewares/jsonwebtoken');
const { appointmentsReminder } = require('../helpers/CronJobs');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.SERVER_PORT;

        // Middlewares
        this.middlewares();
        // Routes
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        appointmentsReminder.start();
        this.app.use(cors());
        this.app.options('*', cors());
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        // PARSE JSON FORMAT
        this.app.use(express.json());

    }

    routes() {
        // Serve uploaded files at /v1/api/uploads endpoint
        this.app.use('/v1/api/uploads', express.static(path.join(__dirname,'..', 'uploads')));

        // Your existing routes...
        this.app.use('/v1/api/users', require('../routes/users'));
        this.app.use('/v1/api/roles', require('../routes/roles'));
        this.app.use('/v1/api/auth', require('../routes/auth'));
        this.app.use('/v1/api/providers', require('../routes/providers'));
        this.app.use('/v1/api/products', require('../routes/products'));
        this.app.use('/v1/api/brands', require('../routes/brands'));
        this.app.use('/v1/api/categories', require('../routes/categories'));
        this.app.use('/v1/api/inventory', require('../routes/inventory'));
        this.app.use('/v1/api/services', require('../routes/services'));
        this.app.use('/v1/api/stock', require('../routes/stock'));
        this.app.use('/v1/api/notifications', require('../routes/notifications'));
        this.app.use('/v1/api/appointments', require('../routes/appointments'));
        this.app.use('/v1/api/expenses', require('../routes/expenses'));
        this.app.use('/v1/api/reports', require('../routes/reports'));
        this.app.use('/v1/api/bills', require('../routes/bills'));
        this.app.use('/v1/api/logs', require('../routes/logs'));
        this.app.use('/v1/api/payments', require('../routes/payments'));
        this.app.use('/v1/api/images-uploader', require('../routes/imagesUploader'));

        // // Serve the static files for the React app
        this.app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'build')));

        // // Handle other routes (if needed) by serving the React app's main HTML file
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'FrontEnd', 'build', 'index.html'));
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`APP RUNNING IN: ${this.port}`);
        });
    }
}

module.exports = Server;