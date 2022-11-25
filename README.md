##  Hiscore Server

This is experimental and needs more testing, so use at your own risk!

A lightweight NodeJS server for receiving high score data over HTTPS.  Keeps all its data in a MySQL database.

The server relies on a secret key being sent from a game client, then generates a session key based on this and some salts (one static and the other random).  Later high score data can then be submitted using the session key.  While the secret key can be anything, it is recommended to use a sha hash for complexity.
