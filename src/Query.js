module.exports = Query

const
  _ = require('lodash')

Query.match = function ( query, msg ) {
  if ( _.isUndefined( query ) )
    return true

  query = new Query( query )
  return query.match( msg )
}

function Query() {

  

  function match ( msg ) {

  }
}
