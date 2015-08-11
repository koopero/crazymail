module.exports = SMTPServer

var _ = require('lodash')
  , Errors = require('./Errors')
  , Promise = require('bluebird')
  , util = require('util')
  , events = require('events')

util.inherits( SMTPServer, events.EventEmitter )

function SMTPServer ( opt ) {

  events.EventEmitter.call( this )

  opt = _.defaults( opt, {
    smtp: 25
  } )

  const
    self = this,
    serverOpt = _.extend( {}, opt ),
    simpleServer = require('simplesmtp').createSimpleServer( serverOpt, onRequest )

  self.open = open
  self.close = close

  function onRequest( req ) {
    const
      MailParser = require('mailparser').MailParser,
      parser = new MailParser()

    parser.on("headers", function(headers){
      if ( !headers )
        req.reject()
      else
        req.accept()

    });

    parser.on("end", function(mail){
      self.emit( 'mail', mail )
    });
    req.pipe( parser )
  }

  function open() {
    return new Promise( function ( resolve, reject ) {
      var port = parseInt( opt.smtp ) || 25
      simpleServer.listen( port, function ( err ) {
        if ( err ) {
          reject( new Errors.PortError( err, port ) )
        } else {
          resolve()
        }
      })
    })
  }

  function close() {
    return new Promise( function ( resolve, reject ) {
      simpleServer.server.end( function ( err ) {
        if ( err )
          reject( err )
        else {
          resolve()
        }
      })
    } )

  }
}
