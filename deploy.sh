#!/bin/bash

# NOTE:
# Before running this script, 
# 1. run the following command:
# brew install --cask google-cloud-sdk
# chmod +x deploy.sh
# 2. add IAM Key file `deploy-key.json`

# command to run script
# ./deploy.sh staging

PROJECT_ID="time-e"
BUILD_DIR="dist"

STAGING_BUCKET="dev.sapms.appbaystudio.com"
# PRODUCTION_BUCKET=""

if [ -z "$1" ]; then
  echo "ERROR: No environment specified."
  echo "Usage: ./deploy.sh [staging|production]"
  exit 1
fi
if [ "$1" == "staging" ]; then
  BUCKET_NAME=$STAGING_BUCKET
# elif [ "$1" == "production" ]; then
#  BUCKET_NAME=$PRODUCTION_BUCKET
else
  echo "ERROR: Invalid environment '$1'."
  echo "Usage: ./deploy.sh [staging|production]"
  exit 1
fi

echo "Authenticating with GCP..."
gcloud auth activate-service-account --key-file=deploy-key.json
gcloud config set project $PROJECT_ID

echo "Building React app..."
if ! yarn build; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

echo "Uploading build files to GCP bucket..."
gcloud storage rsync $BUILD_DIR gs://$BUCKET_NAME --recursive --delete-unmatched-destination-objects

echo "Deployment complete!"