const
  ass = require('chai').assert,
  Util = require('../src/Util')

describe( 'Util', function () {
  describe( '.isAscii', function () {
    it('will recognize non-ascii', function ( ) {
      ass( Util.isAscii( 'Benito McFunkenstien' ) )
      ass( !Util.isAscii( 'Robın PoodlePuncheŗ Swõrdfish' ) )
    })
  })

  describe('.parseAddress', function() {
    it('will recognize email address', function () {
      ass.deepEqual(
        Util.parseAddress( 'dan.macbanjo.3819@seeplace.com' ),
        { address: 'dan.macbanjo.3819@seeplace.com' }
      )
    })

    it('will recognize address line', function () {
      ass.deepEqual(
        Util.parseAddress( 'Curley de MacAnchovy <de.macanchovy.944@aux.com>' ),
        {
          name: 'Curley de MacAnchovy',
          address: 'de.macanchovy.944@aux.com'
        }
      )
    })

  })
})
