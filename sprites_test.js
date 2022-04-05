const {
  spriteNames,
  downloadSprite,
  getSpriteFileName,
  getSpriteUrl,
} = require('./sprites.js');

const path = require('path');
const url = require('url');
const fs = require('fs');
const nock = require('nock');
const scope = nock('https://alttpr-assets.s3.us-east-2.amazonaws.com')
  .persist()
  .get(/(.*)/)
  .reply(200, (uri, requestBody, cb) => {
    const spriteName =
        path.basename(url.parse(uri).pathname);
    console.log({spriteName});
    fs.readFile(`./spec/sprites/www/${spriteName}`, cb); // Error-first callback
  });

nock.disableNetConnect();


describe('Sprites', () => {
  beforeAll(() => {
    let removeTestFiles = [
      './spec/sprites/workspace/4slink-armors.1.zspr'
    ];
    removeTestFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    })
  });

  it('should list sprite names', () => {
    expect(spriteNames).toEqual([
      "Link", "Four Swords Link", "Abigail", "Adol", "Adventure 2600", "Aggretsuko", "Alice",
      "Angry Video Game Nerd", "Arcane", "ArcticArtemisFox", "Aria", "Ark (No Cape)", "Ark (Cape)",
      "Arrghus", "Astor", "Astronaut", "Asuna", "Baba", "Baby Fro", "Badeline", 
      "Bananas In Pyjamas", "Bandit", "Batman", "Beau", "Bee", "Bel", "Bewp", "Big Key",
      "Birb of Paradise", "Birb", "Birdfruit", "Birdo", "Black Mage", "Blacksmith Link", "Blazer",
      "Blossom", "Bob", "Bob Ross", "Boco the Chocobo", "Boo 2", "Boo", "Bottle o' Goo",
      "BotW Link", "BotW Zelda", "Bowser", "Bowsette (Red)", "Bowsette", "Branch", "Brian", 
      "Broccoli", "Bronzor", "B.S. Boy", "B.S. Girl", "Bubbles", "Bullet Bill", "Buttercup", 
      "Cactuar", "Cadence", "Captain Novolin", "CarlSagan42", "Casual Zelda", "Marvin the Cat", 
      "Cat Boo", "Catgirl (Hidari)", "CD-i Link", "Celes", "Centaur Enos", "Charizard", 
      "Cheep Cheep", "Chef Pepper", "Chibity", "Chrizzz", "Chrono", "Cinna", "Cirno", "Clifford", 
      "Clippy", "Cloud", "Clyde", "Conker Neo", "Conker", "Cornelius", "Corona", "Crewmate", 
      "Cucco", "Cursor", "D.Owls", "Dark Link (Zelda 2)", "Dark Panda", "Dark Boy", "Dark Girl", 
      "Dark Link (Tunic)", "Dark Link", "Dark Swatchy", "Dark Zelda", "Dark Zora", 
      "Deadpool (Mythic)", "Deadpool (SirCzah)", "Deadrock", "Decidueye", "Dekar", 
      "Demon Link", "Dennsen86", "Diddy Kong", "Dig Dug", "Dipper", "Discord", "Dragonair", 
      "Dragonite", "Drake The Dragon", "Eevee", "Eggplant", "Eirika", "Ema Skye", "EmoSaru", 
      "Espeon", "Ezlo", "Fi", "Fierce Deity Link", "Finn Merten", "Finny Bear", "Floodgate Fish", 
      "Flavor Guy", "Fox Link", "Freya Crescent", "Frisk", "Frog Link", "Fujin", "Future Trunks", 
      "Gamer", "Mini Ganon", "Ganondorf", "Garfield", "Garnet", "Garo Master", "GBC Link", "Geno", 
      "GliitchWiitch", "Glove Color Link", "Gobli", "Gooey", "Goomba", "Goose", "Graalian Noob", 
      "GrandPOOBear", "Gretis", "Growlithe", "Gruncle Stan", "Guiz", "Hanna", "Hardhat Beetle", 
      "Hat Kid", "Head Link", "Headless Link", "Heem", "Hello Kitty", "Hero of Awakening", 
      "Hero of Hyrule", "Hint Tile", "Hoarder (Bush)", "Hoarder (Pot)", "Hoarder (Rock)", 
      "Hollow Knight (Malmo/Winter)", "Hollow Knight", "Homer Simpson", "Hornet", "Horseman", 
      "Hotdog", "Hyrule Knight", "iBazly", "Ignignokt", "Informant Woman", "Inkling", 
      "Invisible Link", "Jack Frost", "Jason Frudnick", "Jasp", "Jogurt", "Juste Belmont", 
      "Juzcook", "Kaguya", "Kain", "Katsura", "Kecleon", "Kefka", "Kenny McCormick", "Ketchup", 
      "Kholdstare", "King Gothalion", "King Graham", "Kinu", "Kira", "Kirby (Dreamland 3)", 
      "Kirby", "Koragi", "Kore8", "Korok", "Kriv", "Lakitu", "Lapras", "League Mascot", "Lest", 
      "Lestat", "Lily", "Linja", "Link Redrawn", "Link (Zelda 1)", "Hat Color Link", 
      "Tunic Color Link", "Little Hylian", "Pony", "Locke", "Figaro Merchant", "Lucario", "Luffy", 
      "Luigi", "Luna Maindo", "Lynel (BotW)", "Mad_Tears", "Madeline", "Magus", "Maiden", 
      "Majora's Mask", "Mallow (Cat)", "Manga Link", "Maple Queen", "Marin", "Mario (Classic)", 
      "Tanooki Mario", "Mario and Cappy", "Marisa Kirisame", "Matthias", "Meatwad", "Medallions", 
      "Medli", "Megaman X", "Megaman X2", "Mega Man (Classic)", "Baby Metroid", "MewLp", 
      "Mike Jones", "Mimic", "Minish Link", "Minish Cap Link", "Mipha", "missingno", "Moblin", 
      "Modern Link", "Mog", "Momiji Inubashiri", "Moosh", "Mouse", "Ms. Paint Dog", 
      "Power Up with Pride Mushroom", "Nature Link", "Navi", "Navirou", "Ned Flanders", 
      "Negative Link", "Neosad", "Neptune", "NES Link", "Ness", "Nia", "Niddraig", "Niko", 
      "Ninten", "Octorok", "Olde Man", "Old Man", "Ori", "Outline Link", "Paper Mario", 
      "Parallel Worlds Link", "Paula", "Princess Peach", "Penguin Link", "Pete", "Phoenix Wright", 
      "Pikachu", "Pink Ribbon Link", "Piranha Plant", "Plague Knight", "Plouni", "PoC Link", 
      "Pokey", "Popoi", "Poppy", "Porg Knight", "Power Ranger", "Powerpuff Girl", "Pride Link", 
      "Primm", "Princess Bubblegum", "Prof. Renderer Grizzleton", "The Professor", "Psyduck", 
      "The Pug", "Purple Chest", "Pyro", "QuadBanger", "Rainbow Link", "Rat", "Red Mage", 
      "Reimu Hakurei", "Remeer", "Remus R Black", "Reverse Mail Order", "Rick", "Robo-Link 9000", 
      "Rocko", "Rottytops", "Rover", "Roy Koopa", "Rumia", "Rydia", "Ryu", "Sailor Jupiter", 
      "Sailor Mars", "Sailor Mercury", "Sailor Venus", "Sailor Moon", "Saitama", "Samurott", 
      "Samus (Super Metroid)", "Samus", "Samus (Classic)", "Santa Hat Link", "Santa Link", 
      "Scholar", "Selan", "SevenS1ns", "Shadow", "Shadow Sakura", "Shantae", "Shinmyoumaru Sakuna",
      "Shuppet", "Shy Gal", "Shy Guy", "SighnWaive", "Skunk", "Slime", "Slowpoke", 
      "SNES Controller", "Sobble", "Soda Can", "Sokka", "Solaire of Astora", "Hyrule Soldier", 
      "Sonic the Hedgehog", "Sora", "Sora (KH1)", "Spiked Roller", "Spongebob Squarepants", 
      "Spyro the Dragon", "Squall", "Squirrel", "Squirtle", "Stalfos", "Stan", "Static Link",
      "Steamed Hams", "Stick Man", "Super Bomb", "Super Bunny", "Super Meat Boy", "Susie",
      "Swatchy", "Swiper", "TASBot", "Tea Time", "Terra (Esper)", "Terry (Contact DS)", 
      "Tetra", "TGH", "Thief", "ThinkDorm", "Thomcrow", "Tile", "Tingle", "TMNT", "Toad", 
      "Toadette", "Captain Toadette", "TotemLinks", "Trogdor the Burninator", "TP Zelda", 
      "TwoFaced", "Ty the Tasmanian Tiger", "Ultros", "Umbreon", "Valeera", "VanillaLink", 
      "Vaporeon", "Vegeta", "Vera", "Vitreous", "Vivi", "Vivian", "Wario", "White Mage", "Will", 
      "Wizzrobe", "Wolf Link (Festive)", "Wolf Link (TP)", "Yoshi", "Yunica Tovah", "Zandra", 
      "Zaruvyen", "Zebra Unicorn", "Zeckemyro", "Zelda", "Zero Suit Samus", "Zora",
    ]);
  });

  it('should get a sprite url based on a sprite name', () => {
    expect(getSpriteUrl('Four Swords Link')).toEqual(
        'https:\/\/alttpr-assets.s3.us-east-2.amazonaws.com\/4slink-armors.1.zspr');
  });

  it('should get a sprite filename based on a sprite name', () => {
    expect(getSpriteFileName('Four Swords Link')).toEqual('4slink-armors.1.zspr');
  });

  it('should download a sprite', (done) => {
    downloadSprite('Four Swords Link', 'spec/sprites/workspace').then(() => {
      expect(fs.existsSync('./spec/sprites/workspace/4slink-armors.1.zspr'))
          .toBe(true);

      done();
    });
  });

  it('should fail to download a sprite; missing sprite', (done) => {
      downloadSprite('notARealSprite', 'spec/sprites/workspace').then(() => {
        expect('This code should be unreachable').toEqual(false);
        done()
      }).catch((e) => {
        expect(e.message).toEqual('No sprite found in the sprite.json. Did you try' +
          ' `npm run update-sprites`?');
        done()
      });
  });

  it('should fail to download a sprite; real sprite, missing download', (done) => {
      downloadSprite('Bewp', 'spec/sprites/workspace').then(() => {
        expect('This code should be unreachable').toEqual(false);
        done()
      }).catch((e) => {
        const indexOfDivider = e.message.indexOf('].') + 2;
        expect(e.message.slice(0,indexOfDivider)).toEqual('Failed to download Bewp:' +
            ' [https://alttpr-assets.s3.us-east-2.amazonaws.com/bewp\.1\.zspr].');
        expect(fs.existsSync('./spec/sprites/workspace/Bewp.1.zspr'))
            .toBe(false);
        done();
    });
  });
});

