module.exports = Mailbox

const
  Query = require('./Query')

function Mailbox( opt ) {
  const
    self = this,
    counter = 0,
    size = 2,
    messages = []

  self.add = add
  self.first = first
  self.all = all

  return self

  function add( msg ) {
    msg.index = counter
    counter++
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
