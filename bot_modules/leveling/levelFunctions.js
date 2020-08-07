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
        
        // Pass to UpdateXP()
        return await this.UpdateXP(message, authorCurrent);

    },
















    // Update User's XP
    async UpdateXP(message, authorCurrent) {

        // Generate a random amount of XP
        let generatedXP = Math.floor( ( Math.random() * 10 ) + 1 );

        // Add to previous XP amount
        let authorNewXP = authorCurrent.xp + generatedXP;
        console.log(authorNewXP);

        // Save back to Database
        await Tables.UserXP.update({
            xp: authorNewXP
        }, {
            where: {
                guildID: message.guild.id,
                userID: message.author.id
            }
        })
        .catch(async err => {
            return await Errors.Log(err);
        })

        return;

    }

};
