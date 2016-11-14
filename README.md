# ebs-snapshot-lambda

AWS lambda function to snapshot EBS volumes and purge old snapshots.

## Requirements

The EBS volumes that are to be snapshotted need to be tagged with two keys:

- `Snapshot` (required) - the presence of this key indicates that this EBS volume needs to be snapshotted when the lambda function runs. Ideally, the lambda function will be scheduled once a day.

- `Retention` (optional) - the value of this tag specifies the number of days the snapshot has to be retained before it is purged. Any snapshot that is created is tagged with the date at which it should be deleted, based on this value. If this tag is not present, a `defaultRetention` value specified in `lambda/config.json` is used (default: 7 days).

## Configuration

The `lambda/config.json` has the following configurations that can be modified as required:

- `defaultRetention` - A volume that is marked to be snapshotted with the `Snapshot` tag can also have a `Retention` tag with the number of days its snapshots have to be retained before purge. If the `Retention` tag is not present, this value will be used.

- `copyVolumeTagsToSnapshot` - If this is set to true, all the tags of the volume, except `Snapshot` and `Retention`, are copied over to the snapshot.

## Installation

### Manual

Once `lambda/config.json` has been edited as required, run `npm install --production` or `yarn install --production` from `lambda/` and zip up the folder. The zip archive can then be deployed like any other lambda function.

### Terraform

The repo also comes with terraform plans to setup and install the lambda function, along with the required schedules and IAM role/policy. Verify with `terraform plan` and deploy with `terraform apply`.

## License

This is an open source project licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

