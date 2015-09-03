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
    'to': '',
    'from': '',
    'index': '',
    'after': ''
  }, arguments )


  if ( query.index == '' )
    delete query.index
  else
    query.index = parseInt( query.index ) || 0

  if ( query.after == '' )
    delete query.after
  else
    query.after = parseInt( query.after ) || 0

  if ( !query.address )
    delete query.address

  if ( !query.to )
    delete query.to

  if ( !query.from )
    delete query.from

  // Hide query.match so it doesn't get serialized by url.format
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

    if ( query.to ) {
      if ( !checkAddress( msg.to, query.to ) )
        return false
    }

    if ( query.from ) {
      if ( !checkAddress( msg.from, query.from ) )
        return false
    }

    if ( query.after ) {
      if ( msg.id <= query.after )
        return false
    }

    if ( query.index ) {
      if ( msg.id != query.index )
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
