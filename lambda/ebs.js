var utils = require('./utils');

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2(utils.getRegionObject());
var config = require('./config.json');

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
        var tags = volume.Tags.reduce(function(final, current) {
          final[current.Key] = current.Value;
          return final;
        }, {});
        var purgeDate = new Date();
        purgeDate.setTime( purgeDate.getTime() + (tags['Retention'] || config.defaultRetention) * 86400000 );
        
        var snapshotParams = {
          VolumeId: volume.VolumeId,
          DryRun: false
        };
        var snapshotTagParams = {
          Resources: [
          ],
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
        
        return ec2.createSnapshot(snapshotParams)
          .promise()
          .then(function(data) {
            snapshotTagParams.Resources = [data.SnapshotId];
            return ec2.createTags(snapshotTagParams).promise();
          })
      });
    });
    
    return Promise.all(snapshotPromises);
};

exports.snapshotVolumes = snapshotVolumes;