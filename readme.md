# Randomizer - CLI
### For alttpr

## Requirements

- Zelda no Densetsu - Kamigami no Triforce (Japan).sfc with checksum 3322EFFC

![Google 3322EFFC to ensure you've got the right rom](http://alttp.mymm1.com/game/findrom.png)

- An internet connection. This program was designed with an internet connection in mind. If you have a reason to run it without, let me know what that is, and maybe we can help you out.

## What does it do?

This is a node based version of https://alttpr.com/en/daily. The biggest difference is that this removes the browser dependency. It still functions in the same way, as far as patching goes; uses local rom, patch comes from the same source as it does the site, and the patch is applied locally (no sending roms in either direction).

The website has a bunch of configuration as well (heart color, quickswap, pick a sprite) all of which has been reproduced in the run.js script.

To know which daily it should pull down, it reads the /daily page, and scrapes out the current rom hash, the base patch, and the daily hash. From there I can request the daily patch. This patch is then applied to the local rom.

## Install

    git clone https://github.com/loadedsith/alttpr-cli.git

## Use

    cd [randomizer-repo]
    node run.js --help

    Usage: run.js <command> [options]

    Commands:
      run.js update  Update daily rom                                   [aliases: u]

    Options:
      --version          Show version number                               [boolean]
      -r, --rom          Specify rom.
                 [default: "./Zelda no Densetsu - Kamigami no Triforce (Japan).sfc"]
      -p, --patch        Specify patch.                    [default: "./daily.json"]
      -t, --spriteName   Sprite name.                              [default: "Link"]
      -h, --heartColor   Heart color. Choices blue, green, yellow or red.
                                                                    [default: "red"]
      -s, --heartSpeed   Health alert tone frequency. Choices instant, fast, normal,
                         or slow                                 [default: "normal"]
      -m, --menuSpeed    Menu speed. Choices instant, fast, normal, or slow
                                                                 [default: "normal"]
      -q, --quickswap    Quick swap items with L or R.              [default: false]
      -v, --musicVolume  Music volume. Disable for MSU-1 support.   [default: false]
      -?, --help         Show help                                         [boolean]

    Examples:
      run.js -r "./Zelda no Densetsu -          Build a rom.
      Kamigami no Triforce (Japan).sfc" -p
      "./daily.json"

## Road map

Wrappers! (I'm gonna start with EmulationStation on the Raspberry Pi).
