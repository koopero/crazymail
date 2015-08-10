module.exports = Server

const
  _ = require('lodash'),
  HTTPServer = require('./HTTPServer'),
  SMTPClient = require('./SMTPClient'),
  SMTPServer = require('./SMTPServer'),
  Mailbox = require('./Mailbox'),
  Queue = require('./Queue' )


function Server( opt ) {
  opt = _.defaults( opt || {}, {
    smtp: true,
    http: true
  })

  const
    self = this

  var
    count = 0

  self.queue = new Queue( opt )
  self.mailbox = new Mailbox( opt )
  self.close = close
  self.smtpClient = new SMTPClient( opt )


  if ( opt.smtp ) {
    self.smtp = new SMTPServer( opt )

    self.smtp.on('mail', function ( mesg ) {
      mesg.index = count++
      log( mesg )
      self.mailbox.add( mesg )
      self.queue.send( mesg )
    })

    self.smtp.on('open', function( ) {

    })
  }

  if ( opt.http ) {
    self.http = new HTTPServer( opt )
    self.http.mailbox = self.mailbox
    self.http.queue = self.queue
  }


  return self

  function log( msg ) {
    console.dir( msg )
  }

  function close() {
    if ( self.smtp ) {
      self.smtp.close()
    }

    if ( self.http ) {
      self.http.close()
    }
  }


}
