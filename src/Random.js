const
  _ = require('lodash')

module.exports = new Random()

function Random() {
  var self = this

  self.firstNames = require('./random/firstNames')
  self.firstName = function () {
    return fnRandomFromKey( 'firstNames' )
  }
  self.lastNames = require('./random/lastNames')
  self.lastName = function () {
    return fnRandomFromKey( 'lastNames' )
  }

  self.middleNames = require('./random/middleNames')
  self.middleName = function () {
    return fnRandomFromKey( 'middleNames' )
  }

  self.name = function() {
    var person = congeal( {
      firstName: '',
      middleName: '',
      lastName: '',
      name: ''
    }, arguments )

    if ( chance( 0.93 ) )
      person.firstName = person.firstName || self.firstName( )

    if ( chance( 0.4 ) )
      person.middleName = person.middleName || self.middleName()

    if ( !person.firstName || chance( 0.96 ) )
      person.lastName = person.lastName || self.lastName()

    if ( !person.name ) {
      person.name = _( [ person.firstName, person.middleName, person.lastName ] ).compact().join(' ')
    }

    return person.name
  }

  self.person = function( opt ) {
    var person = congeal( {
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      email: '',
    }, arguments )

    person.firstName = person.firstName || self.firstName( opt )
    person.lastName  = person.lastName  || self.lastName ( opt )
    person.name = person.name ||  self.name( person )
    person.email = self.email( arguments, person )

    return person
  }

  self.hosts = require('./random/hosts')
  self.host = function( opt ) {
    opt = congeal( {
      host: ''
    }, arguments )

    opt.host = opt.host || fnRandomFromKey( 'hosts' )

    return String( opt.host )
  }

  self.address = function( opt ) {
    var person = self.person( arguments )

    return person.name + ' <'+person.email+'>'
  }

  self.delimiter = function() {
    return  chance( 0.7 ) ? '.' :
            chance( 0.5 ) ? '.' :
            chance( 0.7 ) ? '-' :
            ''
  }

  self.email = function( opt ) {
    var person = congeal( {
      firstName: '',
      lastName: '',
      name: '',
      number: 0,
      host: '',
      email: ''
    }, arguments )

    person.name = person.name || self.name( arguments )

    var segs = person.name.split(' ')

    if ( person.number || person.host || chance( 0.2 )  ) {
      segs.push( String( person.number || _.random( 200, 4000, false ) ) )
    }

    if ( chance( 0.5 ) ) {
      var ind = Math.floor( _.random( 0.5, segs.length - 1.5 ) )
      segs.splice( ind, 1 )
    }

    var name = segs.join(' ')
    name = name.toLowerCase()
    name = name.replace( /[^a-z0-9]+/g, self.delimiter )


    person.host = person.host || self.host( arguments )

    var email = person.email || name+'@'+person.host



    return email
  }

  self.subject = function ( opt ) {
    opt = congeal( {

    }, arguments )

    return 'Testing 123'
  }

  self.text = function ( opt ) {
    return 'Hello, world!'
  }

  function congeal( defaults, args ) {
    const keys = _.keys( defaults )

    congealArr( _.slice( arguments, 1 ) )
    return defaults

    function congealArr( arr ) {
      _.map( arr, function ( arg ) {
        if ( _.isArguments( arg ) || _.isArray( arg ) ) {
          congealArr( arg )
        } else if ( _.isObject( arg ) ) {
          _.extend( defaults, _.pick( arg, keys ) )
        }
      })
    }
  }

  function chance( chance ) {
    return Math.random() < chance
  }


  function fnRandomFromKey( key ) {
    const list = self[key]
    return fnRandomFromList( list )
  }

  function fnRandomFromList( list ) {
    return list[_.random( 0, list.length - 1, false )]
  }
}
