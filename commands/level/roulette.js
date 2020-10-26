const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const Roles = require('../../bot_modules/cmds/roleFunctions.js');
const Roulettes = require('../../bot_modules/cmds/rouletteFunctions.js');


module.exports = {
    name: 'roulette',
    description: 'Spin the Roulette Wheel to see if you can increase your level or risk losing XP!',
    usage: '<xpAmount>',
    aliases: ['roul', 'r'],
    args: true,
    commandType: 'level',
    cooldown: 3600, // IN SECONDS // 12 hours = 43200 seconds, 1 hour = 3600

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those with the ADMIN Permission, the Guild Owner, and me only
    //    'mod' - Those with the MANAGE_SERVER/BAN_MEMBERS/ADMIN Permissions, the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {
      
      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);


      // Bring in Databases
      let authorXP = await XPs.FetchXP(message);
      let guildConfig = await Tables.GuildConfig.findOrCreate(
        {
          where: {
            guildID: message.guild.id
          }
        }
      ).catch(async err => {
        await Error.LogCustom(err, `Attempted data fetch for GUILDCONFIG in Guild ${message.guild.name}`);
        return await Error.LogToUser(message.channel, `Failed to fetch the set configuration settings for this Guild. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
      });

      guildConfig = guildConfig[0].dataValues;




      // Construct basic Embed
      const embed = new Discord.MessageEmbed().setColor('#DC143C');




      // Check the Roulette Command is enabled first
      if ( guildConfig.roulette === "false" ) {
        embed.setTitle(`⛔ Command disabled by Server Owner`)
        .setDescription(`The \`roulette\` command was disabled by this Server's Owner!`);
        return await message.channel.send(embed);
      }
      else {

        // Check first argument is a number for the XP Bet
        if (isNaN(args[0])) {

          // Remove roulette cooldown due to error
          let timestamps = client.rouletteCooldowns.get(message.guild.id);

          if (timestamps.has(message.author.id)) {
            timestamps.delete(message.author.id);
          }

          return await Error.LogToUser(message.channel, `I was unable to convert that Bet into a Number! Please try again...`);

        }

        let bet = Number(args.shift());




        // Check Bet is SMALLER THAN Author's current XP count
        if ( bet > authorXP ) {

          // Remove roulette cooldown due to error
          let timestamps = client.rouletteCooldowns.get(message.guild.id);

          if (timestamps.has(message.author.id)) {
            timestamps.delete(message.author.id);
          }

          return await Error.LogToUser(message.channel, `Sorry, but you can't bet more XP then you actually have!\n*Your bet is **${bet - authorXP}** XP over what you have*`);

        }





        // For ease when it comes to halving, have a minimum bet of 2
        if ( bet < 2 ) {

          // Remove command cooldown
          let timestamps = client.rouletteCooldowns.get(message.guild.id);

          if (timestamps.has(message.author.id)) {
            timestamps.delete(message.author.id);
          }

          return await Error.LogToUser(message.channel, `Sorry, but the smallest amount of XP you can bet is \`2\` XP.`);

        }




        
        return await Roulettes.MainStandard(message, bet, authorXP);

      }

      
      //END OF COMMAND
    },
};
