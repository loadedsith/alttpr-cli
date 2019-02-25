# Randomizer - CLI
### For alttpr

## Requirements

Somewhere on your system you must have a file that contains the following game:

Zelda no Densetsu - Kamigami no Triforce (Japan).sfc - 3322EFFC

![http://alttp.mymm1.com/game/findrom.png]

An internet connection. This program was designed with an internet connection in mind. If you have a reason to run it without, let me know what that is, and maybe we can help you out.

## Install

git clone [randomizer-repo]

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
