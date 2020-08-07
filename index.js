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

// Maps / Collections
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// General Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for ( const file of commandFiles ) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Other Stuff
const Errors = require('./bot_modules/onEvents/errors.js');
const Levels = require('./bot_modules/leveling/levelFunctions.js');




















// ********** Debugging / Error Handling
process.on('warning', async (warning) => {

  // Log to console
  console.warn(warning);

  // Log to error log channel
  let errorChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Warning:\n
  ${warning}
  \`\`\``);

})

// Extra Error Catching
process.on('unhandledRejection', async (error) => {

  // Log to console
  console.error(`Uncaught Promise Rejection:\n`, error);

  // Log to error log channel
  let errorChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Uncaught Promise Rejection:\n
  ${error.stack}
  \`\`\``);

});


// Discord Error Handling
client.on('error', async (error) => {

  // Log to console
  console.error(error);

  // Log to error log channel
  let errorChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Discord Error:\n
  ${error.stack}
  \`\`\``);

});


client.on('rateLimit', async (rateLimitInfo) => {

  // Log to Console
  console.warn(rateLimitInfo);

  // Log to error log channel
  let errorChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');

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
  let errorChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');

  return await errorChannel.send(`\`\`\`Discord Warning:\n
  ${warning}
  \`\`\``);

});



















// ********** READY EVENT
client.once('ready', async () => {


    // ***** Set Status
    await client.user.setPresence({
        activity: {
          name: `CrimsonRoulette v2 WIP Test`
        },
        status: 'online'
    });

    client.setInterval(async function () {
        await client.user.setPresence({
          activity: {
            name: `CrimsonRoulette v2 WIP Test`
          },
          status: 'online'
        });
    }, 1.08e+7);





    // ***** Sync Database Tables
    await Tables.StaffRoles.sync();
    await Tables.StaffMembers.sync();
    await Tables.UserXP.sync();
    await Tables.UserPrefs.sync();
    
    
    console.log(`I am ready!`);
});



























// ********** BOT_JOIN_GUILD EVENT
// Fetch functions
let log = require('./bot_modules/onEvents/log.js');

client.on('guildCreate', async (guild) => {

  // Log
  await log.JoinedGuild(guild);

  return;

});




























// ********** BOT_LEAVE_GUILD EVENT
client.on('guildDelete', async (guild) => {

  // Log
  await log.LeftGuild(guild);

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










  // ***** Check for READ and SEND permissions
  let botMember = message.guild.members.resolve(client.user.id); // Resolve GuildMember object from this Bot's User ID
  let readPerms = botMember.hasPermission('VIEW_CHANNEL', {
    checkAdmin: true
  });
  let sendPerms = botMember.hasPermission('SEND_MESSAGES', {
    checkAdmin: true
  });

  // IF NO PERMISSION, ping a quick DM to Guild Owner
  if ( !readPerms || !sendPerms ) {
    let guildOwner = message.guild.owner;
    let ownerDMs = await guildOwner.createDM();
    return await ownerDMs.send(`Buzz! I don't seem to have the \`VIEW_CHANNELS\`, \`READ_MESSAGES\`, or \`SEND_MESSAGES\` permission(s) in **${message.guild.name}**!
    I need these permissions to respond to my commands and be a useful Leveling Bot!`);
  }










  // ***** PREFIX CHECK
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  









  // ***** NO PREFIX
  if ( !prefixRegex.test(message.content) ) {
    await Levels.FetchXP(message);
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
    if (!command) return;




    // *** Command Cooldowns
    // If a command has 'cooldown: x,' it will enable cooldown IN SECONDS
    if ( !cooldowns.has(command.name) ) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
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



    if ( timestamps.has(message.author.id) ) {
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
    } else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
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
            return await message.reply(`Sorry, but this command can only be used by the Owner of this Guild (**${message.guild.owner.displayName}**).`);
          }
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
