#!/usr/bin/env bash

echo " █████╗ ██╗  ████████╗████████╗██████╗
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

npx -p github:loadedsith/alttpr-cli -c "alttpr-cli update && alttpr-cli build $BUILD_FLAGS"

echo "\nRom built!\n Waiting 10 seconds so you can see what you're up against!\n"
sleep 10s

echo "\nRestarting emulation station\n"
sleep 3s

touch /tmp/es-restart
killall -e "/opt/retropie/supplementary/emulationstation/emulationstation"
sleep 3s

emulationstation &
