module.exports = SMTPServer

var _ = require('lodash')
  , Errors = require('./Errors')
  , Log = require('./Log')
  , Promise = require('bluebird')
  , util = require('util')
  , events = require('events')

util.inherits( SMTPServer, events.EventEmitter )

function SMTPServer ( opt ) {

  events.EventEmitter.call( this )

  opt = _.defaults( opt, {
    smtp: 25
  } )

  const self = this
      , serverOpt = _.extend( {
        logger: false,
        onData: onData,
        disabledCommands: ['STARTTLS','AUTH']
      }, opt )
      , smtpServer = new (require('smtp-server').SMTPServer)( serverOpt )


  smtpServer.on('error', function (err) {
    Log.error( 'SMTPServer', err.message )
    self.emit( 'error', err )
  })

  self.open = open
  self.close = close

  function onData( stream, session, callback ) {
    const
      MailParser = require('mailparser').MailParser,
      parser = new MailParser()

    parser.on("headers", function(headers){
      if ( !headers )
        callback( true )
    });

    parser.on("end", function(mail){
      self.emit( 'mail', mail )
      callback()
    });
    stream.pipe( parser )
  }

  function onError( err ) {
    console.log("Error", err)
  }

  function open() {
    var port = parseInt( opt.smtp ) || 25
    if ( opt.log )
      Log.listen( 'smtp', port, opt.host || '0.0.0.0' )
    return new Promise( function ( resolve, reject ) {
      smtpServer.listen( port, function ( err ) {
        if ( err ) {
          reject( new Errors.PortError( err, port ) )
        } else {
          resolve()
        }
      })
    })
  }

  function close() {
    return Promise.promisify( smtpServer.close, smtpServer )
  }
}
