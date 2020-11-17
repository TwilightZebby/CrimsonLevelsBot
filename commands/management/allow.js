const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
//const XPs = require('../../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../../bot_modules/leveling/levelFunctions.js');
//const Tables = require('../../bot_modules/tables.js');
//const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const BlockList = require('../../bot_modules/cmds/blockListFunctions.js');


module.exports = {
    name: 'allow',
    description: 'Used to remove Users, Channels and Roles from the Server\'s BlockList',
    usage: '<mentionOrID>',
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
    limitation: 'mod',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);

      return await BlockList.Allow(message, args);



      //END OF COMMAND
    },
};
