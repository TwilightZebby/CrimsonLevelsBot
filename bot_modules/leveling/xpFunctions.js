const Discord = require('discord.js');
const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');

module.exports = {

    /**
     * Returns the User's current XP
     * 
     * @param {Discord.Message} message Discord Message Object
     * 
     * @returns {Number} The User's current XP
     */
    async FetchXP(message) {

        let authorData = await Tables.UserXP.findOrCreate({
            where: {
                guildID: message.guild.id,
                userID: message.author.id
            }
        })
        .catch(async err => {
            return await Errors.Log(err);
        })

        let authorCurrent = authorData[0].dataValues;
        
        return authorCurrent.xp;

    },
    















    /**
     * Generate a random amount of XP between 1 and 10
     * 
     * @returns {Number} xp
     */
    async GenerateXP() {

        // Generate a random amount of XP
        return Math.floor( ( Math.random() * 10 ) + 1 );

    },
    















    /**
     * Returns an updated XP total via addition
     * 
     * @param {Number} newXP The XP to add to the total
     * @param {Number} currentXP The User's current XP amount
     * 
     * @returns {Number} new XP total
     */
    async AddXP(newXP, currentXP) {

        return Math.floor(currentXP + newXP);

    },
    















    /**
     * Returns an updated XP total via subtraction
     * 
     * @param {Number} newXP The XP to subtract from the total
     * @param {Number} currentXP The User's current XP amount
     * 
     * @returns {Number} new XP total
     */
    async SubtractXP(newXP, currentXP) {

        return Math.floor(currentXP - newXP);

    },
















    /**
     * Save an updated XP total back to the USERXP database
     * 
     * @param {String} guildID The ID of the Discord Guild
     * @param {String} userID ID of the Discord User
     * @param {Number} newXP The new XP total to save
     */
    async SaveXP(guildID, userID, newXP) {

        // Save back to Database
        await Tables.UserXP.update({
            xp: newXP
        }, {
            where: {
                guildID: guildID,
                userID: userID
            }
        })
        .catch(async err => {
            return await Errors.Log(err);
        })

        return;

    }

};
