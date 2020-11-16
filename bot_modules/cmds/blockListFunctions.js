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

            if ( inputObj instanceof Discord.User() ) {
                blockedType = "user";
            }
            else if ( inputObj instanceof Discord.Role() ) {
                blockedType = "role";
            }
            else if ( inputObj instanceof Discord.TextChannel() ) {
                blockedType = "channel";
            }

            // Save to DB
            try {

                await Tables.BlockList.create({
                    guildID: message.guild.id,
                    blockedID: inputObj.id,
                    blockType: blockedType
                });

                return await message.reply(`Successfully blocked the ${blockedType} **${inputObj instanceof Discord.User() ? inputObj.username : inputObj.name}** from XP gains.`);

            } catch (err) {

                if (err.name === "SequelizeUniqueConstraintError") {
                    await Errors.LogCustom(err, `(**blockListFunctions.js**) Attempted addition to BlockList DB, but ${blockedType} ${inputObj.id} already exists for Guild ${message.guild.name} (ID: ${message.guild.id})`);
                    return Errors.LogToUser(message.channel, `That ${blockedType} already exists in this Server's Database!`);
                }
                else {
                    await Errors.LogMessage(err, `(**blockListFunctions.js**) Attempted addition of ${blockedType} ${inputObj.id} to BlockList DB for Guild ${message.guild.name} (ID: ${message.guild.id})`);
                    return Errors.LogToUser(message.channel, `I was unable to add that ${blockedType} to this Server's Database! If this error continues, please ask for help on my [support server](https://discord.gg/YuxSF39)`);
                }

            }

        }

    },
    















    /**
     * Check Type
     * 
     * @param {String} arg The Argument which holds the User, Role, or Channel
     * @param {Discord.Message} message Discord Message
     * 
     * @returns {(Promise<Discord.User>|Promise<Discord.Role>|Promise<Discord.TextChannel>|Promise<"invalid">)} The Discord object, or "invalid"
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
                if ( !(channelObj instanceof Discord.TextChannel()) ) {
                    await Errors.LogToUser(message.channel, `That was a(n) **${channelObj.type}** Channel, not a **Text** Channel. I can only work in Text Channels!`);
                    return "invalid";
                }
                else if (channelObj === null || channelObj === undefined) {
                    await Errors.LogToUser(message.channel, `I couldn't find a Text Channel in this Server with that ID or Mention, please try again...`);
                    return "invalid";
                }
                else {
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
                    return userObj;
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
            argUser = await message.guild.members.fetch({
                user: arg,
                cache: true
            });
            
            if ( argUser === null || argUser === undefined ) {

                // Attempt Channel
                argChannel = message.guild.channels.resolve(arg);

                if ( argChannel === null || argChannel === undefined ) {

                    // Attempt Role
                    argRole = await message.guild.roles.fetch(arg, true);

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
                    if ( !(argChannel instanceof Discord.TextChannel()) ) {
                        await Errors.LogToUser(message.channel, `Sorry, but that was a **${argChannel.type}** Channel, not a **Text** Channel. I can only handle Text Channels!`);
                        return "invalid";
                    }
                    else {
                        return argChannel;
                    }

                }

            }
            else {
                return argUser;
            }


        }

    }
};
