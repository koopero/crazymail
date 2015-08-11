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

  function send () {
    var msg = Util.congeal( {
      to: '',
      from: '',
      subject: '',
      text: ''
    }, arguments )

    msg.to = msg.to || self.random.address( opt, arguments )
    msg.from = msg.from || self.random.address( opt, arguments )
    msg.subject = msg.subject || self.random.subject( opt, arguments )
    msg.text = msg.text || self.random.text( opt, arguments )

    const
      server = require('emailjs').server.connect( serverOpts )

    // msg = _.extend( {
    //   text:     self.random.text( opt, msg ),
    //   subject:  self.random.subject( opt, msg ),
    //   to:       self.random.address( opt, opt.to ),
    //   from:     self.random.address( opt.from )
    // }, msg )
    //
    // msg = _.pick( msg, 'text', 'subject', 'from', 'to', 'cc', 'bcc', 'attachment')


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
