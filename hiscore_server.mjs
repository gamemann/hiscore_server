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
        ca: [ fs.readFileSync('server-csr.pem')]
    }
}

console.log(`Starting High Score Server`)
console.log(`Press Ctrl+C to exit`)

const server = https.createServer(settings.serverOpts, (req, res) => {
    req.on('error', (error) => { console.error(error) })

    var args = req.url.slice(2, req.url.length).split('&')
    console.log(args)

    res.writeHead(200)
    res.end(`Connected`)
})

server.listen(settings.port, () => { console.log(`Running server on port ${settings.port}`) })
