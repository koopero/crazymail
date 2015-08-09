module.exports = SMTPClient

const
  _ = require('lodash'),
  Random = require('./Random')

function SMTPClient( opt ) {
  const
    self = this,
    serverOpts = _.clone( opt )

  // console.log('serverOpts', serverOpts )

  self.send = send

  function send ( msg ) {
    const
      server = require("emailjs").server.connect( serverOpts )

    msg = _.extend( {
      text: Random.text( opt.text ),
      subject: Random.subject( opt.subject ),
      to: Random.address( opt, opt.to ),
      from: Random.address( opt.from )
    }, msg )

    // console.log( "Send", msg )

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
