module.exports = SMTPClient

const
  _ = require('lodash'),
  Random = require('./Random'),
  Util = require('./Util')

function SMTPClient( opt ) {
  const
    self = this,
    serverOpts = {
      port: parseInt( opt.smtp ) || 25,
      host: opt.host
    }

  // console.log('serverOpts', serverOpts )

  self.random = new Random( opt )
  self.send = send

  function send ( msg ) {
    const
      server = require('emailjs').server.connect( serverOpts )

    return new Promise( function ( resolve, reject ) {
      server.send( msg, function ( err, message ) {
        if ( err ) {
          console.log('ERR!', err, msg )
          reject( err )
          return
        }

        resolve( message )
      } )
    })

  }
}
