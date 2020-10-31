// ********** Libraries required
const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

// ********** Global Variables
// Discord
const { client } = require('./bot_modules/constants.js');
let { PREFIX, TOKEN, DBLTOKEN } = require('./config.js');

// Database (Sequlize)
const { sequelize } = require('./bot_modules/constants.js');
const Tables = require('./bot_modules/tables.js');

// top.gg api stuff
//const DBL = require("dblapi.js");
//const dbl = new DBL(DBLTOKEN, client);

// Maps / Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const xpCooldowns = new Discord.Collection();
client.rouletteCooldowns = new Discord.Collection();

// General Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for ( const file of commandFiles ) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Levelling Commands
const levelCommandFiles = fs.readdirSync('./commands/level').filter(file => file.endsWith('.js'));
for ( const file of levelCommandFiles ) {
  const levelCommand = require(`./commands/level/${file}`);
  client.commands.set(levelCommand.name, levelCommand);
}

// Management Commands
const manageCommandFiles = fs.readdirSync('./commands/management').filter(file => file.endsWith('.js'));
for ( const file of manageCommandFiles ) {
  const manageCommand = require(`./commands/management/${file}`);
  client.commands.set(manageCommand.name, manageCommand);
}

// Other Stuff
const Errors = require('./bot_modules/onEvents/errors.js');
const XPs = require('./bot_modules/leveling/xpFunctions.js');
const Levels = require('./bot_modules/leveling/levelFunctions.js');
const broadcastFunctions = require('./bot_modules/leveling/broadcastFunctions.js');
const Prefixs = require('./bot_modules/prefixFunctions.js');
const ManageRoles = require('./bot_modules/leveling/roleManageFunctions.js');




















// ********** Debugging / Error Handling
process.on('warning', async (warning) => {

  // Log to console
  console.warn(warning);

  // Log to error log channel
  let errorChannel = await client.guilds.fetch('681805468749922308');
  errorChannel = errorChannel.channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Warning:\n
  ${warning}
  \`\`\``);

})

// Extra Error Catching
process.on('unhandledRejection', async (error) => {

  return await Errors.LogCustom(error, `Unhandled Promise Rejection:`)

});


// top.gg error handling
/*dbl.on('error', async (e) => {

  // Log to console
  console.error(`DiscordBotList Error:\n ${e}`);

  // Log to error log channel
  let errorChannel = await client.guilds.fetch('681805468749922308');
  errorChannel = errorChannel.channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`DiscordBotList Error:\n
  ${e}
  \`\`\``);

})*/


// Discord Error Handling
client.on('error', async (error) => {

  return await Errors.LogCustom(error, `Discord Error:`);

});


client.on('rateLimit', async (rateLimitInfo) => {

  // Log to Console
  console.warn(rateLimitInfo);

  // Log to error log channel
  let errorChannel = await client.guilds.fetch('681805468749922308');
  errorChannel = errorChannel.channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Discord Ratelimit Error:\n
  Timeout (ms): ${rateLimitInfo.timeout}
  Limit: ${rateLimitInfo.limit}
  Method: ${rateLimitInfo.method}
  Path: ${rateLimitInfo.path}
  Route: ${rateLimitInfo.route}
  \`\`\``);

});


client.on('warn', async (warning) => {

  // Log to console
  console.warn(warning);

  // Log to error log channel
  let errorChannel = await client.guilds.fetch('681805468749922308');
  errorChannel = errorChannel.channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Discord Warning:\n
  ${warning}
  \`\`\``);

});



















// ********** READY EVENT
client.once('ready', async () => {


    // ***** Set Status
    await client.user.setPresence({
        activity: {
          name: `c!help`
        },
        status: 'online'
    });

    client.setInterval(async function () {
        await client.user.setPresence({
          activity: {
            name: `c!help`
          },
          status: 'online'
        });
    }, 1.08e+7);





    // ***** Sync Database Tables
    await Tables.UserXP.sync();
    await Tables.UserPrefs.sync();
    await Tables.GuildConfig.sync();
    await Tables.GuildRoles.sync();
    
    
    console.log(`I am ready!`);
});



























// ********** BOT_JOIN_GUILD EVENT
// Fetch functions
let log = require('./bot_modules/onEvents/log.js');

client.on('guildCreate', async (guild) => {

  // Log
  await log.JoinedGuild(guild);

  // ***** Add to Databases

  // First, add to GuildConfig
  await Tables.GuildConfig.findOrCreate(
    { 
      where: {
        guildID: guild.id
      }
    }
  ).catch(async err => {
    return await Errors.LogCustom(err, `Attempted Guild Config DB Addition for ${guild.name} (ID: ${guild.id})`);
  });



  // Fetch all Members who are NOT a Bot
  await guild.members.fetch();
  let guildMembers = Array.from(guild.members.cache.values).filter(member => !member.user.bot);

  // Add Members to database
  for ( let i = 0; i < guildMembers.length; i++ ) {

    await Tables.UserPrefs.findOrCreate(
      {
        where: {
          userID: guildMembers[i].id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted User Prefs DB Addition for ${guildMembers[i].user.username}#${guildMembers[i].user.discriminator} (ID: ${guildMembers[i].user.id})`);
    });

    await Tables.UserXP.findOrCreate(
      {
        where: {
          userID: guildMembers[i].id,
          guildID: guild.id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted User XP DB Addition for ${guildMembers[i].user.username}#${guildMembers[i].user.discriminator} (ID: ${guildMembers[i].user.id}) in Guild ${guild.name} (ID: ${guild.id})`);
    });

  }

  return;

});




























// ********** BOT_LEAVE_GUILD EVENT
client.on('guildDelete', async (guild) => {

  // Log
  await log.LeftGuild(guild);



  // ***** Remove from Databases

  // First, remove from GuildConfig
  await Tables.GuildConfig.destroy(
    {
      where: {
        guildID: guild.id
      }      
    }
  ).catch(async err => {
    return await Errors.LogCustom(err, `Attempted Guild Config DB Removal for ${guild.name} (ID: ${guild.id})`);
  });




  // Remove from User XP DB

  await Tables.UserXP.destroy(
    {
      where: {
        guildID: guild.id
      }
    }
  ).catch(async err => {
    return await Errors.LogCustom(err, `Attempted User XP DB Removal for Guild ${guild.name} (ID: ${guild.id})`);
  });


  return;

});




























// ********** USER_JOIN_GUILD EVENT
client.on('guildMemberAdd', async (member) => {

  // If Bot, do NOTHING
  if ( member.user.bot ) {
    return;
  }
  else {

    await Tables.UserXP.findOrCreate(
      {
        where: {
          userID: member.id,
          guildID: member.guild.id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted User XP DB Addition for ${member.user.username}#${member.user.discriminator} (ID: ${member.user.id}) in Guild ${member.guild.name} (ID: ${member.guild.id})`);
    });

    await Tables.UserPrefs.findOrCreate(
      {
        where: {
          userID: member.id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted User Prefs DB Addition for ${member.user.username}#${member.user.discriminator} (ID: ${member.user.id})`);
    });

    return;

  }

});




























// ********** USER_LEAVE_GUILD EVENT
client.on('guildMemberRemove', async (member) => {

  await Tables.UserXP.destroy(
    {
      where: {
        userID: member.id,
        guildID: member.guild.id
      }
    }
  ).catch(async err => {
    return await Errors.LogCustom(err, `Attempted User XP DB Removal for ${member.user.username}#${member.user.discriminator} (ID: ${member.user.id}) in Guild ${member.guild.name} (ID: ${member.guild.id})`);
  });

  return;

});




























// ********** USER_UPDATE EVENT
client.on('guildMemberUpdate', async (oldMember, newMember) => {

  // For auto-updating Usernames/Discrims in the userxp DB
  // Check usernames
  if (oldMember.user.username !== newMember.user.username) {

    await Tables.UserXP.update(
      {
        userName: `${newMember.user.username}#${newMember.user.discriminator}`
      },
      {
        where: {
          userID: newMember.user.id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted userxp DB update for ${newMember.user.username}#${newMember.user.discriminator} (ID: ${newMember.user.id})`);
    });

  }
  else if (oldMember.user.discriminator !== newMember.user.discriminator) {

    // Checked Discrim
    await Tables.UserXP.update(
      {
        userName: `${newMember.user.username}#${newMember.user.discriminator}`
      },
      {
        where: {
          userID: newMember.user.id
        }
      }
    ).catch(async err => {
      return await Errors.LogCustom(err, `Attempted userxp DB update for ${newMember.user.username}#${newMember.user.discriminator} (ID: ${newMember.user.id})`);
    });

  }

  return;

});























// ********** MESSAGE EVENT
client.on('message', async (message) => {

  // Prevent use in DMs
  if ( message.channel.type === "dm" ) {
    return;
  }

  // Prevent other Bots from triggering this Bot
  if ( message.author.bot ) {
    return;
  }

  // Prevent SYSTEM MESSAGES being caught
  if ( message.author.flags.has('SYSTEM') ) {
    return;
  }










  // ***** Check for READ and SEND permissions
  let botMember = await message.guild.members.fetch(client.user.id); // Resolve GuildMember object from this Bot's User ID
  let readPerms = botMember.hasPermission('VIEW_CHANNEL', {
    checkAdmin: true
  });
  let sendPerms = botMember.hasPermission('SEND_MESSAGES', {
    checkAdmin: true
  });

  // IF NO PERMISSION, ping a quick DM to Guild Owner
  if ( !readPerms || !sendPerms ) {

    let guildOwner = await message.guild.members.fetch(message.guild.ownerID);

    try {

      let ownerDMs = await guildOwner.createDM();
      await ownerDMs.send(`Buzz! I don't seem to have the \`VIEW_CHANNELS\`, \`READ_MESSAGES\`, or \`SEND_MESSAGES\` permission(s) in **${message.guild.name}**!
      I need these permissions to respond to my commands and be a useful Leveling Bot!`);

    } catch(err) {
      await Errors.LogCustom(err, `Failed to send DM to ${guildOwner.user.username}`);
    }

    return;

    
  }



    // IS THERE A DISCORD OUTAGE AFFECTING THIS GUILD OR NOT
    if ( !message.guild.available ) {
      return;
    }










  // ***** PREFIX CHECK

  // Check for custom Prefix
  PREFIX = await Prefixs.Fetch(message.guild.id);

  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  









  // ***** NO PREFIX
  if ( !prefixRegex.test(message.content) ) {

    // Levelling Cooldowns
    if ( !xpCooldowns.has(message.author.id) ) {
      xpCooldowns.set(message.author.id, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = xpCooldowns.get(message.author.id);
    const cooldownLength = 30500;

    if ( timestamps.has(message.author.id) ) {

      const expirationTime = timestamps.get(message.author.id) + cooldownLength;

      if ( now < expirationTime ) {
        //const timeLeft = (expirationTime - now) / 1000; // Used for debugging (converts milliseconds into seconds)
        return;
      }

    }
    else {

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownLength);

    }






    // Give XP
    let fetched = await XPs.FetchXP(message);
    let newXP = await XPs.GenerateXP();
    let newXPTotal = await XPs.AddXP(newXP, fetched);
    await XPs.SaveXP(message.guild.id, message.author.id, newXPTotal);

    // Announce, if allowed
    let oldLevel = await Levels.FetchLevel(fetched);
    let newLevel = await Levels.FetchLevel(newXPTotal);

    let levelChange = await Levels.CompareLevels(oldLevel, newLevel);

    if ( levelChange === "nochange" ) {
      return;
    }
    else if ( levelChange === "levelup" ) {
      await broadcastFunctions.Main(message, message.author, message.guild, "up");
      await ManageRoles.Main(message.member, message.guild, newXPTotal, newLevel);
    }
    else if ( levelChange === "leveldown" ) {
      await broadcastFunctions.Main(message, message.author, message.guild, "down");
      await ManageRoles.Main(message.member, message.guild, newXPTotal, newLevel, true, fetched);
    }





    return;









  }
  // ***** YES PREFIX
  else {

    // *** Fetch command

    // Slide PREFIX off command
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    // Slaps the cmd into its own var
    const commandName = args.shift().toLowerCase();
    // If there is NOT a command with the given name or aliases, exit early
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {

      // If the @mention was used, show prefix
      if ( matchedPrefix === `<@!${client.user.id}>` || matchedPrefix === `<@${client.user.id}>` ) {
        const embed = new Discord.MessageEmbed().setColor('#DC143C')
        .setDescription(`My prefix on this Server is \`${PREFIX}\``);
        return await message.channel.send(embed);
      }
      
      return;
    }





    // Prevent the Bot from being triggered in top.gg's Guild unless it was specifically @mentioned
    if ( message.guild.id === "264445053596991498" && matchedPrefix !== `<@!${client.user.id}>` ) {
      return;
    }




    // *** Command Cooldowns

    // NOT ROULETTE COMMAND
    if (command.name !== "roulette") {

      // If a command has 'cooldown: x,' it will enable cooldown IN SECONDS
      if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      let cooldownAmount = (command.cooldown || 3) * 1000;


      // OVERRIDE COOLDOWN IF THIS IS TRIGGERED
      // A check for missing parameters
      // If a cmd has 'args: true,', it will throw the error
      // Requires the cmd file to have 'usage: '<user> <role>',' or similar
      if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
          reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }

        // Override larger cooldowns
        if (timestamps.has(message.author.id) === false) {
          cooldownAmount = 1000;
        }


        await message.channel.send(reply);
      }



      if (timestamps.has(message.author.id)) {

        if (message.author.id === "156482326887530498" && message.content.includes("--overridecooldown")) {
          timestamps.delete(message.author.id);
        } else {

          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

          if (now < expirationTime) {
            let timeLeft = (expirationTime - now) / 1000;

            // If greater than 60 Seconds, convert into Minutes
            if (timeLeft > 60 && timeLeft < 3600) {
              timeLeft = timeLeft / 60;
              return await message.reply(`Please wait ${timeLeft.toFixed(1)} more minute(s) before reusing the \`${command.name}\` command.`);
            }
            // If greater than 3600 Seconds, convert into Hours
            else if (timeLeft > 3600) {
              timeLeft = timeLeft / 3600;
              return await message.reply(`Please wait ${timeLeft.toFixed(1)} more hour(s) before reusing the \`${command.name}\` command.`);
            }

            return await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
          }

        }


      } else if (message.author.id === "156482326887530498" && message.content.includes("--overridecooldown")) {
        // Developer override of cooldown, so do NOTHING
      } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }

    }
    else {
      

















      // FOR ROULETTE COMMAND
      // First, fetch the cooldown Collection for this Guild
      if (!client.rouletteCooldowns.has(message.guild.id)) {
        client.rouletteCooldowns.set(message.guild.id, new Discord.Collection());
      }


      // Fetch Guild's Roulette Cooldown from Database
      let rouletteCustomCooldown = await Tables.GuildConfig.findOrCreate({
        where: {
          guildID: message.guild.id
        }
      });

      rouletteCustomCooldown = rouletteCustomCooldown[0].dataValues.rouletteCooldown;

      const now = Date.now();
      const timestamps = client.rouletteCooldowns.get(message.guild.id);
      let cooldownAmount = rouletteCustomCooldown * 1000;


      // OVERRIDES
      // Missing Arg Check
      if (command.args && !args.length) {

        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
          reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }

        // Override cooldown
        if (timestamps.has(message.author.id) === false) {
          cooldownAmount = 1000;
        }

        await message.channel.send(reply);

      }



      // Cooldown Time
      if (timestamps.has(message.author.id)) {

        if (message.author.id === "156482326887530498" && message.content.includes("--overridecooldown")) {
          timestamps.delete(message.author.id);
        }
        else {

          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

          if ( now < expirationTime ) {

            let timeLeft = (expirationTime - now) / 1000;

            // If greater than 60 seconds, convert to minutes
            if (timeLeft > 60 && timeLeft < 3600) {
              timeLeft = timeLeft / 60;
              return await message.reply(`Please wait ${timeLeft.toFixed(1)} more minute(s) before reusing the \`${command.name}\` command.`);
            }
            // If greater than 3600 seconds, convert to hours
            else if (timeLeft > 3600) {
              timeLeft = timeLeft / 3600;
              return await message.reply(`Please wait ${timeLeft.toFixed(1)} more hour(s) before reusing the \`${command.name}\` command.`);
            }

            return await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);

          }

        }

      }
      else if ( message.author.id === "156482326887530498" && message.content.includes("--overridecooldown") ) {
        // Developer override, do NOTHING
      }
      else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }


    }










    // *** Extra Checks

    // Check limitation
    if ( command.limitation ) {

      switch (command.limitation) {

        // BOT DEV ONLY
        case 'dev':
          if ( message.author.id !== '156482326887530498' ) {
            return await message.reply(`Sorry, but this command can only be used by the Bot's developer.`);
          }
          break;

        // GUILD OWNER
        case 'owner':
          if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID ) {
            return await message.reply(`Sorry, but this command can only be used by the Owner of this Guild (**\<\@${message.guild.ownerID}\>**).`, {
              allowedMentions: {
                users: [message.author.id]
              }
            });
          }
          break;

        // ADMIN PERMISSION
        case 'admin':
          let adminPermissionCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
          if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermissionCheck ) {
            return await message.reply(`Sorry, but this command can only be used by those with the \`ADMINISTRATOR\` Permission and the Owner of this Guild (**\<\@${message.guild.ownerID}\>**).`, {
              allowedMentions: {
                users: [message.author.id]
              }
            });
          }
          break;

        // MANAGE_GUILD, BAN_MEMBERS PERMISSIONS
        case 'mod':
          let adminPermCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
          let manageGuildPermissionCheck = message.member.hasPermission("MANAGE_GUILD", {checkAdmin: true});
          let banMembersPermissionCheck = message.member.hasPermission("BAN_MEMBERS", {checkAdmin: true});
          if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermCheck && !manageGuildPermissionCheck && !banMembersPermissionCheck ) {
            return await message.reply(`Sorry, but this command can only be used by those with the \`ADMINISTRATOR\` or \`MANAGE_SERVER\` or \`BAN_MEMBERS\` Permission and the Owner of this Guild (**\<\@${message.guild.ownerID}\>**).`, {
              allowedMentions: {
                users: [message.author.id]
              }
            });
          }
          break;


        default:
          break;

      }

    }

    // A check for missing parameters
    // TO catch from above
    if (command.args && !args.length) {
      return;
    }
    









    // *** Extra Permissions Check
    let embedLinksPerm = botMember.hasPermission('EMBED_LINKS', {
      checkAdmin: true
    });
    let attachFilesPerm = botMember.hasPermission('ATTACH_FILES', {
      checkAdmin: true
    });

    // Embed Links Permission
    if ( !embedLinksPerm && command.name !== 'ping' ) {
      return await message.channel.send(`Sorry ${message.author}, but I seem to be missing the \`EMBED_LINKS\` permission.`);
    }

    // Attach Files Permission
    if ( !attachFilesPerm && command.name === 'rank' ) {
      return await message.channel.send(`Sorry ${message.author}, but I seem to be missing the \`ATTACH_FILES\` permission, which I need for this command!`);
    }










    // *** EXECUTE COMMAND
    try {
      command.execute(message, args);
    } catch (error) {
      await Errors.Log(error);
      return await message.reply(`There was an error trying to run that command!`);
    }

  }



});



















// ******************************
// LOGIN TO BOT ACCOUNT
client.login(TOKEN);
