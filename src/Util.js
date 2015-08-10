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
