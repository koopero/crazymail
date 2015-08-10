#!/usr/bin/env node

const
  _ = require('lodash'),
  Crazymail = require('../index'),
  pkg = require('../package.json')


var argConfig = {
  'rate': [
    [ '-r', '--rate'],
    {
      action: 'store',
      type: 'int',
      defaultValue: 100,
      help: 'Milliseconds between messages'
    }
  ],
  'subject': [ [ '--subject'], { help: 'Subject' }  ],
  'host': [ [ '--host'], { help: 'Hostname' }  ],
  'firstName': [ [ '--first'], { help: 'First name', dest: 'firstName' }  ],
  'middleName': [ [ '--middle'], { help: 'Middle name', dest: 'middleName' } ],
  'lastName': [ [ '--last'], { help: 'Last name', dest: 'lastName' }  ],
  'name': [ [ '-n','--name'], { help: 'Name' }  ],
  'unicode': [ ['--unicode'], { help: 'Add a splash of unicode to names', action: 'storeTrue' }  ]
}


var commands = {
  'server': {
    help: 'Start server',
    args: []
  },
  'receive': {
    help: 'receive a message from a server',
    args: []
  },
  'name': {
    help: 'Return a random funny name.',
    args: ['firstName','middleName','lastName','unicode']
  },
  'person': {
    help: 'Return a random person.',
    args: ['firstName','middleName','lastName', 'host','unicode']
  },
  'address': {
    args: ['firstName','middleName','lastName', 'host']
  },
  'send': {
    args: ['firstName','middleName','lastName','subject','host']
  },
  'flood': { args: ['rate','host']},
  'message': { args: [] }
}

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: pkg.version,
  addHelp: true,
  description: 'crazymail examples: sub-commands',
});

var subparsers = parser.addSubparsers({
  title: 'commands',
  dest: "command"
});

_.map( commands, function ( command, name ) {
  var subparser = subparsers.addParser( name, command )
  _.map( command.args || [] , function ( argName ) {
    var arg = argConfig[argName]
    subparser.addArgument( arg[0], arg[1] )

  } )
} )

var args = parser.parseArgs();
_.map( argConfig, function ( config, argName ) {
  if ( args[argName] === null )
    delete args[argName]
} )

// console.dir( args )

const
  Random = require('../src/Random')

var commands = {
  name: function (){
    console.log( new Random( args ).name() )
  },

  address: function (){
    console.log( new Random( args ).address() )
  },

  person: function (){
    writeJSON( new Random( args ).person() )
  },

  send: function (){
    var
      client = new Crazymail.Client( args )

    client.send( args )
  },

  server: function() {
    var
      server = new Crazymail.Server( args )
  },

  receive: function() {
    var client = new Crazymail.Client( args )
    client.receive( args )
      .then( function ( msg ) {
        writeJSON( data )
      } )
  }

}

commands[ args.command ]( )


function writeJSON( data ) {
  const str = JSON.stringify( data, null, 2 )
  console.log( str )
}
