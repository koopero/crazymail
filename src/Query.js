module.exports = Query

const
  _ = require('lodash'),
  Util = require('./Util')

Query.match = function ( query, msg ) {
  if ( _.isUndefined( query ) )
    return true

  query = new Query( query )
  return query.match( msg )
}

function Query() {
  const query = Util.congeal({
    'address': '',
    'index': '',
    'after': ''
  }, arguments )


  if ( query.index == '' )
    delete query.index
  else
    query.index = parseInt( query.index ) || 0

  if ( !query.after )
    delete query.after

  if ( !query.address )
    delete query.address

  // Hide query.match so it doesn't get serialized be url.format
  Object.defineProperty( query, 'match', {
    value: match
  })

  return query

  function match ( msg ) {
    if ( query.address ) {
      if (
        !checkAddress( msg.to, query.address ) &&
        !checkAddress( msg.from, query.address )
      )
        return false
    }

    return true
    function checkAddress( haystack, needle ) {

      if ( _.isArray( haystack ) ) {
        for ( var i = 0; i < haystack.length; i ++ ) {
          if ( checkAddress( haystack[i], needle ) )
            return true
        }
      } else {
        return  haystack && haystack.address == needle
      }
    }
  }
}
