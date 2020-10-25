const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const Chance = require('chance');
let chance = new Chance();
const { client } = require('../constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Prefixs = require('../prefixFunctions.js');
const ManageRoles = require('../leveling/roleManageFunctions.js');
const broadcastFunctions = require('../leveling/broadcastFunctions.js');

// Global variables and consts for roulette
const standardResults = [
    [
        "returnBet",
        "loseHalfBet", "loseBet", "loseDoubleBet", "loseTripleBet", "loseALevel", "loseThreeLevels",
        "winBetPlusHalf", "winDoubleBet", "winTripleBet", "winALevel", "winThreeLevels"
    ],
    [
        1.0,
        1.0, 0.8, 0.5, 0.1, 0.01, 0.01,
        0.8, 0.5, 0.1, 0.01, 0.01,
    ]
];

let betResult = 0;
let newXP = 0;
let currentLevel = 0;
let newLevel = 0;



// Embeds
const goodEmbed = new Discord.MessageEmbed().setColor('#1ec74b');
const neturalEmbed = new Discord.MessageEmbed().setColor('#34ebde');
const badEmbed = new Discord.MessageEmbed().setColor('#ab0202');



module.exports = {
    name: `roulette`,
    description: `All the stuff for the roulette command`,
    




    /**
     * Apply Level Changes
     * 
     * @param {Number} oldXPTotal Old XP total of User
     * @param {Number} newXPTotal New XP total of User
     * @param {Discord.Message} message Discord Message Object
     */
    async MainLevelCheck(oldXPTotal, newXPTotal, message) {

        let oldLevel = await Levels.FetchLevel(oldXPTotal);
        let newLevel = await Levels.FetchLevel(newXPTotal);

        let levelChange = await Levels.CompareLevels(oldLevel, newLevel);

        if ( levelChange === "nochange" ) {
          return;
        }
        else if ( levelChange === "levelup" ) {
          await broadcastFunctions.Main(message, message.author, message.guild, "up");
          await ManageRoles.Main(message.member, message.guild, newXPTotal, newLevel);
        }
        else if ( levelChange === "leveldown" ) {
          await broadcastFunctions.Main(message, message.author, message.guild, "down");
          await ManageRoles.Main(message.member, message.guild, newXPTotal, newLevel, true, oldXPTotal);
        }

    },















    
    /**
     * Starting point for Roulette Command
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Number} bet Integer representing the XP Bet
     * @param {Number} authorXP Integer representing the Author's current XP count
     */
    async MainStandard(message, bet, authorXP) {

        const resultEmbed = await this.RollStandard(bet, authorXP, message.member, message);

        return await message.channel.send(resultEmbed);

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Number} bet User's XP Bet
     * @param {Number} authorXP User's current XP total
     * @param {Discord.GuildMember} guildMember Discord Guild Member Object
     * @param {Discord.Message} message Discord Message Object
     * 
     * @returns {Promise<Discord.MessageEmbed>} wrapped Message Embed
     */
    async RollStandard(bet, authorXP, guildMember, message) {
        
        // Roll for result
        let result = chance.weighted(standardResults[0], standardResults[1]);


        // Check Result and return formatted Embed AFTER applying result

        switch (result) {

            case "returnBet":
                // Since we haven't removed the Bet, we can do nothing here.
                neturalEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and it landed on \`safe zone\`!
                You will neither lose nor gain XP, so here's your Bet of ${bet} XP back!`);
                return neturalEmbed;




            case "loseHalfBet":
                betResult = Math.floor(bet / 2);

                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got slightly unlucky!
                You will lose half your bet (${betResult} XP)`);

                // Apply changes
                newXP = await XPs.SubtractXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;




            case "loseBet":
                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got unlucky!
                You will lose your *entire* Bet of ${bet} XP!`);

                // Apply Changes
                newXP = await XPs.SubtractXP(bet, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;




            case "loseDoubleBet":
                betResult = Math.floor(bet * 2);
                
                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got unlucky!
                You will lose double what you betted for a total lost of ${betResult} XP`);

                // Apply Changes
                newXP = await XPs.SubtractXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;
            



            case "loseTripleBet":
                betResult = Math.floor(bet * 3);
                
                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got unlucky!
                You will lose triple what you betted for a total lost of ${betResult} XP`);

                // Apply Changes
                newXP = await XPs.SubtractXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;
                



            case "loseALevel":
                currentLevel = await Levels.FetchLevel(authorXP);
                newXP = await Levels.FetchXPForLevel(currentLevel - 1);
                newLevel = await Levels.FetchLevel(newXP);
                
                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got *very* unlucky!
                You will lose an *entire* Level! (They are now at Level ${newLevel})`);

                // Apply Changes
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;
                                



            case "loseThreeLevels":
                currentLevel = await Levels.FetchLevel(authorXP);
                newXP = await Levels.FetchXPForLevel(currentLevel - 3);
                newLevel = await Levels.FetchLevel(newXP);
                
                badEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got *extremely* unlucky!
                You will lose *three (3) entire* Levels! (They are now at Level ${newLevel})`);

                // Apply Changes
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return badEmbed;
                            



            case "winBetPlusHalf":
                betResult = Math.floor(bet * 1.5);
                
                goodEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got slightly lucky!
                You will win back 1.5x your original Bet to receive ${betResult} XP`);

                // Apply Changes
                newXP = await XPs.AddXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return goodEmbed;
                                            



            case "winDoubleBet":
                betResult = Math.floor(bet * 2);
                
                goodEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got lucky!
                You will win back double your original Bet to receive ${betResult} XP`);

                // Apply Changes
                newXP = await XPs.AddXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return goodEmbed;
                                            



            case "winTripleBet":
                betResult = Math.floor(bet * 3);
                
                goodEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got lucky!
                You will win back triple your original Bet to receive ${betResult} XP`);

                // Apply Changes
                newXP = await XPs.AddXP(betResult, authorXP);
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return goodEmbed;
                                



            case "winALevel":
                currentLevel = await Levels.FetchLevel(authorXP);
                newXP = await Levels.FetchXPForLevel(currentLevel + 1);
                newLevel = await Levels.FetchLevel(newXP);
                
                goodEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got *very* lucky!
                You will win an *entire* Level! (They are now at Level ${newLevel})`);

                // Apply Changes
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return goodEmbed;
                                



            case "winThreeLevels":
                currentLevel = await Levels.FetchLevel(authorXP);
                newXP = await Levels.FetchXPForLevel(currentLevel + 3);
                newLevel = await Levels.FetchLevel(newXP);
                
                goodEmbed.setTitle(`${guildMember.displayName} spun the Roulette Wheel!`)
                .setDescription(`...and got *extremely* lucky!
                You will win *three (3) entire* Levels! (They are now at Level ${newLevel})`);

                // Apply Changes
                await XPs.SaveXP(guildMember.guild.id, guildMember.user.id, newXP);
                await this.MainLevelCheck(authorXP, newXP, message);
                return goodEmbed;




            default:
                neturalEmbed.setDescription(`Awkward! A mysterious error has occurred...
                If you keep seeing this error, report it to TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                return neturalEmbed;

        }


    }
}