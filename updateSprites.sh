#!/usr/bin/env bash
startingDir=$(pwd);
if [[ -z "${ALTTPR_SPRITES}" ]]; then
  ALTTPR_SPRITES_PATH="$startingDir/sprites"
else
  ALTTPR_SPRITES_PATH="${ALTTPR_SPRITES}"
fi

cd "$startingDir";

if [ ! -d "$ALTTPR_SPRITES_PATH" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Creating spites folder at $ALTTPR_SPRITES_PATH";
  mkdir -p $ALTTPR_SPRITES_PATH;
else
  echo "Spites folder exists at $ALTTPR_SPRITES_PATH";
fi

cd "$ALTTPR_SPRITES_PATH";

echo "Downloading sprites information."
pwd
curl --progress-bar https://alttpr.com/sprites > sprites.json
echo "Grabbing a sprite for testing 4slink-armors.1.zspr"
cd "$startingDir/spec"

if [ ! -d "sprites" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Creating spec/spites folder at:";
  pwd
  mkdir -p sprites
  cd sprites
  mkdir -p www
  cd "$startingDir"
else
  echo "Spec/spites folder exists at:";
  pwd
fi

cd sprites/www

curl -O https://alttpr-assets.s3.us-east-2.amazonaws.com/4slink-armors.1.zspr