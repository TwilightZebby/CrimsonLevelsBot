const Discord = require("discord.js");
//const fs = require('fs');
//const Canvas = require('canvas');
//const { client } = require('../bot_modules/constants.js');

//let { PREFIX } = require('../config.js');
//const XPs = require('../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../bot_modules/leveling/levelFunctions.js');
//const Tables = require('../bot_modules/tables.js');
//const Error = require('../bot_modules/onEvents/errors.js');
//const Prefixs = require('../bot_modules/prefixFunctions.js');
//const Roles = require('../../bot_modules/cmds/roleFunctions.js');


module.exports = {
    name: 'say',
    description: 'Tells the Bot to repeat something',
    usage: '<message> OR say embed <embedDescription> OR say embed <embedTitle> // <embedDescription>',
    //aliases: [''],
    args: true,
    commandType: 'general',
    cooldown: 1, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those with the ADMIN Permission, the Guild Owner, and me only
    //    'mod' - Those with the MANAGE_SERVER/BAN_MEMBERS/ADMIN Permissions, the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    limitation: 'dev',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],


    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args 
     */
    async execute(message, args) {
      
      // Check for custom Prefix
      //PREFIX = await Prefixs.Fetch(message.guild.id);

      // Check for "embed"
      if (args[0] === "embed") {

        // EMBED TIME
        // Am I wanting an Embed Title? (yes if I included "//")
        if (message.content.includes(" // ")) {

          args.shift(); // Remove "embed"
          let argString = args.join(' ');
          argString = argString.split(" // ");

          const embed = new Discord.MessageEmbed().setTitle(`${argString[0]}`).setDescription(`${argString[1]}`);
          await message.channel.send(embed);
          return await message.delete({
            reason: `${message.author.username} used my Say command`
          });

        }
        else {

          args.shift(); // Remove "embed"
          let argString = args.join(' ');

          const embed = new Discord.MessageEmbed().setDescription(`${argString}`);
          await message.channel.send(embed);
          return await message.delete({
            reason: `${message.author.username} used my Say command`
          });

        }

      }
      else {

        // No embed, just raw Text
        let argString = args.join(' ');
        await message.channel.send(`${argString}`);
        return await message.delete({
          reason: `${message.author.username} used my Say command`
        });

      }


      //END OF COMMAND
    },
};
