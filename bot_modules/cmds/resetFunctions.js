const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Prefixs = require('../prefixFunctions.js');

module.exports = {
    name: `reset`,
    description: `All the stuff for the reset command`,




    
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

    },
    
    



















    /**
     * Confirms that the Guild Owner does want to reset XP
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {String} confirmType Either "all" or "user"
     * @param {Discord.User} [resetUser] Discord User Object, only required if passing "user" for confirmType
     * 
     * @returns {Promise<String>} "confirmed" or "denied"
     */
    async Confirm(message, confirmType, resetUser) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

        // Construct Embed
        let embed = new Discord.MessageEmbed().setColor('#DC143C')
        .setTitle(`Reset XP Confirmation`);


        // Check confirmType
        if (confirmType === "all") {
            embed.setDescription(`Please click the ✅ emoji reaction to confirm that you want to **reset all the XP totals back to zero (0)** for your Server`);
        }
        else if (confirmType === "user") {
            embed.setDescription(`Please click the ✅ emoji reaction to confirm that you want to **reset the XP total for ${resetUser.toString()}**`);
        }

        const confirmationMessage = await message.channel.send(embed);
        await confirmationMessage.react('✅').catch(async (err) => {
            await Error.LogCustom(err, `(**resetFunctions.js**)`);
        });


        // Wait for reaction
        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
        const collector = confirmationMessage.createReactionCollector(filter, {
            time: 10000
        })
        .on("collect", (reaction, user) => {
            collector.stop("confirmed");
        })
        .on("end", async (collected, reason) => {

            if ( ["time", "idle"].includes(reason) ) {

                embed.setTitle(`⌛ Confirmation Timed Out`)
                .setDescription(`You were too slow to respond, sorry! (Trigger this again using \`${PREFIX}reset\` if need be)`);

                await confirmationMessage.edit(embed);
                return await confirmationMessage.reactions.removeAll();

            }
            else if ( ["user", "confirmed"].includes(reason) ) {

                // for reseting a SPECIFIC USER
                if (confirmType === "user") {


                    // Update database
                    await Tables.UserXP.update(
                        {
                            xp: 0
                        },
                        {
                            where: {
                                userID: resetUser.id,
                                guildID: message.guild.id
                            }
                        }
                    ).catch(async (err) => {
                    
                        await Error.LogCustom(err, `(**resetFunctions.js**) Attempted UserXP data reset for ${message.guild.name}`);
    
                        embed.setColor('#9c0000')
                        .setTitle(`⚠️ An error has occurred!`)
                        .setDescription(`I was unable to reset the XP data to zero for Member **${resetUser.username}#${resetUser.discriminator}** in Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
    
                        return await confirmationMessage.edit(embed);
    
                    });


                    embed.setTitle(`Reset XP for ${resetUser.username}`)
                    .setDescription(`Successfully reset ${resetUser.toString()} XP back to zero (0)
                    *Note: any assigned Level Roles are not revoked during resets - this will be coded in soon!*`);

                    return await confirmationMessage.edit(embed);

                }
                else if (confirmType === "all") {

                    // Update database
                    await Tables.UserXP.update(
                        {
                            xp: 0
                        },
                        {
                            where: {
                                guildID: message.guild.id
                            }
                        }
                    ).catch(async (err) => {
                    
                        await Error.LogCustom(err, `(**resetFunctions.js**) Attempted UserXP data reset for ${message.guild.name}`);
    
                        embed.setColor('#9c0000')
                        .setTitle(`⚠️ An error has occurred!`)
                        .setDescription(`I was unable to reset the XP data to zero for all Members in Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
    
                        return await confirmationMessage.edit(embed);
    
                    });


                    embed.setTitle(`Reset XP for ${message.guild.name}`)
                    .setDescription(`Successfully reset all Member's XP back to zero (0) for this Server
                    *Note: any assigned Level Roles are not revoked during resets - this will be coded in soon!*`);

                    return await confirmationMessage.edit(embed);

                }

            }

        });

    }
}