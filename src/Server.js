module.exports = Server

const
  _ = require('lodash'),
  HTTPServer = require('./HTTPServer'),
  SMTPClient = require('./SMTPClient'),
  SMTPServer = require('./SMTPServer'),
  Mailbox = require('./Mailbox'),
  Queue = require('./Queue'),
  Log = require('./Log'),
  util = require('util'),
  events = require('events')

util.inherits( Server, events.EventEmitter )

function Server( opt ) {
  opt = _.defaults( opt || {}, {
    smtp: true,
    http: true
  })

  events.EventEmitter.call( this )

  const
    self = this

  var
    count = 0

  self.queue = new Queue( opt )
  self.mailbox = new Mailbox( opt )
  self.open = open
  self.close = close
  self.smtpClient = new SMTPClient( opt )

  return self


  function open () {
    var promises = []

    if ( opt.smtp ) {
      self.smtp = new SMTPServer( opt )
      self.smtp.on('mail', onMessage )
      promises.push( self.smtp.open() )
    }

    if ( opt.http ) {
      self.http = new HTTPServer( opt )
      self.http.mailbox = self.mailbox
      self.http.queue = self.queue
      promises.push( self.http.open() )
    }

    return Promise.all( promises )
  }

  function onMessage( mesg ) {
    mesg.index = ++count

    if ( opt.log )
      Log.receive( mesg )

    self.mailbox.add( mesg )
    self.queue.send( mesg )
  }

  function close() {
    var promises = []
    if ( self.smtp ) {
      promises.push( self.smtp.close() )
    }

    if ( self.http ) {
      promises.push( self.http.close() )
    }

    return Promise.all( promises )
  }


}
