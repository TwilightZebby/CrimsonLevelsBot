const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const canvasExtras = require("canvas-extras");
const { client } = require('../constants.js');
const ns = require('number-string');

let { PREFIX } = require('../../config.js');
const BaseLevels = require('../levels.json');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Devs = require('../cmds/devFunctions.js');


// So the Bot knows what colour to render the text for the BGs
const BackgroundInfo = require('../../backgrounds/backgroundInfo.json');


const allBackgrounds = [];
const standardBackgrounds = [];
const prideBackgrounds = [];
const gradientBackgrounds = [];
const themedBackgrounds = [];

const standardBGs = fs.readdirSync('./backgrounds/standard').filter(file => file.endsWith('.png'));
for (const file of standardBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    standardBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING);

}

const prideBGs = fs.readdirSync('./backgrounds/pride').filter(file => file.endsWith('.png'));
for (const file of prideBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    prideBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING);

}

const gradientBGs = fs.readdirSync('./backgrounds/gradient').filter(file => file.endsWith('.png'));
for (const file of gradientBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    gradientBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING)

}

const themedBGs = fs.readdirSync('./backgrounds/themed').filter(file => file.endsWith('.png'));
for (const file of themedBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    themedBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING);

}





// NUMBERS
// Thanks to https://stackoverflow.com/a/32638472
const abbreviateNumber = (num, fixed) => {
    if (num === null) { return null; } // terminate early

    if (num === 0) { return '0'; } // terminate early

    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show

    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
        
    return e;
};




// CANVAS

// Apply Text
const applyText = (canvas, text, ctx) => {

    // Base Font Size
    let fontSize = 70;

    do {
        // Change font size based on String Length
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return new result
    return ctx.font;

};

module.exports = {
    name: `backgrounds`,
    description: `Generation of Rank Backgrounds`,





    /**
     * Generates the Rank Card to show the User their own current XP/Level
     * 
     * @param {Discord.Message} message Discord Message Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateAuthorCard(message) {

        // Fetch Database
        let userRankPref = await Tables.UserPrefs.findOrCreate({
            where: {
                userID: message.author.id
            }
        }).catch(async err => {
            return await Error.LogToUser(message.channel, `I was unable to fetch your Preferences. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });

        userRankPref = userRankPref[0].dataValues.rankBackground;


        let currentXP = await XPs.FetchXP(message);
        let currentLevel = await Levels.FetchLevel(currentXP);

        // Shorten if need be
        currentXP = abbreviateNumber(currentXP, 0);










        if (userRankPref === `disable`) {

            // NO CARD, JUST TEXT
            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);

            // OUTPUT RANKING
            return await client.throttleCheck(message.channel, `**${message.member.displayName}**\n> You currently have **${currentXP}** XP, and are Level **${currentLevel}**!\n> Progress to next level: ${levelProgress}%`, message.author.id);

        } else {

            




            // Generate Background



            let backgroundPath;
            if (standardBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/standard/${userRankPref}.png`;
            } else if (prideBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/pride/${userRankPref}.png`;
            } else if (gradientBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/gradient/${userRankPref}.png`;
            } else if (themedBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/themed/${userRankPref}.png`;
            }




            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);





            // CANVAS
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const canvasBackground = await Canvas.loadImage(backgroundPath);
            ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);


            // Apply text based on colour needed, after fetching from JSON
            let backgroundColors = BackgroundInfo[`${userRankPref}`]["colors"];

            // DISPLAY NAME
            ctx.font = applyText(canvas, message.member.displayName, ctx);
            ctx.fillStyle = backgroundColors["username"];
            ctx.fillText(message.member.displayName, canvas.width / 2.3, canvas.height / 2.2);

            // LEVELS
            ctx.font = "28px sans-serif";
            ctx.fillStyle = backgroundColors["level"];
            ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.3, canvas.height / 1.45);

            // XP
            ctx.font = "28px sans-serif";
            ctx.fillStyle = backgroundColors["xp"];
            ctx.fillText(`XP: ${currentXP}`, canvas.width / 1.35, canvas.height / 1.45);

            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(levelProgress, 100, canvas.width / 2.4, canvas.height / 1.4, 350, 40, backgroundColors["progressBarFill"], backgroundColors["progressBarEmpty"]);
            ctx.closePath();







            // User Profile Picture
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({
                format: 'png'
            }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            // Output!
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank.png`);
            return await client.throttleCheck(message.channel, ``, message.author.id, attachment);

        }

    },
    






















    /**
     * Generates the Rank Card for an [at]mentioned User
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args args array containing the mentioned User
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateCardMentioned(message, args) {

        // Attempt to get User
        const user = await Devs.UserCheck(args[0]);

        if (user === "fail") {
            return await Error.LogToUser(message.channel, `That wasn't a valid User! Please try again...`);
        }

        // If its a Bot, RETURN
        if (user.bot) {
            return await Error.LogToUser(message.channel, `I do not store XP for other Bots!`);
        }

        // System Message Check
        if (user.flags.has('SYSTEM')) {
            return await Error.LogToUser(message.channel, `I cannot store XP for Discord's SYSTEM MESSAGES Account!`)
        }

        // Also get Member object as well
        const userMember = await message.guild.members.fetch(user);






        // Fetch Database
        let userRankPref = await Tables.UserPrefs.findOrCreate({
            where: {
                userID: user.id
            }
        }).catch(async err => {
            return await Error.LogToUser(message.channel, `I was unable to fetch ${user.toString()} Preferences. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });

        userRankPref = userRankPref[0].dataValues.rankBackground;


        let currentXP = await XPs.FetchXP(message, userMember);
        let currentLevel = await Levels.FetchLevel(currentXP);

        // Shorten if need be
        currentXP = abbreviateNumber(currentXP, 0);










        if (userRankPref === `disable`) {

            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message, userMember);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);

            return await client.throttleCheck(message.channel, `> ${user.username}#${user.discriminator} currently has **${currentXP}** XP, and is Level **${currentLevel}**!\n> Progress to next level: ${levelProgress}%`, message.author.id);

        } else {

            let backgroundPath;
            if (standardBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/standard/${userRankPref}.png`;
            } else if (prideBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/pride/${userRankPref}.png`;
            } else if (gradientBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/gradient/${userRankPref}.png`;
            } else if (themedBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/themed/${userRankPref}.png`;
            }




            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message, userMember);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);





            // CANVAS
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const canvasBackground = await Canvas.loadImage(backgroundPath);
            ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);


            // Apply text based on colour needed, after fetching from JSON
            let backgroundColors = BackgroundInfo[`${userRankPref}`]["colors"];

            // DISPLAY NAME
            ctx.font = applyText(canvas, userMember.displayName, ctx);
            ctx.fillStyle = backgroundColors["username"];
            ctx.fillText(userMember.displayName, canvas.width / 2.3, canvas.height / 2.2);
 
            // LEVELS
            ctx.font = "28px sans-serif";
            ctx.fillStyle = backgroundColors["level"];
            ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.3, canvas.height / 1.45);

            // XP
            ctx.font = "28px sans-serif";
            ctx.fillStyle = backgroundColors["xp"];
            ctx.fillText(`XP: ${currentXP}`, canvas.width / 1.35, canvas.height / 1.45);
 
            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(levelProgress, 100, canvas.width / 2.4, canvas.height / 1.4, 350, 40, backgroundColors["progressBarFill"], backgroundColors["progressBarEmpty"]);
            ctx.closePath();









            // User Profile Picture
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(user.displayAvatarURL({
                format: 'png'
            }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            // Output!
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank.png`);
            return await client.throttleCheck(message.channel, ``, message.author.id, attachment);

        }

    },
        






















    /**
     * Used for generating a preview of the Rank Card
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args args array containing the arguments
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateCardPreview(message, args) {

        // First check for a BG name
        if ( !args[1] ) {
            return await Error.LogToUser(message.channel, `I couldn't find any given Background Names! Please try again, making sure you use the format: \`${PREFIX}background preview backgroundName\``);
          }

          // Now look for the background
          let backgroundValue = args[1];

          if ( !allBackgrounds.includes(backgroundValue) ) {
            return await Error.LogToUser(message.channel, `That background doesn't exist! Please try again, making sure you have typed the background's name exactly as it appears in \`${PREFIX}background list\``);
          }

          // Generate Background preview

          let backgroundPath;
          if ( standardBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/standard/${backgroundValue}.png`;
          }
          else if ( prideBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/pride/${backgroundValue}.png`;
          }
          else if ( gradientBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/gradient/${backgroundValue}.png`;
          }
          else if ( themedBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/themed/${backgroundValue}.png`;
          }


          // CANVAS
          const canvas = Canvas.createCanvas(700, 250);
          const ctx = canvas.getContext('2d');
          const canvasBackground = await Canvas.loadImage(backgroundPath);
          ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);



          // Apply text based on colour needed, after fetching from JSON
          let backgroundColors = BackgroundInfo[`${backgroundValue}`]["colors"];

          // DISPLAY NAME
          ctx.font = applyText(canvas, message.member.displayName, ctx);
          ctx.fillStyle = backgroundColors["username"];
          ctx.fillText(message.member.displayName, canvas.width / 2.3, canvas.height / 2.2);

          // LEVELS
          ctx.font = "28px sans-serif";
          ctx.fillStyle = backgroundColors["level"];
          ctx.fillText(`Level`, canvas.width / 2.3, canvas.height / 1.45);

          // XP
          ctx.font = "28px sans-serif";
          ctx.fillStyle = backgroundColors["xp"];
          ctx.fillText(`XP`, canvas.width / 1.35, canvas.height / 1.45);

          // PROGRESS BAR (thanks to canvas-extras)
          // https://www.npmjs.com/package/canvas-extras
          ctx.beginPath();
          ctx.progressBar(50, 100, canvas.width / 2.4, canvas.height / 1.4, 350, 40, backgroundColors["progressBarFill"], backgroundColors["progressBarEmpty"]);
          ctx.closePath();


          



          


          // User Profile Picture
          ctx.strokeStyle = '#74037b';
          ctx.strokeRect(0, 0, canvas.width, canvas.height);

          ctx.beginPath();
          ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'png' }));
          ctx.drawImage(avatar, 25, 25, 200, 200);

          // Output!
          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank_background_${backgroundValue}_preview.png`);
          return await client.throttleCheck(message.channel, `Here's your preview of the **${backgroundValue}** Rank Background!`, message.author.id, attachment);

    }
}