# ebs-snapshot-lambda

AWS lambda function to snapshot EBS volumes and purge old snapshots.

## Requirements

The EBS volumes that are to be snapshotted need to be tagged with two keys:

- `Snapshot` (required) - the presence of this key indicates that this EBS volume needs to be snapshotted when the lambda function runs. Ideally, the lambda function will be scheduled once a day.

- `Retention` (optional) - the value of this tag specifies the number of days the snapshot has to be retained before it is purged. Any snapshot that is created is tagged with the date at which it should be deleted, based on this value. If this tag is not present, a `defaultRetention` value specified in `lambda/config.json` is used (default: 7 days).

