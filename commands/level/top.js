const Discord = require("discord.js");
//const fs = require('fs');
//const Canvas = require('canvas');
//const { client } = require('../../bot_modules/constants.js');

//let { PREFIX } = require('../../config.js');
//const XPs = require('../../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');


module.exports = {
    name: 'top',
    description: 'Brings up a list of the top 10 Members in this Server!',
    usage: ' ',
    //aliases: [' '],
    //args: true,
    commandType: 'level',
    //cooldown: 3, // IN SECONDS

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

      // Fetch database
      let guildXP = await Tables.UserXP.findAll(
        {
          where: {
            guildID: message.guild.id
          },
          order: [
            ['xp', 'DESC']
          ]
        }
      ).catch(async err => {
        return await Error.LogToUser(message.channel, `I was unable to fetch this Server's XP Database. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
      });

      
      


      const embed = new Discord.MessageEmbed().setColor('#DC143C');

      if ( guildXP.length < 10 ) {

        // WHEN THERE ARE LESS THAN 10 MEMBERS STORED FOR THAT GUILD

        let smallGuildTop = [];

        for ( let i = 0; i < guildXP.length; i++ ) {

          let tempData = guildXP[i].dataValues;
          let tempMember = await message.guild.members.fetch(tempData.userID);

          let tempString = `**${i + 1})** ${tempMember} (${tempMember.user.username}#${tempMember.user.discriminator})  |  **${tempData.xp} XP**`;
          smallGuildTop.push(tempString);

        }


        embed.setTitle(`${message.guild.name} Leaderboard`)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .addFields(
          {
            name: `Top ${guildXP.length} Members`,
            value: smallGuildTop.join(`\n\n`)
          }
        );

        return await message.channel.send(embed);

      }
      else {

        // OTHERWISE, IF THERE ARE 10 OR MORE MEMBERS

        let guildTop = [];

        for ( let i = 0; i < 10; i++ ) {

          let tempData = guildXP[i].dataValues;
          let tempMember = await message.guild.members.fetch(tempData.userID);

          let tempString = `**${i + 1})** ${tempMember} (${tempMember.user.username}#${tempMember.user.discriminator})  |  **${tempData.xp} XP**`;
          guildTop.push(tempString);

        }


        embed.setTitle(`${message.guild.name} Leaderboard`)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .addFields(
          {
            name: `Top 10 Members`,
            value: guildTop.join(`\n\n`)
          }
        );

        return await message.channel.send(embed);

      }


      // END OF COMMAND
    },
};
