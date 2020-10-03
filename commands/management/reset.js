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
//const Roles = require('../../bot_modules/cmds/roleFunctions.js');
const Resets = require('../../bot_modules/cmds/resetFunctions.js');


module.exports = {
    name: 'reset',
    description: 'Used by Server Owners to reset the XP total of either a specific Member, or all Members in the Server',
    usage: '<@user||all>',
    //aliases: [''],
    args: true,
    commandType: 'management',
    cooldown: 5, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {
      
      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);

      let option = args.shift();

      if ( option === "all" ) {
        return await Resets.Confirm(message, "all")
      }
      else {

        // fetch User object
        let fetchedUser = await Resets.UserCheck(option);

        if (fetchedUser === "fail") {
          return message.reply(`That wasn't a valid User or "all" - please try again!`);
        }
        else {
          return await Resets.Confirm(message, "user", fetchedUser);
        }

      }

      //END OF COMMAND
    },
};
