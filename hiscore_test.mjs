#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module wtfsystems/hiscore_server
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

import fs from 'fs'
import tls from 'tls'
import mysql from 'mysql'

/**
 * TEST SETTINGS OBJECT
 * Fill in your server settings here.
 */
const settings = {
    port: 7050,
    host: 'localhost',

    serverOpts: {
        cert: fs.readFileSync('client-cert.pem')
    }
}

/**
 * TEST DATA OBJECT
 */
const testData = {
    gameID: 0,
    key: null,
    playerName: '',
    score: 0
}

const client = tls.connect(settings.port, settings.serverOpts, () => {
    if(client.authorized) {
        console.log(`Connection authorized.`)
    } else {
        console.log(`Not authorized:  ${client.authorizationError}`)
    }
    client.emit('data', 'testing!!!')
    client.end(() => {
        console.log(`Client closed successfully`)
    })
})
