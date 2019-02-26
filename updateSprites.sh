#!/usr/bin/env bash
startingDir=$(pwd);
cd $INIT_CWD;
mkdir sprites;
cd sprites;
curl -O https://alttpr.com/sprites;
mv sprites sprites.json
