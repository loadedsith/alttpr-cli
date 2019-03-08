#!/usr/bin/env bash
startingDir=$(pwd);
if [[ -z "${ALTTPR_SPRITES}" ]]; then
  ALTTPR_SPRITES_PATH="$INIT_CWD/sprites"
else
  ALTTPR_SPRITES_PATH="${ALTTPR_SPRITES}"
fi

cd $INIT_CWD;

if [ ! -d "$ALTTPR_SPRITES_PATH" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Creating spites folder at $ALTTPR_SPRITES_PATH";
  mkdir -p $ALTTPR_SPRITES_PATH;
else
  echo "Spites folder exists at $ALTTPR_SPRITES_PATH";
fi

cd $ALTTPR_SPRITES_PATH;

echo "Downloading sprites information."

curl --progress-bar https://alttpr.com/sprites > sprites.json
