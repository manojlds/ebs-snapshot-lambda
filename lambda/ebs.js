var utils = require('./utils');

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2(utils.getRegionObject());
var config = require('./config.json');

var getPurgeDate = function(tags) {
  var purgeDate = new Date();
  purgeDate.setTime(purgeDate.getTime() + (tags['Retention'] || config.defaultRetention) * 86400000 );
  
  return purgeDate;
};

var createSnapshot = function(volumeId) {
  var snapshotParams = {
    VolumeId: volumeId,
    DryRun: false
  };
  
  return ec2.createSnapshot(snapshotParams).promise();
};

var tagSnapshot = function(volume, snapshotId) {
  var tags = utils.getTags(volume.Tags);
  var purgeDate = getPurgeDate(tags);

  var snapshotTagParams = {
    Resources: [snapshotId],
    Tags: [
      {
        Key: 'VolumeId',
        Value: volume.VolumeId
      },
      {
        Key: 'PurgeDate',
        Value: purgeDate.toISOString().split('T')[0]
      },
    ],
    DryRun: false
  };
  
  return ec2.createTags(snapshotTagParams).promise();
}

var snapshotVolumes = function () {
  var getVolumesParam = {
    DryRun: false,
    Filters: [
      {
        Name: "tag-key",
        Values: [
          "Snapshot"
        ]
      },
    ]
  };
  
  var snapshotPromises = ec2.describeVolumes(getVolumesParam)
    .promise()
    .then(function(data) {
      return data.Volumes.map(function(volume) {
        
        return createSnapshot(volume.VolumeId)
          .then(function(data) {
            return tagSnapshot(volume, data.SnapshotId);
          })
      });
    });
    
    return Promise.all(snapshotPromises);
};

exports.snapshotVolumes = snapshotVolumes;