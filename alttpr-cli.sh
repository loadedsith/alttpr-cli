#!/usr/bin/env bash

echo "
█████╗ ██╗  ████████╗████████╗██████╗
██╔══██╗██║  ╚══██╔══╝╚══██╔══╝██╔══██╗
███████║██║     ██║      ██║   ██████╔╝
██╔══██║██║     ██║      ██║   ██╔═══╝
██║  ██║███████╗██║      ██║   ██║
╚═╝  ╚═╝╚══════╝╚═╝      ╚═╝   ╚═╝

██████╗  █████╗ ███╗   ██╗██████╗  ██████╗ ███╗   ███╗██╗███████╗███████╗██████╗
██╔══██╗██╔══██╗████╗  ██║██╔══██╗██╔═══██╗████╗ ████║██║╚══███╔╝██╔════╝██╔══██╗
██████╔╝███████║██╔██╗ ██║██║  ██║██║   ██║██╔████╔██║██║  ███╔╝ █████╗  ██████╔╝
██╔══██╗██╔══██║██║╚██╗██║██║  ██║██║   ██║██║╚██╔╝██║██║ ███╔╝  ██╔══╝  ██╔══██╗
██║  ██║██║  ██║██║ ╚████║██████╔╝╚██████╔╝██║ ╚═╝ ██║██║███████╗███████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝

https://alttpr.com/en/daily
https://github.com/loadedsith/alttpr-cli
"

if [[ -z "${ALTTPR_SNES_ROMS}" ]]; then
  SNES_ROM="/home/pi/RetroPie/roms/snes"
else
  SNES_ROM="${ALTTPR_SNES_ROMS}"
fi

if [[ -z "${ALTTPR_BUILD_FLAGS}" ]]; then
  BUILD_FLAGS="-t random"
else
  BUILD_FLAGS="${ALTTPR_BUILD_FLAGS}"
fi

if [ -d "$SNES_ROM" ]; then
  cd $SNES_ROM;
fi
echo "
Working directory: $SNES_ROM
"
npx -p github:loadedsith/alttpr-cli -c "alttpr-cli check && alttpr-cli update && alttpr-cli build $BUILD_FLAGS"

echo "
Rom built!
Waiting 10 seconds so you can see what you're up against!
"

sleep 10s

echo "
Restarting emulation station.
"

sleep 3s

touch /tmp/es-restart
killall -e "/opt/retropie/supplementary/emulationstation/emulationstation"
sleep 3s

emulationstation &
