var Promise = require('bluebird');

var ebs = require('./ebs');

var handler = function* (event, context, callback) {
  try {
    
    yield ebs.snapshotVolumes();
    yield ebs.purgeSnapshots();
    
    callback(null, 'Finished');
  } catch(e) {
    callback('Error',  e);
  }
};

exports.handler = Promise.coroutine(handler);

//Uncomment below to test locally
// exports.handler(null, null, function(e, s) {
//   if(e) {
//     console.log("ERROR!" + e);
//   }
//   
//   console.log(s);
// });