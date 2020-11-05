const Discord = require("discord.js");
const Sequelize = require('sequelize');
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');
const { sequelize } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');

module.exports = {
    name: `dev`,
    description: `All the sub-commands for the developer command`,





    /**
     * Testing grounds
     * 
     * @param {Discord.Message} message Discord Message Object
     */
    async Test(message) {

        // Auto-fill "userName" in "userxp" DB
        /*let tempDB = await Tables.UserXP.findAll();
        let i = 0;


        let milliseconds = tempDB.length * 5000;
        let seconds = milliseconds / 1000;
        let minutes = 0;
        let hours = 0;
        if (seconds > 60 && seconds < 3600) {
            minutes = Math.floor(seconds / 60);
        }
        else if (seconds > 3600) {
            hours = Math.floor(seconds / 3600);
        }

        const progressMessage = await message.channel.send(`Filling out \`userName\` fields, this will take ${seconds} seconds (${minutes} minutes, ${hours} hours)`);

        
        let intervalTemp = setInterval(async () => {

            console.log(`TEST 1, i = ${i}`);

            let userOBJ = await client.users.fetch(tempDB[i].dataValues.userID);
            await Tables.UserXP.update({
                userName: `${userOBJ.username}#${userOBJ.discriminator}`
            }, {
                where: {
                    userID: userOBJ.id
                }
            })
            .catch(async err => {
                await Error.LogCustom(err, `DEV TESTING THING`);
            });

            i++;

            //console.log(`TEST 2 - Did ${userOBJ.username}#${userOBJ.discriminator}`);

            if ( i > tempDB.length - 1 ) {
                await progressMessage.edit(`Filled out all the \`userName\` fields!`);
                clearInterval(intervalTemp);
            }

        }, 5000);

        return;*/

        return await Error.LogToUser(message.channel, `No Tests available...`);

    },
    






















    /**
     * The main point of entry for the user-sub-commands
     * 
     * @param {Number} [exitCode] Custom Exit Code, if wanted
     */
    async KillSwitch(exitCode) {

        if (!exitCode) {
            return process.exit();
        }
        else {
            return process.exit(exitCode);
        }

    },























    /**
     * The main point of entry for the user-sub-commands
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<Object>} args The arguments inputted by the User
     */
    async UserMain(message, args) {

        // Check that the inputted @userMention or UserID is valid
        let selectedUser = args.shift();
        selectedUser = await this.UserCheck(selectedUser);

        if (selectedUser === "fail") {
            return await Error.LogToUser(message.channel, `I was unable to find that User!`);
        }
        else {

            // Check what action is wanted
            let action = args.shift();
            let option = args.shift();

            switch (action) {

                case 'view':
                    if ( ["xp", "level"].includes(option) ) {
                        return await this.UserViewRank(message, args.shift(), selectedUser);
                    }
                    else if (option === "prefs") {
                        return await this.UserViewPrefs(message, selectedUser);
                    }
                    else {
                        return await Error.LogToUser(message.channel, `That wasn't a valid option!\n(For **user view**, this would be either **xp**, **level**, or **prefs**)`);
                    }


                case 'set':
                    if (option === "xp") {
                        return await this.UserSetRank(message, args[1], selectedUser, args[0]);
                    }
                    else {
                        return await Error.LogToUser(message.channel, `That wasn't a valid option!\n(For **user set**, this would be either **xp** or **prefs**)`);
                    }


                default:
                    return Error.LogToUser(message.channel, `That wasn't a valid action!\n(For **user**, this would be either **view** or **set**)`);

            }

        }

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {String} guildid Guild ID to fetch
     * @param {Discord.User} selectedUser Discord User Object
     * @param {Number} xpAmount XP amount to set as the User's new XP total
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async UserSetRank(message, guildid, selectedUser, xpAmount) {

        // Fetch Guild
        let fetchedGuild = await this.GuildCheck(guildid);

        if ( fetchedGuild === "fail" ) {
            return await Error.LogToUser(message.channel, `I'm unable to fetch Guild from the given ID!`);
        }
        else {

            // Check xpAmount is an INTEGER
            xpAmount = Number(xpAmount);

            if ( isNaN(xpAmount) ) {
                return await Error.LogToUser(message.channel, `That wasn't a valid number for the XP amount!`);
            }


            // Save new XP amount
            await Tables.UserXP.update(
                {
                    xp: xpAmount
                },
                {
                    where: {
                        userID: selectedUser.id,
                        guildID: fetchedGuild.id
                    }
                }
            ).catch(async (err) => {
                await Error.LogCustom(err, `(**devFunctions.js**) Attempted UserXP data update for ${selectedUser.username}#${selectedUser.discriminator} in ${fetchedGuild.name}`);
                return await Error.LogToUser(message.channel, `I was unable to update the XP data for **${selectedUser.username}#${selectedUser.discriminator}** in Guild **${fetchedGuild.name}**`);
            });


            // Output
            const embed = new Discord.MessageEmbed().setColor('#00ffee')
            .setDescription(`Successfully updated **${selectedUser.username}** XP total in Guild __${fetchedGuild.name}__ to **${xpAmount}**`)
            .setFooter(`Developer Module`);

            return await message.channel.send(embed);


        }

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.User} selectedUser Discord User Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async UserViewPrefs(message, selectedUser) {

        // Fetch Database
        let userPrefsData = await Tables.UserPrefs.findOrCreate(
            {
                where: {
                    userID: selectedUser.id
                }
            }
        ).catch(async (err) => {
            await Error.LogCustom(err, `(**devFunctions.js**) Attempted UserPrefs data fetch for ${selectedUser.username}#${selectedUser.discriminator}`);
            return await Error.LogToUser(message.channel, `I was unable to fetch the Prefs data for **${selectedUser.username}#${selectedUser.discriminator}**`);
        });

        userPrefsData = userPrefsData[0].dataValues;


        // Output
        const embed = new Discord.MessageEmbed().setColor('#00ffee')
        .setTitle(`${selectedUser.username} Prefs Data`)
        .setDescription(`**Rank Background:** ${userPrefsData.rankBackground}
        **Allow Mentions:** ${userPrefsData.mentions}`)
        .setFooter(`Developer Module`);

        return await message.channel.send(embed);

    },
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {String} guildid Guild ID
     * @param {Discord.User} selectedUser Discord User Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async UserViewRank(message, guildid, selectedUser) {

        // Fetch Guild
        let fetchedGuild = await this.GuildCheck(guildid);

        if ( fetchedGuild === "fail" ) {
            return await Error.LogToUser(message.channel, `I'm unable to fetch Guild from the given ID!`);
        }
        else {

            // Fetch Database
            let userRankData = await Tables.UserXP.findOrCreate(
                {
                    where: {
                        userID: selectedUser.id,
                        guildID: fetchedGuild.id
                    }
                }
            ).catch(async (err) => {
                await Error.LogCustom(err, `(**devFunctions.js**) Attempted UserXP data fetch for ${selectedUser.username}#${selectedUser.discriminator} in ${fetchedGuild.name}`);
                return await Error.LogToUser(message.channel, `I was unable to fetch the XP data for **${selectedUser.username}#${selectedUser.discriminator}** in Guild **${fetchedGuild.name}**`);
            });

            userRankData = userRankData[0].dataValues.xp;


            // Calculate Level
            let userRankLevel = await Levels.FetchLevel(userRankData);


            // Output
            const embed = new Discord.MessageEmbed().setColor('#00ffee')
            .setTitle(`${selectedUser.username} Rank Data`)
            .setDescription(`**For Guild:** ${fetchedGuild.name}
            **Level:** ${userRankLevel}
            **XP:** ${userRankData}`)
            .setFooter(`Developer Module`);

            return await message.channel.send(embed);

        }

    },
    




















    /**
     * Main point of entry for the global-sub-commands
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<Object>} args The arguments inputted by the User
     */
    async GlobalMain(message, args) {

        // TODO

    },
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {String} guildid The ID to fetch into a Guild Object
     * 
     * @returns {(Promise<Discord.Guild>|String)} wrapped User Object or "fail"
     */
    async GuildCheck(guildid) {

        let fetchedGuild = null;

        try {
            fetchedGuild = await client.guilds.fetch(guildid);
        } catch (err) {
            return "fail";
        }

        return fetchedGuild;

    },
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {String} selectedUser The User Mention or ID to check
     * 
     * @returns {(Promise<Discord.User>|String)} wrapped User Object or "fail"
     */
    async UserCheck(selectedUser) {


        let fetchedUser = null;

        // Check as if it was a User ID first
        try {
            fetchedUser = await client.users.fetch(selectedUser);
        } catch (err) {
            // It ain't a User ID, go for User Mention now
            fetchedUser = "mention";
        }



        if (fetchedUser !== "mention") {
            return fetchedUser;
        }
        else if (fetchedUser === null || fetchedUser === undefined) {
            return "fail";
        }
        else {

            // Fetch User based off Mention

            const matches = selectedUser.match(/^<@!?(\d+)>$/);
            // The id is the first and only match found by the RegEx.
            // However the first element in the matches array will be the entire mention, not just the ID,
            // so use index 1.

            try {
                fetchedUser = await client.users.fetch(matches[1]);
            } catch (err) {
                return "fail";
            }

            return fetchedUser;

        }

    }
}