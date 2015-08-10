module.exports = Client

const
  Random = require('./Random'),
  SMTPClient = require('./SMTPClient'),
  urllib = require('url'),
  request = require('request')

function Client( opt ) {
  const
    self = this

  self.url = 'http://localhost:7319'
  self.random = new Random( opt )
  self.send = send
  self.receive = receive
  self.smtp = new SMTPClient( opt )

  function send( msg ) {
    return self.smtp.send( msg )
  }

  function receive( opt ) {
    var
      query = opt.query,
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
