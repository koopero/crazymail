const
  _ = require('lodash')

exports.isAscii = function ( str ) {
  return /^[\x00-\x7F]*$/.test( str );
}

exports.parseAddress = function ( str ) {
  if ( nameAndAddress = /(.*?)<(.*?@.*?)>/.exec( str )) {
    return {
      name: _.trim( nameAndAddress[1] ),
      address: nameAndAddress[2],
    }
  }

  return {
    address: _.trim( str )
  }
}

exports.congeal = function ( template, args ) {
  const keys = _.keys( template )

  congealArr( _.slice( arguments, 1 ) )

  return template

  function congealArr( arr ) {
    _.map( arr, function ( arg ) {
      if ( _.isArguments( arg ) || _.isArray( arg ) ) {
        congealArr( arg )
      } else if ( _.isObject( arg ) ) {
        _.extend( template, _.pick( arg, keys ) )
      }
    })
  }
}
