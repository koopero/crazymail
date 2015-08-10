module.exports = Random

const
  _ = require('lodash'),
  transliteration = require('transliteration'),
  Util = require('./Util')

function Random() {
  var
    self = this

  self.arguments = arguments

  self.firstNames = require('./random/firstNames')
  self.firstName = function () {
    return encoding( fnRandomFromKey( 'firstNames' ), arguments )
  }
  self.lastNames = require('./random/lastNames')
  self.lastName = function () {
    return encoding( fnRandomFromKey( 'lastNames' ), arguments )
  }

  self.middleNames = require('./random/middleNames')
  self.middleName = function () {
    return encoding( fnRandomFromKey( 'middleNames' ), arguments )
  }

  self.name = function() {
    var person = self.person( arguments )
    return person.name
  }

  self.person = function( opt ) {
    var person = congeal( {
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      address: '',
    }, arguments )

    if ( !person.name ) {
      if ( chance( 0.93 ) )
        person.firstName = person.firstName || self.firstName( arguments )

      if ( chance( 0.4 ) )
        person.middleName = person.middleName || self.middleName( arguments )

      if ( !person.firstName || chance( 0.96 ) )
        person.lastName = person.lastName || self.lastName( arguments )

      person.name = _( [ person.firstName, person.middleName, person.lastName ] ).compact().join(' ')
    }

    person.address = self.address( arguments, person )

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

    return person.name + ' <'+person.address+'>'
  }

  self.delimiter = function() {
    return  chance( 0.7 ) ? '.' :
            chance( 0.5 ) ? '.' :
            chance( 0.7 ) ? '-' :
            ''
  }

  self.address = function( opt ) {
    var person = congeal( {
      firstName: '',
      lastName: '',
      name: '',
      number: 0,
      host: '',
      address: ''
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
    name = transliteration( name )
    name = name.replace( /[^a-z0-9]+/g, self.delimiter )


    person.host = person.host || self.host( arguments )

    var address = person.address || name+'@'+person.host

    return address
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

    congealArr( self.arguments )
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

  function encoding( str, args ) {
    var opt = congeal( {
      unicode: '',
      ascii: ''
    }, args )

    if ( opt.unicode ) {
      var
        tries = 400,
        dict = require('./random/unicode')

      while ( tries && Util.isAscii( str ) ) {
        str = str.replace( /[A-Za-z]/g, function ( char ) {
          if ( chance( 0.94 ) || !dict[char] )
            return char

          return fnRandomFromList( dict[char] )
        } )
        tries --
      }
    }

    return str
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
