var utils = require('./utils');

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2(utils.getRegionObject());

var snapshotVolumes = function*() {
  var getVolumesParam = {
    DryRun: false,
    Filters: [
      {
        Name: "tag-keys",
        Values: [
          "Snapshot"
        ]
      },
    ],
    MaxResults: 10,
  };
  
  var volumes = yield ec2.describeVolumes(getVolumesParam).promise();
  console.log(volumes);
};