const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');

module.exports = {

    // Fetch User's XP
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
    















    // Generate new amount of XP
    async GenerateXP() {

        // Generate a random amount of XP
        return Math.floor( ( Math.random() * 10 ) + 1 );

    },
    















    // Add newXP to currentXP
    async AddXP(newXP, currentXP) {

        return Math.floor(currentXP + newXP);

    },
    















    // Subtract newXP from currentXP
    async SubtractXP(newXP, currentXP) {

        return Math.floor(currentXP - newXP);

    },
















    // Save User's XP
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
