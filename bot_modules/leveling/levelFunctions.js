const Discord = require('discord.js');
const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');
const LevelAmounts = require('../levels.json');

module.exports = {

    /**
     * Returns the User's Level calculated from the given XP
     * 
     * @param {Number} xp An amount of XP to calculate the Level from
     * 
     * @returns {Number} The calculated Level
     */
    async FetchLevel(xp) {

        let lvlAmounts = Object.values(LevelAmounts);

        for( let i = 0; i <= lvlAmounts.length; i++ ) {

            let lvl = LevelAmounts[`l${i}`];
            
            if( xp > 200000 ) {
                return 200;
            }
            else if( xp > lvl ) {
                continue;
            }
            else if( xp < lvl ) {

                // Catch
                if( xp <= 0 ) {
                    return 0;
                }

                return i - 1;

            }
            else if( xp === lvl ) {
                return i;
            }

        }

    },
    















    /**
     * Fetch the amount of XP required for a Level
     * 
     * @param {Number} level The Level Number to search for
     * 
     * @returns {Number} The amount of XP that Level requires
     */
    async FetchXPForLevel(level) {

        if (level > 200) {
            return LevelAmounts[`l200`];
        }
        else if (level < 0) {
            return LevelAmounts[`l0`];
        }
        else {
            return LevelAmounts[`l${level}`];
        }

    },
    















    /**
     * Compare two different Levels together to see if there are any changes between them
     * 
     * @param {Number} oldLevel The User's old Level
     * @param {Number} newLevel The User's new Level
     * 
     * @returns {String} String stating if there was a change or not. EITHER "levelup", "nochange", "leveldown"
     */
    async CompareLevels(oldLevel, newLevel) {

        if( newLevel > oldLevel ) {
            return `levelup`;
        }
        else if( newLevel === oldLevel ) {
            return `nochange`;
        }
        else if( newLevel < oldLevel ) {
            return `leveldown`;
        }

    }

};
