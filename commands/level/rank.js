const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');
const ns = require('number-string');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const Ranks = require('../../bot_modules/cmds/rankFunctions.js');


module.exports = {
    name: 'rank',
    description: 'Shows either your own, or someone else\'s current XP total and Level',
    usage: '[@user]',
    aliases: ['xp', 'level'],
    //args: true,
    commandType: 'level',
    cooldown: 6, // IN SECONDS

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


      if (!args.length) {
        return await Ranks.Author(message, PREFIX);
      }
      else {
        return await Ranks.MentionedUser(message, PREFIX, args);
      }



      //END OF COMMAND
    },
};
