#!/usr/bin/env bash
startingDir=$(pwd);
echo '$' $startingDir;
cd $INIT_CWD;
mkdir sprites;
cd sprites;
curl -O https://alttpr.com/sprites;
mv sprites sprites.json
cp $startingDir/sprites/001.link.1.zspr $INIT_CWD/sprites/001.link.1.zspr
