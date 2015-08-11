module.exports = Mailbox

const
  Query = require('./Query')

function Mailbox( opt ) {
  const
    self = this,
    size = 20,
    messages = []

  self.add = add
  self.first = first
  self.all = all

  return self

  function add( msg ) {
    messages.push( msg )
    clean()
  }

  function first( query ) {
    for ( var i = 0; i < messages.length; i ++ ) {
      var msg = messages[i]
      if ( msg && Query.match( query, msg ) ) {
        return msg
      }
    }
  }

  function clean() {
    while ( messages.length > size ) {
      messages.shift()
    }
  }

  function all( query ) {
    return messages
  }
}
