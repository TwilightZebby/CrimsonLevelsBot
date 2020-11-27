const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');
const Prefixs = require('../bot_modules/prefixFunctions.js');

let { PREFIX } = require('../config.js');
const Error = require('../bot_modules/onEvents/errors.js');


module.exports = {
    name: 'reload',
    description: 'Used by TwilightZebby to reload specific commands, should he make changes to them live',
    usage: '<command>',
    //aliases: [''],
    args: true,
    commandType: 'general',
    cooldown: 3, // IN SECONDS

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
      
      // Grab the input
      let commandName = args.shift().toLowerCase();

      // Fetch command
      let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      // if no command found
      if (!command) {
        return await message.channel.send(`There is no command with the name/alias of **${commandName}**`);
      }


      if ( command.commandType === `level` ) {

        // Delete from cache
        delete require.cache[require.resolve(`./level/${command.name}.js`)];

        // Fetch updated command
        try {

          let newCommand = require(`./level/${command.name}.js`);
          client.commands.set(newCommand.name, newCommand);
          return await message.channel.send(`Successfully reloaded the **${newCommand.name}** command!`);

        } catch (err) {

          await Error.LogCustom(err, `Error while reloading ${commandName} command:`);
          return Error.LogToUser(message.channel, `I was unable to reload the **${commandName}** command - please check the Console Logs for more details...`);

        }

      }
      else if ( command.commandType === `management` ) {

        // Delete from cache
        delete require.cache[require.resolve(`./management/${command.name}.js`)];

        // Fetch updated command
        try {

          let newCommand = require(`./management/${command.name}.js`);
          client.commands.set(newCommand.name, newCommand);
          return await message.channel.send(`Successfully reloaded the **${newCommand.name}** command!`);

        } catch (err) {

          await Error.LogCustom(err, `Error while reloading ${commandName} command:`);
          return Error.LogToUser(message.channel, `I was unable to reload the **${commandName}** command - please check the Console Logs for more details...`);

        }

      }
      else {

        // Delete from cache
        delete require.cache[require.resolve(`./${command.name}.js`)];

        // Fetch updated command
        try {

          let newCommand = require(`./${command.name}.js`);
          client.commands.set(newCommand.name, newCommand);
          return await message.channel.send(`Successfully reloaded the **${newCommand.name}** command!`);

        } catch (err) {

          await Error.LogCustom(err, `Error while reloading ${commandName} command:`);
          return Error.LogToUser(message.channel, `I was unable to reload the **${commandName}** command - please check the Console Logs for more details...`);
          
        }

      }

      //END OF COMMAND
    },
};
