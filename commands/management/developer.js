const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const Devs = require('../../bot_modules/cmds/devFunctions.js');


module.exports = {
    name: 'developer',
    description: 'A bunch of sub-commands for development purposes. *See [GitHub README](https://github.com/TwilightZebby/CrimsonLevelsBot) for more details*',
    usage: ' ',
    aliases: ['dev'],
    args: true,
    commandType: 'management',
    //cooldown: 3, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    limitation: 'dev',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);
      
      
      // Check first argument
      let subCmd = args.shift();
      switch (subCmd) {

        case `user`:
          return await Devs.UserMain(message, args);

        

        case `global`:
          return await Devs.GlobalMain(message, args);



        case `killswitch`:
        case `kill`:
          if (args.length > 0) {
            return await Devs.KillSwitch(Number(args[0]));
          }
          else {
            return await Devs.KillSwitch();
          }




        case 'test':
          return await Devs.Test(message);



        default:
          return await Error.LogToUser(message.channel, `That was not a valid sub-command of the Developer Module! Please check the [GitHub README](https://github.com/TwilightZebby/CrimsonLevelsBot) for more details...`);

      }

      //END OF COMMAND
    },
};
