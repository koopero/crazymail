module.exports = Client

const
  _ = require('lodash'),
  Query = require('./Query'),
  Random = require('./Random'),
  SMTPClient = require('./SMTPClient'),
  urllib = require('url'),
  request = require('request')

function Client( opt ) {
  const
    self = this

  self.url = 'http://localhost:7319'
  self.random = new Random( opt )
  self.smtp = new SMTPClient( opt )
  self.send = self.smtp.send.bind( self.smtp )
  self.receive = receive
  self.flood = flood


  function flood ( delay ) {
    var
      args = _.slice( arguments, 1 ),
      next = setTimeout.bind( null, send, parseInt( delay ) || 50 )
      run = true

    send()
    return stop

    function send() {
      if ( run ) {
        self.send( args ).then( function () {
          next()
        })
      }
    }

    function stop() {
      run = false
    }
  }


  function receive( opt ) {
    var
      query = Query( opt, opt.query ),
      url = httpURL( 'receive', query )

    return new Promise( function ( resolve, reject ) {
      request( {
        url: url,
        json: true
      }, function ( err, headers, body ) {
        resolve( body )
      })
    })
  }

  function httpURL( endpoint, query ) {
    var url = urllib.format( {
      pathname: endpoint,
      query: query
    })
    return urllib.resolve( self.url, url )
  }
}
