const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');
let help = require('../bot_modules/cmds/helpFunctions.js');


module.exports = {
    name: 'help',
    description: 'Lists all of my commands, or can be used to show more info on a specific command',
    usage: '[command]',
    //aliases: [''],
    //args: true,
    commandType: 'general',
    //cooldown: 3, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    async execute(message, args) {
      
      const { commands } = message.client; // Fetch commands
      const embed = new Discord.MessageEmbed().setColor('#07f51b').setFooter(`Help Module`);


      // ********** NO ARGUMENT WAS PASSED
      if ( !args.length ) {

        return await help.ListCommands(embed, message, commands);

      }
      // ********** ARGUMENT WAS PASSED
      else {

        let name = args[0].toLowerCase();

        return await help.CommandHelp(embed, message, commands, name);

      }



      //END OF COMMAND
    },
};
