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

const client = tls.connect(settings.port, settings.serverOpts, () => {
    client.write(`this is a test`)

    client.end(() => {
        console.log(`Client closed successfully`)
    })
})
