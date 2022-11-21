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
    host: 'localhost',

    serverOpts: {
        key: fs.readFileSync('private-key.pem'),
        cert: fs.readFileSync('client-cert.pem')
    }
}

const client = tls.connect(settings.port, settings.serverOpts, () => {
    if(client.authorized) {
        console.log(`Connection authorized.`)
    } else {
        console.log(`Not authorized:  ${conn.authorizationError}`)
    }
    client.emit('data', 'testing!!!')
    client.end(() => {
        console.log(`Client closed successfully`)
    })
})
