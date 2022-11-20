#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module wtfsystems/hiscore_server
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

import tls from 'tls'
import fs from 'fs'
import mysql from 'mysql'

const settings = {
    port: 7050,

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),
        cert: fs.readFileSync('client-cert.pem'),
        requestCert: true,
        ca: "X509 CERTIFICATE"
    }
}

console.log(`Starting High Score Server`)
console.log(`Press Ctrl+C to exit`)

var server = tls.createServer(settings.serverOpts, (socket) => {
    socket.on('data', (data) => {
        console.log(data)
    })

    server.close(() => {
        //
    })
})

server.listen({ port: settings.port }, () => {
    console.log(`Listening at port: ${settings.port}`)
})
