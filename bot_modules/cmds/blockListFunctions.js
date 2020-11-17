const Discord = require('discord.js');
const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');

module.exports = {

    /**
     * Main point for the Block Command
     * 
     * @param {Discord.Message} message Discord Message
     * @param {Array<String>} args Command Arguments
     */
    async Block(message, args) {

        // Check Input
        const inputObj = await this.CheckType(args[0], message);

        if (inputObj === "invalid") {
            return;
        }
        else {

            // So I know what is being blocked
            let blockedType = null;

            if ( inputObj instanceof Discord.User || inputObj instanceof Discord.GuildMember ) {
                blockedType = "user";
            }
            else if ( inputObj instanceof Discord.Role ) {
                blockedType = "role";
            }
            else if ( inputObj instanceof Discord.TextChannel ) {
                blockedType = "channel";
            }

            // Save to DB
            try {

                await Tables.BlockList.create({
                    guildID: message.guild.id,
                    blockedID: inputObj.id,
                    blockType: blockedType
                });

                return await message.reply(`Successfully added the ${blockedType} **${inputObj instanceof Discord.GuildMember ? inputObj.user.username : inputObj.name}** to the XP BlockList for this Server.`);

            } catch (err) {

                if (err.name === "SequelizeUniqueConstraintError") {
                    await Errors.LogCustom(err, `(**blockListFunctions.js**) Attempted addition to BlockList DB, but ${blockedType} ${inputObj.id} already exists for Guild ${message.guild.name} (ID: ${message.guild.id})`);
                    return Errors.LogToUser(message.channel, `That ${blockedType} already exists in this Server's BlockList!`);
                }
                else {
                    await Errors.LogMessage(err, `(**blockListFunctions.js**) Attempted addition of ${blockedType} ${inputObj.id} to BlockList DB for Guild ${message.guild.name} (ID: ${message.guild.id})`);
                    return Errors.LogToUser(message.channel, `I was unable to add that ${blockedType} to this Server's BlockList! If this error continues, please ask for help on my [support server](https://discord.gg/YuxSF39)`);
                }

            }

        }

    },
        















    /**
     * Main point for the allow command
     * 
     * @param {Discord.Message} message Discord Message
     * @param {Array<String>} args Command Arguments
     */
    async Allow(message, args) {

        // Check Input
        const allowObj = await this.CheckType(args[0], message);

        if (allowObj === "invalid") {
            return;
        }
        else {

            // So I know what is being allowed
            allowType = null;

            if ( allowObj instanceof Discord.User || allowObj instanceof Discord.GuildMember ) {
                allowType = "user";
            }
            else if ( allowObj instanceof Discord.Role ) {
                allowType = "role";
            }
            else if ( allowObj instanceof Discord.TextChannel ) {
                allowType = "channel";
            }

            // Attempt removal from DB
            const allowID = await Tables.BlockList.destroy({
                where: {
                    guildID: message.guild.id,
                    blockedID: allowObj.id
                }
            })
            .catch(async err => {
                await Errors.LogCustom(err, `(**blockListFunctions.js**) Attempted removal of ${allowType} ${allowObj.id} from BlockList DB for Guild ${message.guild.name} (ID: ${message.guild.id})`);
                await Errors.LogToUser(message.channel, `I was unable to remove that ${allowType} from this Server's BlockList... If this error continues, please ask for help in my [support server](https://discord.gg/YuxSF39)`);
            });

            if (!allowID) {
                return await Errors.LogToUser(message.channel, `I could not delete that ${allowType} since it does not exist in this Server's BlockList...`);
            }
            else {
                return await message.reply(`Successfully removed the ${allowType} **${allowObj instanceof Discord.GuildMember ? allowObj.user.username : allowObj.name}** from the XP BlockList for this Server.`)
            }
        }

    },
        















    /**
     * Bring up the Server's BlockList
     * 
     * @param {Discord.Message} message Discord Message
     * 
     * @returns {Promise<Discord.Message>} The BlockList
     */
    async ViewBlockList(message){

        // Create Embed
        const embed = new Discord.MessageEmbed().setColor('#DC143C');

        // Fetch Table
        const userBlockList = await Tables.BlockList.findAll({
            where: {
                guildID: message.guild.id,
                blockType: "user"
            },
            attributes: ['blockedID']
        });
        const roleBlockList = await Tables.BlockList.findAll({
            where: {
                guildID: message.guild.id,
                blockType: "role"
            },
            attributes: ['blockedID']
        });
        const channelBlockList = await Tables.BlockList.findAll({
            where: {
                guildID: message.guild.id,
                blockType: "channel"
            },
            attributes: ['blockedID']
        });

        // Strings!
        const userBLStrings = [];
        const roleBLStrings = [];
        const channelBLStrings = [];

        // Format Strings
        // USER
        if (!userBlockList || userBlockList.length === 0 || userBlockList === null || userBlockList === undefined) {
            userBLStrings.push(`*No blocked Users found*`);
        }
        else {

            for (let i = 0; i < userBlockList.length; i++) {

                let memberTemp = await message.guild.members.fetch({
                    user: userBlockList[i].dataValues.blockedID,
                    cache: true
                });
    
                let stringTemp = userBLStrings.join(`\n`);
                if (stringTemp.length <= 963) {
                    // There is still space
                    userBLStrings.push(`${memberTemp.user.username}#${memberTemp.user.discriminator}`);
                    continue;
                }
                else {
                    // There is no space left
                    userBLStrings.push(`*...and ${userBlockList.length - i} others...*`);
                    break;
                }
    
            }

        }

        

        // ROLES
        if (!roleBlockList || roleBlockList.length === 0 || roleBlockList === null || roleBlockList === undefined) {
            roleBLStrings.push(`*No blocked Roles found*`);
        }
        else if (roleBlockList.length >= 6) {

            for (let i = 0; i < 5; i++) {
                let roleTemp = await message.guild.roles.fetch(roleBlockList[i].dataValues.blockedID, true);
                roleBLStrings.push(`@${roleTemp.name}`);
            }
            roleBLStrings.push(`*...and ${roleBlockList.length - 5} others...*`);

        }
        else {

            for (let i = 0; i < roleBlockList.length; i++) {
                let roleTemp = await message.guild.roles.fetch(roleBlockList[i].dataValues.blockedID, true);
                roleBLStrings.push(`${roleTemp.name}`);
            }

        }



        // CHANNELS
        if (!channelBlockList || channelBlockList.length === 0 || channelBlockList === null || channelBlockList === undefined) {
            channelBLStrings.push(`*No blocked Text Channels found*`);
        }
        else if (channelBlockList.length >= 6) {

            for (let i = 0; i < 5; i++) {
                let channelTemp = message.guild.channels.resolve(channelBlockList[i].dataValues.blockedID);
                channelBLStrings.push(`#${channelTemp.name}`);
            }
            channelBLStrings.push(`*...and ${channelBlockList.length - 5} others...*`);

        }
        else {

            for (let i = 0; i < channelBlockList.length; i++) {
                let channelTemp = message.guild.channels.resolve(channelBlockList[i].dataValues.blockedID);
                channelBLStrings.push(`#${channelTemp.name}`);
            }

        }



        // SEND EMBED
        embed.setTitle(`${message.guild.name} BlockList`)
        .addFields(
            {
                name: `Blocked Users`,
                value: userBLStrings.join(`\n`)
            },
            {
                name: `Blocked Roles`,
                value: roleBLStrings.join(`\n`)
            },
            {
                name: `Blocked Channels`,
                value: channelBLStrings.join(`\n`)
            }
        );
        return await message.channel.send(embed);

    },
    















    /**
     * Check Type
     * 
     * @param {String} arg The Argument which holds the User, Role, or Channel
     * @param {Discord.Message} message Discord Message
     * 
     * @returns {(Promise<Discord.GuildMember>|Promise<Discord.Role>|Promise<Discord.TextChannel>|Promise<"invalid">)} The Discord object, or "invalid"
     */
    async CheckType(arg, message) {

        // Check if arg has "<" ">"
        if (arg.includes(`<`) && arg.includes(`>`)) {

            // Check if arg has "#" (for channels)
            if (arg.includes(`#`)) {

                // Remove said characters
                let channelID = arg.slice(2, arg.length - 1);
                let channelObj = message.guild.channels.resolve(channelID);

                // Check Channel Type
                if ( !(channelObj instanceof Discord.TextChannel) ) {
                    await Errors.LogToUser(message.channel, `That was a(n) **${channelObj.type}** Channel, not a **Text** Channel. I can only work in Text Channels!`);
                    return "invalid";
                }
                else if (channelObj === null || channelObj === undefined) {
                    await Errors.LogToUser(message.channel, `I couldn't find a Text Channel in this Server with that ID or Mention, please try again...`);
                    return "invalid";
                }
                else {

                    // Catch other text-based channel types
                    if ( channelObj instanceof Discord.NewsChannel || channelObj instanceof Discord.DMChannel ) {
                        await Errors.LogToUser(message.channel, `That was a(n) **${channelObj.type}** Channel, not a **Text** Channel. I can only work in Text Channels!`);
                        return "invalid";
                    }
                    
                    return channelObj;
                }

            }
            else if ( ( arg.includes(`@`) || arg.includes(`@!`) ) && !arg.includes(`@&`) ) {

                // Checked if arg has either "@" or "@!" (for Users)
                // Remove said characters
                let userID;
                if (!arg.includes(`@!`)) {
                    userID = arg.slice(2, arg.length - 1);
                }
                else {
                    userID = arg.slice(3, arg.length - 1);
                }
                let userObj = await message.guild.members.fetch({
                    user: userID,
                    cache: true
                });

                if (userObj === null || userObj === undefined) {
                    await Errors.LogToUser(message.channel, `I couldn't find a User in this Server with that ID or Mention, please try again...`);
                    return "invalid";
                }
                else {

                    // Check Member
                    if ( userObj.user.id === "156482326887530498" || userObj.user.id === message.guild.ownerID ) {
                        await Errors.LogToUser(message.channel, `Sorry, but you cannot add/remove the Bot's Developer or this Server's Owner to/from the BlockList!`);
                        return "invalid";
                    }
                    else if ( userObj.user.bot || userObj.user.flags.has('SYSTEM') ) {
                        await Errors.LogToUser(message.channel, `Sorry, but you cannot add/remove Bots or Discord's System Accounts to/from the BlockList! (I ignore them anyways...)`);
                        return "invalid";
                    }
                    else {
                        return userObj;
                    }
                }

            }
            else if ( arg.includes(`@&`) ) {

                // Checked if arg has "@&" (for Roles)
                // remove said characters
                let roleID = arg.slice(3, arg.length - 1);
                let roleObj = await message.guild.roles.fetch(roleID, true);

                if (roleObj === null || roleObj === undefined) {
                    await Errors.LogToUser(message.channel, `I couldn't find a Role in this Server with that ID or Mention, please try again...`);
                    return "invalid";
                }
                else {
                    return roleObj;
                }

            }

        }
        else {

            // Not a Mention, go based of ID
            let argUser = null;
            let argChannel = null;
            let argRole = null;

            // Attempt User
            try {

                argUser = await message.guild.members.fetch({
                    user: arg,
                    cache: true
                });

            } catch (err) {
                argUser = null;
            }
            
            if ( argUser === null || argUser === undefined ) {

                // Attempt Channel
                try {
                    argChannel = message.guild.channels.resolve(arg);
                } catch (err) {
                    argChannel = null;
                }

                if ( argChannel === null || argChannel === undefined ) {

                    // Attempt Role
                    try {
                        argRole = await message.guild.roles.fetch(arg, true);
                    } catch (err) {
                        argRole = null;
                    }

                    if ( argRole === null || argRole === undefined ) {

                        await Errors.LogToUser(message.channel, `I couldn't find a User, Role, or Text Channel from that ID or Mention - please try again...`);
                        return "invalid";

                    }
                    else {
                        return argRole;
                    }

                }
                else {

                    // Check Channel type
                    if ( !(argChannel instanceof Discord.TextChannel) ) {
                        await Errors.LogToUser(message.channel, `Sorry, but that was a **${argChannel.type}** Channel, not a **Text** Channel. I can only handle Text Channels!`);
                        return "invalid";
                    }
                    else {

                        // Catch other Text-based channel typed
                        if ( argChannel instanceof Discord.NewsChannel || argChannel instanceof Discord.DMChannel ) {
                            await Errors.LogToUser(message.channel, `Sorry, but that was a **${argChannel.type}** Channel, not a **Text** Channel. I can only handle Text Channels!`);
                            return "invalid";
                        }

                        return argChannel;
                    }

                }

            }
            else {

                // Check Member
                if ( argUser.user.id === "156482326887530498" || argUser.user.id === message.guild.ownerID ) {
                    await Errors.LogToUser(message.channel, `Sorry, but you cannot add/remove the Bot's Developer or this Server's Owner to/from the BlockList!`);
                    return "invalid";
                }
                else if ( argUser.user.bot || argUser.user.flags.has('SYSTEM') ) {
                    await Errors.LogToUser(message.channel, `Sorry, but you cannot add/remove Bots or Discord's System Accounts to/from the BlockList! (I ignore them anyways...)`);
                    return "invalid";
                }
                else {
                    return argUser;
                }
            }


        }

    }
};
