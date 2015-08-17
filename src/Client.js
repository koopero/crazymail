module.exports = Client

const
  _ = require('lodash'),
  Query = require('./Query'),
  Random = require('./Random'),
  SMTPClient = require('./SMTPClient'),
  Log = require('./Log'),
  Util = require('./Util'),
  urllib = require('url'),
  request = require('request')

function Client( opt ) {
  const
    self = this

  if ( opt.http === true ) {
    opt.http = 7319
  }

  if ( !isNaN( parseInt( opt.http ) ) ) {
    self.url = urllib.format( {
      protocol: 'http:',
      hostname: opt.host || 'localhost',
      port: opt.http
    })
  } else {
    self.url = opt.http 
  }

  self.random = new Random( opt )
  self.smtp = new SMTPClient( opt )
  self.send = send
  self.receive = receive
  self.flood = flood

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

    if ( opt.log ) {
      Log.send( msg )
    }

    if ( self.smtp )
      return self.smtp.send( msg )
  }

  function flood ( delay ) {
    var opt = Util.congeal( {
      delay: 1
    }, arguments )

    var
      args = arguments,
      next = setTimeout.bind( null, send, parseInt( opt.delay ) || 1 ),

      run = true

    send()
    return stop

    function send() {
      if ( run ) {
        self.send( args ).then( function () {
          next()
        }).catch( function ( err ) {
          console.log( "flood error", err.stack )
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
