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
    port: 7050
}

const options = {
    //
}

var server = tls.createServer(options, (socket) => {
    socket.on('data', (data) => {
        //
    })

    server.close(() => {
        //
    })
})

server.listen({ port: settings.port }, () => {
    console.log(`Listening at port: ${settings.port}`)
})
