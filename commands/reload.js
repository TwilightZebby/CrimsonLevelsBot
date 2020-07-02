const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');


module.exports = {
    name: 'reload',
    description: 'Used by TwilightZebby to reload specific commands, should he make changes to them live',
    usage: '<command>',
    //aliases: [''],
    args: true,
    commandType: 'general',
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
      
      // Grab the input
      let commandName = args.shift().toLowerCase();

      // Fetch command
      let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      // if no command found
      if (!command) {
        return await message.reply(`There is no command with the name/alias of **${commandName}**`);
      }

      // Delete from cache
      delete require.cache[require.resolve(`./${commandName}.js`)];

      // Fetch updated command
      try {
        let newCommand = require(`./${commandName}.js`);
        client.commands.set(newCommand.name, newCommand);
        return await message.reply(`Successfully reloaded the **${commandName}** command!`);
      } catch (error) {
        console.error(error);
        return await message.reply(`There was an error while reloading the **${commandName}** command. Please see the Console Logs for more details...`);
      }

      //END OF COMMAND
    },
};
