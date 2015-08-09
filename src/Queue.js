module.exports = Queue

const
  _ = require('lodash'),
  Errors = require('./Errors'),
  Query = require('./Query'),
  Promise = require('bluebird')

function Queue( opt ) {
  const
    self = this,
    listeners = []

  self.wait = wait
  self.send = send


  return self

  function send( msg ) {
    _.map( listeners, function ( listener ) {
      if ( !listener.query || Query.match( listener.query, msg ) )
        listener.send( msg )
    } )
  }

  function wait( opt, success, fail ) {
    return new Promise( function ( resolve, reject ) {
      var
        listener = {
          query: Query( opt.query ),
          send: send
        }

      listener.timeout = setTimeout( timeout, parseInt( opt.timeout ) || 10000 )
      listeners.push( listener )

      function timeout() {
        destroy()
        reject( new Errors.TimeoutError () )
      }

      function send( mesg ) {
        destroy()
        resolve( mesg )
      }

      function destroy() {
        if ( listener.timeout )
          clearTimeout( listener.timeout )

        var ind = listeners.indexOf( listener )
        if ( ind != -1 )
          listeners.splice( ind, 1 )
      }
    })
  }
}
