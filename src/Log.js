const
  _ = require('lodash'),
  chalk = require('chalk')

exports.message = function ( mesg ) {
  console.log()
  console.log( chalk.blue('index:   ') + '%d', mesg.index )
  console.log( chalk.blue('to:      ') + '%s', formatAddress( mesg.to ) )
  console.log( chalk.blue('from:    ') + '%s', formatAddress( mesg.from ) )
  console.log( chalk.blue('subject: ') + '%s', mesg.subject )
  console.log( chalk.blue('text:    ') + '%s', _.trunc( _.trim( mesg.text ),  60 ) )

  function formatAddress( address ) {
    if ( _.isArray( address ) )
      return _.map( address, formatAddress ).join(', ')

    return address.name ? address.name + ' <'+address.address+'>' : address.address
  }
}
