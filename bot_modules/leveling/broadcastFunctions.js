const Discord = require('discord.js');
const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');
const LevelAmounts = require('../levels.json');
const XPs = require('./xpFunctions.js');
const Levels = require('./levelFunctions.js');

module.exports = {

    /**
     * Checks if the Guild has a set Broadcast Channel in the CONFIG cmd
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.User} author Discord User Object
     * @param {Discord.Guild} guild Discord Guild Object
     * @param {String} up_or_down If the User is levelling up or down
     */
    async Main(message, author, guild, up_or_down) {

        // Check if Guild has a set Broadcast Channel
        let serverDB = await Tables.GuildConfig.findOrCreate({
            where: {
                guildID: guild.id
            }
        });
  
        let serverData = serverDB[0].dataValues;
        let broadChannel = null;

        // Check Broadcast-Channel value
        if (serverData.broadcastChannel !== "disable" && serverData.broadcastChannel !== "current") {
            try {
                broadChannel = guild.channels.resolve(serverData.broadcastChannel);
            } catch (err) {
                await Errors.Log(err);
            }

            if (broadChannel !== null) {
                serverData.broadcastChannel = `#${broadChannel.name}`;
            }
        }


        // Fetch User Preferences Data
        let memberDB = await Tables.UserPrefs.findOrCreate({
            where: {
                userID: author.id
            }
        });

        let memberData = memberDB[0].dataValues;


        if ( serverData.broadcastChannel === "disable" ) {
            return;
        }
        else if ( serverData.broadcastChannel === "current" ) {
            await this.MainCurrent(message, author, guild, up_or_down, serverData, memberData);
        }
        else {
            await this.MainChannel(message, author, guild, up_or_down, serverData, memberData, broadChannel);
        }

    },











    /**
     * Outputs the Level Message to the CURRENT channel
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.Author} author Discord User Object
     * @param {Discord.Guild} guild Discord Guild Object
     * @param {String} up_or_down If the User is leveling up or down
     * @param {*} serverData GUILD_CONFIG data pulled from Database
     * @param {*} memberData USER_PREFS data pulled from Database
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async MainCurrent(message, author, guild, up_or_down, serverData, memberData) {

        // Calculate the Level
        let memberXP = await XPs.FetchXP(message);
        let memberLevel = await Levels.FetchLevel(memberXP);


        // Fetch Level Message
        let levelMessage = null;

        if ( up_or_down === "up" ) {
            levelMessage = serverData.levelUpMessage;
        }
        else if ( up_or_down === "down" ) {
            levelMessage = serverData.levelDownMessage;
        }

        // Format Message
        levelMessage = levelMessage.replace("{user}", `\<\@${author.id}\>`);
        levelMessage = levelMessage.replace("{level}", `${memberLevel}`);
        // For {xp} which is optional
        if (levelMessage.includes("{xp}")) {
            levelMessage = levelMessage.replace("{xp}", `${memberXP}`);
        }


        // Does the User have @mentions disabled?
        if ( memberData.mentions === "true" ) {

            return await message.channel.send(levelMessage);

        }
        else if ( memberData.mentions === "false" ) {

            return await message.channel.send(levelMessage, {
                allowedMentions: {
                    parse: []
                }
            });

        }

    },
    










    /**
     * Outputs the Level message to a SET channel
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.User} author Discord User Object
     * @param {Discord.Guild} guild Discord Guild Object
     * @param {String} up_or_down If the User is leveling up or down
     * @param {*} serverData GUILD_CONFIG data pulled from Database
     * @param {*} memberData USER_PREFS data pulled from Database
     * @param {Discord.TextChannel} broadChannel Discord TextChannel Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async MainChannel(message, author, guild, up_or_down, serverData, memberData, broadChannel) {

        // Calculate the Level
        let memberXP = await XPs.FetchXP(message);
        let memberLevel = await Levels.FetchLevel(memberXP);
        

        // Fetch Level Message
        let levelMessage = null;

        if ( up_or_down === "up" ) {
            levelMessage = serverData.levelUpMessage;
        }
        else if ( up_or_down === "down" ) {
            levelMessage = serverData.levelDownMessage;
        }

        // Format Message
        levelMessage = levelMessage.replace("{user}", `\<\@${author.id}\>`);
        levelMessage = levelMessage.replace("{level}", `${memberLevel}`);
        // For {xp} which is optional
        if (levelMessage.includes("{xp}")) {
            levelMessage = levelMessage.replace("{xp}", `${memberXP}`);
        }


        // Does the User have @mentions disabled?
        if ( memberData.mentions === "true" ) {

            return await broadChannel.send(levelMessage);

        }
        else if ( memberData.mentions === "false" ) {

            return await broadChannel.send(levelMessage, {
                allowedMentions: {
                    parse: []
                }
            });

        }

    }

};
