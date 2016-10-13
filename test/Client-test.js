const
  assert = require('chai').assert,
  request = require('request'),
  urllib = require('url'),
  Promise = require('bluebird'),
  Crazymail = require('..')

describe('Client', function () {
  describe('pingSync', function () {
    it('will return false when server is unavailable', () => {
      const opt = {
            http: 60000,
            host: 'thebetternotbearealhost.com'
          }
          , client = new Crazymail.Client( opt )
          , result = client.pingSync()

      assert.equal( result, false )
    })

    it('will return true when server is available', ( cb ) => {
      const opt = {
            http: 40000,
            smtp: 25252,
            host: 'localhost'
          }
          , client = new Crazymail.Client( opt )

      // Since pingSync blocks the process, we can't just fire up a Server here.
      // Instead, we need to fork it in a different process.
      const forked = require('child_process').fork( `${__dirname}/_forkServer.js`)
      forked.once('message', ( mesg ) => {
        assert.deepEqual( mesg, { open: true } )
        const result = client.pingSync()
        assert.equal( result, true )

        forked.kill()

        // Give the forked process some time to die.
        setTimeout( cb, 500 )
      } )

      forked.send( { open: opt } )
    })

  })
})
