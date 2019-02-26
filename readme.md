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

## With NPX

First install

    npm install github:loadedsith/alttpr-cli

With npx:

Download the daily patch;

    npx alttpr-cli update

Build the daily rom;

    npx alttpr-cli build [params]

For more settings:

    npx alttpr-cli --help

## With Git

Clone the repo;

    git clone https://github.com/loadedsith/alttpr-cli.git

Bash:

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
      run.js -r "./Zelda no Densetsu - Kamigami no Triforce (Japan).sfc" -p "./daily.json"   [Build a rom]

For Node support, see `unit_test.js`.


## Road map

Wrappers! (I'm gonna start with EmulationStation on the Raspberry Pi).

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
- " NES Link"
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
