var Promise = require('bluebird');

var ebs = require('./ebs.js');

var handler = function* (event, context) {
  try {
    
    yield ebs.snapshotVolumes();
    
    context.done(null, 'Finished');
  } catch(e) {
    context.error('Error',  e);
  }
};

exports.handler = Promise.coroutine(handler);

//Uncomment below to test locally
exports.handler(null, {
  done: function(e, s) { console.log(s); },
  error: function(e, ex) { console.log(ex);}
});