const Discord = require("discord.js");
const { client } = require('../../bot_modules/constants.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');

let { PREFIX } = require('../../config.js');
const { crypto_aead_xchacha20poly1305_ietf_keygen } = require("libsodium-wrappers");
let validOptions = [
  'guide',
  'broadcast',
  'level-up',
  'level-down'
]


module.exports = {
    name: 'settings',
    description: 'View or change the Server-specific settings on this Bot!',
    usage: '[option] [value]',
    aliases: ['setting', 'config'],
    //args: true,
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
      
      const embed = new Discord.MessageEmbed();
      embed.setColor('#DC143C')
      .setFooter(`Server Settings - ${message.guild.name}`);


      if( !args.length || !validOptions.includes(args[0]) ) {

        // VIEW CURRENT CONFIG VALUES

        let serverDB = await Tables.GuildConfig.findOrCreate(
          {
            where: {
              guildID: message.guild.id
            }
          }
        );

        let serverData = serverDB[0].dataValues;


        // Check Broadcast-Channel value
        if( serverData.broadcastChannel !== "disable" && serverData.broadcastChannel !== "current" ) {
          let temp = null;
          try {
            temp = message.guild.channels.resolve(serverData.broadcastChannel);
          } catch (err) {
            await Error.Log(err);
          }

          if ( temp !== null ) {
            serverData.broadcastChannel = `#${temp.name}`;
          }
        }




        embed.setTitle(`${message.guild.name} Settings`)
        .addFields(
          {
            name: `__Broadcast__ Channel`,
            value: `${serverData.broadcastChannel}`,
            inline: true
          },
          {
            name: `__Level-Up__ Message`,
            value: `${serverData.levelUpMessage}`
          },
          {
            name: `__Level-Down__ Message`,
            value: `${serverData.levelDownMessage}`
          },
          {
            name: `Settings Guide`,
            value: `To change a setting, use \`${PREFIX}settings [option] [value]\`, where \`[option]\` is one of the __underlined__ words above.
            For more information, use \`${PREFIX}settings guide\``
          }
        );

        return message.channel.send(embed);

      }
      else if( validOptions.includes(args[0]) ) {

        // Change a Config option

        let option = args[0].toLowerCase();

        if( option === `guide` ) {

          embed.setTitle(`Settings Guide`)
          .addFields(
            {
              name: `Changing Settings`,
              value: `To change a setting, use \`${PREFIX}settings [option] [value]\`, where \`[option]\` is one of the __underlined__ words given when running \`${PREFIX}settings\``
            },
            {
              name: `Example of changing settings`,
              value: `For example: \`${PREFIX}settings level-up {user} climbed the ladder to Level {level}!\``
            },
            {
              name: `Broadcast Channel`,
              value: `This is where the Bot sends any Level-Up or Level-Down messages. Use \`disable\` to turn this off, \`current\` for the Channel the User is currently in, or \`#channel-name\` for a specific Channel.`
            },
            {
              name: `Level-Up/Down Messages`,
              value: `These are the messages used in your Server if *Broadcast Channel* isn't disabled. **Must include** \`{user}\` and \`{level}\` so the Bot knows where in the Message to place the @user pings and Level Numbers!`
            }
          );

          return await message.channel.send(embed);

        }
        else {

          // Check for value
          if( !args[1] || args.length < 2 ) {
            return await Error.LogToUser(message.channel, `Sorry, but I couldn't see any value(s) given - please try again...`);
          }

          if( option === `broadcast` ) {

            // Check if the value is either "disable", "current", or a #channel mention
            let value = String(args[1]).toLowerCase();

            if( value.match("disable") || value.match("current") ) {

              // For "disable" or "current"
              await Tables.GuildConfig.update(
                {
                  broadcastChannel: value
                },
                {
                  where: {
                    guildID: message.guild.id
                  }
                }
              ).catch(async err => {
                await Error.LogCustom(err, `Attempted Guild DB Update for ${message.guild.name}`);
                return await Error.LogToUser(message.channel, `I was unable to save the updated Server Configuration value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
              });

              embed.setTitle(`Updated Configuration`)
              .setDescription(`The **${option}** setting has been updated to **${value}**`);

              return await message.channel.send(embed);

            }
            else {

              // For Channel Mentions

              // First, see if the given value is the raw ID of the channel
              let channel = null;

              try {
                channel = message.guild.channels.resolve(value);
              } catch(err) {
                console.error(err);
              }

              if ( channel === null ) {
                
                // Error == Not a valid ID, thus check for Channel Mention instead
                value = value.slice(2, value.length - 1);

                try {
                  channel = message.guild.channels.resolve(value);
                } catch (err) {
                  console.error(err);
                }

              }


              if ( channel === null ) {
                
                // IF channel STILL isn't found
                return await Error.LogToUser(message.channel, `I was unable to find any Channels on this Server which matches the given ID or #channel-mention`);

              }


              
              // Check to see if Channel is a Text Channel
              if( channel.type !== "text" ) {
                return await Error.LogToUser(message.channel, `Sorry, but that Channel is *not* a **Text** Channel, but rather a **${channel.type}** Channel. Please try again with a Text Channel.`);
              }

              // Save to Database
              await Tables.GuildConfig.update(
                {
                  broadcastChannel: channel.id
                },
                {
                  where: {
                    guildID: message.guild.id
                  }
                }
              ).catch(async err => {
                await Error.LogCustom(err, `Attempted Guild DB Update for ${message.guild.name}`);
                return await Error.LogToUser(message.channel, `I was unable to save the updated Server Configuration value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
              });

              embed.setTitle(`Updated Configuration`)
              .setDescription(`The **${option}** setting has been updated to **#${channel.name}**`);

              return await message.channel.send(embed);

            }

          }

        }

      }

      //END OF COMMAND
    },
};
