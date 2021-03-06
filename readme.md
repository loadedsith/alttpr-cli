# Randomizer - CLI
#### For alttpr

## Requirements

- _Zelda no Densetsu - Kamigami no Triforce (Japan).sfc_
  - checksum **3322EFFC**
  - the examples all assume this file is in your current directory.

![Google 3322EFFC to ensure you've got the right rom](http://alttp.mymm1.com/game/findrom.png)

- An internet connection.

## What does it do?

This is a node based version of https://alttpr.com/en/daily. It functions in the same way. The patch comes from alttpr.com, is applied locally.

Configuration of heart color, quick-swap, sprites, and more have been reproduced in the script.

Daily patches are generated by scraping the alttpr.com Daily page, retrieving current rom hash, the base patch, and the daily hash. From there we can request the daily patch.

Sprites and patches are downloaded on demand into the current folder.

## With `npx`

Download the daily patch;

    npx github:loadedsith/alttpr-cli update

Build the daily rom;

    npx github:loadedsith/alttpr-cli build [params]

For more settings:

    npx github:loadedsith/alttpr-cli --help


## With `npx`

First install into your current directory

    npm install github:loadedsith/alttpr-cli

or globally with -g

    npm install -g github:loadedsith/alttpr-cli

Then use

    alttpr-cli update
    alttpr-cli build [params]

global installs will have `alttpr-cli` everywhere, where local installs will have it only in the installed directory.

## With Git

Clone the repo;

    git clone https://github.com/loadedsith/alttpr-cli.git

Bash:

    cd alttpr-cli
    node run.js update
    node run.js build [params]

## Parameters

The following output is from the `npm run` version of the command, but the flags are the same for each method.

    Usage: run <command> [options]

    Commands:
      run daily  Update daily rom                            [aliases: d, update, u]
      run get    Download a permanent linked hash.            [aliases: g, download]
      run build  Update daily rom                                       [aliases: b]

    Options:
      --version          Show version number                               [boolean]
      -r, --rom          Specify rom.
                 [default: "./Zelda no Densetsu - Kamigami no Triforce (Japan).sfc"]
      -p, --patch        Specify patch.                    [default: "./daily.json"]
      -t, --spriteName   Sprite name.                              [default: "Link"]
      -h, --heartColor   Heart color
                        [choices: "blue", "green", "yellow", "red"] [default: "red"]
      -s, --heartSpeed   Health alert tone frequency.
                  [choices: "instant", "fast", "normal", "slow"] [default: "normal"]
      -z, --spoiler      Print spoiler log after building           [default: false]
      -m, --menuSpeed    Menu speed.
                  [choices: "instant", "fast", "normal", "slow"] [default: "normal"]
      -q, --quickswap    Quick swap items with L or R.              [default: false]
      -v, --musicVolume  Music volume. Disable for MSU-1 support.    [default: true]
      -?, --help         Show help                                         [boolean]

    Examples:
      run -r "./Zelda no Densetsu - Kamigami    Build a rom.
      no Triforce (Japan).sfc" -p
      "./daily.json"
For Node support, see `unit_test.js`.

## Config

[About using environment vars](https://askubuntu.com/a/58828)

#### Sprites Dir

A custom sprite directory may be supplied to `updateSprites.sh` through the environment variable `ALTTPR_SPRITES`. When not present, this defaults to the node execution directory + '/sprites'; `$INIT_CWD/sprites`.

This folder is created when not found.

#### Roms Dir

A custom rom directory may be supplied to `alttpr-cli.sh` through the environment variable `ALTTPR_SNES_ROMS`. When not present, this defaults to the RetroPi default rom path; /home/pi/RetroPie/roms/snes.

#### Default build flags

Custom build flags may be supplied to `alttpr-cli.sh` through the environment variable `ALTTPR_BUILD_FLAGS`. When not present, this defaults to build with a random sprite; "-t random".

## File naming

Daily roms come in this format:

    Daily Challenge: Feb 25, 2019

Hash based roms:

    ALttP - VT_no-glitches-30_normal-standard_randomized-pedestal_qZGLj5lXvk


## Examples

- Get a Daily and build it.

        npx github:loadedsith/alttpr-cli update
        npx github:loadedsith/alttpr-cli build

- Get a specific patch and build it

        npx github:loadedsith/alttpr-cli get qZGLj5lXvk
        npx github:loadedsith/alttpr-cli build -p ./qZGLj5lXvk.json


- Build the current daily with Zero Suit Samus

        npx github:loadedsith/alttpr-cli build -t "Zero Suit Samus"

- Build the current daily with a random sprite

        npx github:loadedsith/alttpr-cli build -t random

- Build the current daily with a random sprite and quickswap

        npx github:loadedsith/alttpr-cli build -t random -q

- Update and build with a random sprite in a single command:

        npx -p github:loadedsith/alttpr-cli -c "alttpr-cli update && alttpr-cli build -t random"

## RetroArch

`alttpr-cli.sh` is a non-interactive shell script that pulls the latest daily and builds a rom. It assumes your **3322EFFC** rom is named _"Zelda no Densetsu - Kamigami no Triforce (Japan).sfc"_ and is in `/home/pi/RetroPie/roms/snes`. It will use a random sprite.

Customization can be applied to `~/RetroPie/retropiemenu/alttpr-cli.sh` after installation.

To see the new rom restart EmulatorStation after each run.  This should be done automatically, but it is worth noting.

SSH in to your Pi.

    ssh pi@[your pi's ip/host goes here]

Install node.

    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs


Install the script;

    cd ~/RetroPie/retropiemenu/
    curl -O https://raw.githubusercontent.com/loadedsith/alttpr-cli/master/alttpr-cli.sh

Reboot EmulatorStation.

Run from the RetroPie Menu.



## Sprites

Updating: Reinstall the package to pull the latest sprites.json.

See the [official spite gallery](https://alttpr.com/en/sprite_preview).

Valid names:
- "Link"
- "Four Swords Link"
- "Arrghus"
- "Beau"
- "Bewp"
- "Big Key"
- "Blacksmith Link"
- "Bob"
- "Boo 2"
- "Boo"
- "Broccoli"
- "Bronzor"
- "B.S. Boy"
- "B.S. Girl"
- "Cactuar"
- "Casual Zelda"
- "Marvin the Cat"
- "Cat Boo"
- "CD-i Link"
- "Celes"
- "Cheep Cheep"
- "Cirno"
- "Clifford"
- "Conker"
- "Cursor"
- "Dark Boy"
- "Dark Girl"
- "Dark Link (Tunic)"
- "Dark Link"
- "Dark Swatchy"
- "Dark Zelda"
- "Dark Zora"
- "Deadrock"
- "Decidueye"
- "Demon Link"
- "Dragonite"
- "Eggplant"
- "EmoSaru"
- "Fox Link"
- "Frog Link"
- "Ganondorf"
- "Garfield"
- "Goomba"
- "GrandPOOBear"
- "Gruncle Stan"
- "Headless Link"
- "Hoarder (Bush)"
- "Hoarder (Pot)"
- "Hoarder (Rock)"
- "Homer Simpson"
- "Hyrule Knight"
- "Ignignokt"
- "Inkling"
- "Invisible Link"
- "Jogurt"
- "Kecleon"
- "Kholdstare"
- "Kirby"
- "Kore8"
- "Lakitu"
- "Hat Color Link"
- "Tunic Color Link"
- "Pony"
- "Luigi"
- "Magus"
- "Maiden"
- "Manga Link"
- "Maple Queen"
- "Mario (Classic)"
- "Mario and Cappy"
- "Marisa Kirisame"
- "Meatwad"
- "Megaman X"
- "Mike Jones"
- "Minish Cap Link"
- "missingno"
- "Modern Link"
- "Mog"
- "Mouse"
- "Power Up with Pride Mushroom"
- "Nature Link"
- "Navi"
- "Negative Link"
- "NES Link"
- "Ness (Earthbound)"
- "Old Man"
- "Ori"
- "Outline Link"
- "Parallel Worlds Link"
- "Penguin Link"
- "Phoenix Wright"
- "Pikachu"
- "Pink Ribbon Link"
- "Plague Knight"
- "Pokey"
- "Popoi"
- "Pride Link"
- "Psyduck"
- "The Pug"
- "Purple Chest"
- "Rainbow Link"
- "Robo-Link 9000"
- "Roy Koopa"
- "Rumia"
- "Ryu"
- "Sailor Moon"
- "Samus"
- "Santa Link"
- "Scholar"
- "Shadow Sakura"
- "Shantae"
- "Shuppet"
- "Shy Guy"
- "SNES Controller"
- "Soda Can"
- "Hyrule Soldier"
- "Sonic the Hedgehog"
- "Sora"
- "Squirtle"
- "Static Link"
- "Super Bunny"
- "Super Meat Boy"
- "Swatchy"
- "Tea Time"
- "Terra (Esper)"
- "Thief"
- "Tile"
- "Tingle"
- "TMNT"
- "Toad"
- "Toadette"
- "TotemLinks"
- "Trogdor the Burninator"
- "TP Zelda"
- "Ultros"
- "Valeera"
- "VanillaLink"
- "Vitreous"
- "Vivi"
- "Vivian"
- "Will"
- "wixB"
- "Wizzrobe"
- "Yunica Tovah"
- "Zandra"
- "Zelda"
- "Zero Suit Samus"
- "Zora"
