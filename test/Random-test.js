const
  ass = require('chai').assert,
  Random = require('../src/Random'),
  Util = require('../src/Util')

describe( 'Random', function () {
  describe( '.name', function () {
    it('will force unicode', function () {
      var name = new Random( { unicode: true } ).name()
      ass( !Util.isAscii( name ))
    })
  })
})
