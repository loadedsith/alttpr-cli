#!/usr/bin/env bash
cd /home/pi/RetroPie/roms/snes

npx github:loadedsith/alttpr-cli update
npx github:loadedsith/alttpr-cli build -t random

echo "Rom built, waiting 10 seconds so you can see what you're up against!"

sleep 10s
