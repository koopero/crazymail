module.exports = HTTPServer

const Errors = require('./Errors')
    , Random = require('./Random')
    , Log = require('./Log')
    , express = require('express')

function HTTPServer( opt ) {

  const
    self = this,
    app = express()

  route( app )

  self.app = app
  self.open = open
  self.close = close

  return self

  function route( app ) {
    app.get('/random/name', function ( req, res ) {
      var name = Random.name( opt )
      res.send( Random.name( opt, req.query ) )
    })

    app.get('/random/person', function ( req, res ) {
      var person = Random.person( opt )
      res.send( Random.person( opt, req.query ) )
    })

    app.get('/ping', function ( req, res ) {
      res.json( 'pong' )
    })

    app.get('/mailbox', function ( req, res ) {
      res.send( self.mailbox.all() )
    })

    app.get('/receive', function ( req, res ) {
      var query = req.query

      var first = self.mailbox.first( query )
      if ( first ) {
        sendMsg( first )
        return
      }

      self.queue.wait( opt )
        .then( function ( msg ) {
          sendMsg( msg )
        } )
        .catch( Errors.TimeoutError, function () {
          res.status( 408, 'No Mail Today' )
          res.send( {
            mesg: 'No Mail Today'
          } )
        } )
        .catch( function ( err ) {
          console.log( "ERR", err.stack )
          res.status( 500 )
          res.send( err )
        } )

      function sendMsg( msg ) {
        res.send( msg )
      }
    } )

  }

  function open ( ) {
    var port = parseInt( opt.http ) || 7319
    if ( opt.log )
      Log.listen( 'http', port, opt.host || '0.0.0.0' )

    return new Promise( function ( resolve, reject ) {
      self.server = app.listen( port, function ( err ) {
        if ( err )
          reject( err )
        else
          resolve()
      } )
    } )
  }

  function close () {
    return new Promise( function ( resolve, reject ) {
      if ( self.server ) {
        self.server.close( function ( err ) {
          if ( err )
            reject( err )
          else
            resolve()
        })
      } else {
        resolve()
      }
    } )
  }

}
