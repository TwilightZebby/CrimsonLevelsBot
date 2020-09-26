const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
//const XPs = require('../../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');


module.exports = {
    name: 'prefix',
    description: 'Either displays the current Prefix, or changes it for this Guild',
    usage: '[newPrefix]',
    //aliases: [''],
    //args: true,
    commandType: 'management',
    cooldown: 5, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);

      let embed = new Discord.MessageEmbed().setColor('#DC143C');
      
      if ( !args.length || !args ) {

        embed.setDescription(`The current Prefix for this Server is **${PREFIX}**
        (You can use \<\@${client.user.id}\> as a prefix too!)`);

        return await message.channel.send(embed);

      }
      else {

        if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID ) {
          return await message.reply(`Sorry, but only the Owner (**${message.guild.owner.displayName}**) of this Server can change the Bot's Prefix!`);
        }
        else {

          return await Prefixs.Update(message.guild.id, String(args[0]), message);

        }

      }



      //END OF COMMAND
    },
};
