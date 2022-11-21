#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module wtfsystems/hiscore_server
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

import fs from 'fs'
import https from 'https'
import mysql from 'mysql'

/**
 * SERVER SETTINGS OBJECT
 */
const settings = {
    port: 7050,

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),
        cert: fs.readFileSync('client-cert.pem'),
        //rejectUnauthorized: false,
        ca: [ fs.readFileSync('server-csr.pem')]
    }
}

console.log(`Starting High Score Server`)
console.log(`Press Ctrl+C to exit`)

https.createServer(settings.serverOpts, (req, res) => {
    //
}).listen(settings.port)
