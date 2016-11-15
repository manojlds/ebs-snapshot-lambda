#!/bin/bash

set -e

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LAMBDA_DIR="$1"

pushd "${LAMBDA_DIR}"
rm -rf ebs_snapshot_lambda-*.tgz
npm pack

pushd "$2"
rm -rf package/
tar xvf ${LAMBDA_DIR}/ebs_snapshot_lambda-*.tgz
pushd package/
npm install --production
