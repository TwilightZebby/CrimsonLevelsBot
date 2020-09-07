const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');
const LevelAmounts = require('../levels.json');

module.exports = {

    // Fetch the User's Current Level
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
    















    // Compare Levels
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
