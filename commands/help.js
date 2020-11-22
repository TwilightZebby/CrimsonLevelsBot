const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');
let help = require('../bot_modules/cmds/helpFunctions.js');
const Prefixs = require('../bot_modules/prefixFunctions.js');


module.exports = {
    name: 'help',
    description: `Lists all of my commands, or can be used to show more info on a specific command.\nUse a Flag to see more commands (if you have permissions to!)`,
    usage: '[--flag | command]',
    //aliases: [''],
    //args: true,
    commandType: 'general',
    cooldown: 4, // IN SECONDS

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
    flags: [
      [ `--dev`, `Shows literally every command (can only be used by this Bot\'s Developer!)` ],
      [ `--owner`, `Shows all commands a Server Owner can use` ],
      [ `--admin`, `Shows all commands a Server Admin can use` ],
      [ `--mod`, `Shows all commands a Server Mod can use` ]
    ],

    async execute(message, args) {

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);
      
      const { commands } = message.client; // Fetch commands
      const embed = new Discord.MessageEmbed().setColor('#DC143C').setFooter(`Help Module`);


      // ********** NO ARGUMENT WAS PASSED
      if ( !args.length ) {

        return await help.ListCommands(embed, message, commands);

      }
      // ********** ARGUMENT WAS PASSED
      else {

        let argument = args[0].toLowerCase();

        switch (argument) {

          case `--mod`:
            let adminPermissionCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
            let manageGuildPermissionCheck = message.member.hasPermission("MANAGE_GUILD", {checkAdmin: true});
            let banMembersPermissionCheck = message.member.hasPermission("BAN_MEMBERS", {checkAdmin: true});
            if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermissionCheck && !manageGuildPermissionCheck && !banMembersPermissionCheck ) {
              //return await message.channel.send();
              return await client.throttleCheck(message.channel, `Sorry, but you can't use the **${argument}** Flag!`, message.author.id);
            }

            await help.ListModCommands(embed, message, commands);
            break;


          case `--admin`:
            let adminPermCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
            if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermCheck ) {
              //return await message.channel.send();
              return await client.throttleCheck(message.channel, `Sorry, but you can't use the **${argument}** Flag!`, message.author.id);
            }

            await help.ListAdminCommands(embed, message, commands);
            break;


          case `--dev`:
            if ( message.author.id !== '156482326887530498' ) {
              //return await message.channel.send();
              return await client.throttleCheck(message.channel, `Sorry, but you can't use the **${argument}** Flag!`, message.author.id);
            }

            await help.ListDevCommands(embed, message, commands);
            break;


          case `--owner`:
            if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID ) {
              //return await message.channel.send();
              return await client.throttleCheck(message.channel, `Sorry, but you can't use the **${argument}** Flag!`, message.author.id);
            }

            await help.ListOwnerCommands(embed, message, commands);
            break;


          default:
            await help.CommandHelp(embed, message, commands, argument);
            break;

        }

        //return await help.CommandHelp(embed, message, commands, name);

      }



      //END OF COMMAND
    },
};
