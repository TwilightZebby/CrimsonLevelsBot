const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
//const XPs = require('../../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../../bot_modules/leveling/levelFunctions.js');
//const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const Roles = require('../../bot_modules/cmds/roleFunctions.js');


module.exports = {
    name: 'role',
    description: 'Used to configure the Level Reward Roles for the Server',
    usage: ' ',
    aliases: ['roles'],
    //args: true,
    commandType: 'management',
    cooldown: 8, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    limitation: 'admin',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);

      let embed = new Discord.MessageEmbed().setColor('#DC143C');
      
      if ( !args || !args.length ) {

        // Bring up a list of all set Reward Roles, if any
        return await Roles.ListRoles(message, embed);

      }
      else {

        let option = args.shift();

        switch (option) {

          case 'guide':
            // Bring up Role Module Guide
            return await Roles.Guide(message, embed);



          case 'add':
            // Assign a new Role
            return await Roles.AddRole(message, args, embed);



          case 'remove':
            // Unassign/Clear a Role
            return await Roles.RemoveRole(message, args, embed);



          case 'reset':
            // Reset all assigned Roles from this Guild's DB
            return await Roles.ResetRoles(message, embed);



          default:
            return await Error.LogToUser(message.channel, `That wasn't a valid option for the \`${PREFIX}role\` command!\nPlease use \`${PREFIX} role guide\` to see all the valid options`);
          
        }

      }



      //END OF COMMAND
    },
};
