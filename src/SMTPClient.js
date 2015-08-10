module.exports = SMTPClient

const
  _ = require('lodash'),
  Random = require('./Random')

function SMTPClient( opt ) {
  const
    self = this,
    serverOpts = _.clone( opt )

  // console.log('serverOpts', serverOpts )

  self.random = new Random( opt )
  self.send = send

  function send ( msg ) {
    const
      server = require("emailjs").server.connect( serverOpts )

    msg = _.extend( {
      text:     self.random.text( opt.text ),
      subject:  self.random.subject( opt.subject ),
      to:       self.random.address( opt, opt.to ),
      from:     self.random.address( opt.from )
    }, msg )

    // console.log( "Send", msg )

    return new Promise( function ( resolve, reject ) {
      server.send( msg, function ( err, message ) {
        if ( err ) {
          // console.log('ERR!', err, msg )
          reject( err )
          return
        }

        resolve( message )
      } )
    })

  }
}
