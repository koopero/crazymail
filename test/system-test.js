const
  assert = require('chai').assert,
  request = require('request'),
  urllib = require('url'),
  Promise = require('bluebird'),
  Crazymail = require('..')

describe('Crazymail', function ( cb ) {
  describe('will do its job', function() {
    var
      opt = {
        smtp: 2525
        ,http: 64001 // Try a non-standard port here
        ,host: 'localhost'
        // ,log: true
      },
      server,
      client,
      person

    it( 'start the server', function ( cb ) {
      server = new Crazymail.Server( opt )
      server.open().then( function() {
        cb()
      } ).catch( function ( err ) {
        cb( err )
      })
    })

    it( 'start the client', function ( ) {
      client = new Crazymail.Client( opt )
    })

    it( 'client will flood the server with fake messsages', function ( cb ) {
      var
        stop = client.flood( 10 )

      setTimeout( function () {
        stop()
        cb()
      }, 200 )
    })

    it('will send the mailbox over http', function( cb ) {
      request( {
        url: urllib.format( {
          port: opt.http,
          protocol: 'http:',
          hostname: 'localhost',
          pathname: '/mailbox'
        }),
        json: true
      }, function ( err, headers, body ) {
        assert.isArray( body )
        cb( err )
      })
    })

    it( 'get a random person', function ( ) {
      person = client.random.person()
    })

    it( 'send a real message', function ( cb ) {
      client.send( person, { text: 'TEXT', subject: 'SUBJECT' } ).then( function () {
        cb()
      }).catch( function ( err ) {
        cb( err )
      })
    })

    it( 'receive the same message', function ( cb ) {
      var promise = client.receive( person )
      promise.then( function ( msg ) {
        assert.include( msg.text, 'TEXT' )
        cb()
      } ).catch( function ( err ) {
        cb( err )
      })

    })

    it( 'close the server', function ( cb ) {
      server.close().then( function () {
        cb()
      }).catch( function ( err ) {
        cb( err )
      })
    })
  })
})
