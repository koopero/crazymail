/**
 * Wait for IPC meesages from process to start and stop a server.
 */


const Crazymail = require('..')

var server

process.on('message', ( mesg ) => {
  if ( mesg && mesg.open ) {
    if ( server )
      server.close()

    server = new Crazymail.Server( mesg.open )
    server.open()
    .then( () => process.send( { open: true } ) )
  }
} )
