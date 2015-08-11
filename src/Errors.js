exports.TimeoutError = TimeoutError
function TimeoutError () {}
TimeoutError.prototype = Object.create( Error.prototype )


exports.PortError = PortError
function PortError ( err, port ) {
  this.code = err.code
  this.errno = err.errno
  this.syscall = err.syscall
  this.mesg = 'Unable to listen on port '+port
}
PortError.prototype = Object.create( Error.prototype )
