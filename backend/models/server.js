// const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.port = process.env.PORT;
        this.app = express();
        this.paths = {
            userPath: '/user',
            executorPath: '/executor',
            scriptPath: '/script',
        }
        this.DBConnection();
        this.middlewares();
        this.routes();
    }

    async DBConnection(){
        await dbConnection();
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Listen at http://localhost:${this.port}`);
        });
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    routes(){
        this.app.use(this.paths.userPath, require('../routes/user'));
        this.app.use(this.paths.executorPath, require('../routes/executor'));
        this.app.use(this.paths.scriptPath, require('../routes/script'));
    }
    
}

module.exports = Server;