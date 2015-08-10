module.exports = SMTPServer

const
  _ = require('lodash'),
  Promise = require('bluebird'),
  util = require('util'),
  events = require('events')

util.inherits( SMTPServer, events.EventEmitter )

function SMTPServer ( opt ) {

  events.EventEmitter.call( this )

  opt = _.defaults( opt, {
    port: 25
  } )

  const
    self = this,
    serverOpt = _.extend( {}, opt ),
    simpleServer = require('simplesmtp').createSimpleServer( serverOpt, onRequest )

  self.close = close

  if ( opt.port ) {
    simpleServer.listen( opt.port, function ( err ) {
      if ( err ) {
        self.emit( 'error', err )
      } else {
        self.emit( 'open' )
      }
    })
  }

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
