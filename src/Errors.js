exports.TimeoutError = TimeoutError
function TimeoutError () {}
TimeoutError.prototype = Object.create( Error.prototype )
