const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');


module.exports = {
    name: 'rank',
    description: 'Shows you your current XP total and Level',
    usage: ' ',
    aliases: ['xp', 'level'],
    //args: true,
    commandType: 'level',
    //cooldown: 3, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {


      // Fetch Database
      let userRankPref = await Tables.UserPrefs.findOrCreate(
        {
          where: {
            userID: message.author.id
          }
        }
      ).catch(async err => {
        return await Error.LogToUser(message.channel, `I was unable to fetch your Preferences. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
      });

      userRankPref = userRankPref[0].dataValues.rankBackground;


      let currentXP = await XPs.FetchXP(message);
      let currentLevel = await Levels.FetchLevel(currentXP);

      








      if ( userRankPref === `disable` ) {
        return await message.reply(`\n> You currently have **${currentXP}** XP, and are Level **${currentLevel}**!`);
      }
      else {

        let standardBackgrounds = [];
        let prideBackgrounds = [];

        let standardBGs = fs.readdirSync('./backgrounds/standard').filter(file => file.endsWith('.png'));
        for ( const file of standardBGs ) {

          // Add to Array
          let tempSTRING = file.toString();
          let tempSTRINGLength = tempSTRING.length;
          tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);
      
          standardBackgrounds.push(tempSTRING);

        }

        let prideBGs = fs.readdirSync('./backgrounds/pride').filter(file => file.endsWith('.png'));
        for ( const file of prideBGs ) {

          // Add to Array
          let tempSTRING = file.toString();
          let tempSTRINGLength = tempSTRING.length;
          tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);
      
          prideBackgrounds.push(tempSTRING);

        }




        // Generate Background
        // Arrays so Bot knows if the Text Colour needs changing or not
        // ANY backgrounds not listed in these will use the full default white font colour
        let darkenAllFont = [
          'pastel', 'agender', 'aromantic', 'demiromantic', 'pansexual', 'transgender', 'rainbow', 'gay', 'lesbian'
        ];
        let darkenJustUsername = [
          'genderfluid', 'nonBinary', 'straightAlly'
        ];
        let darkenJustLevels = [
          'asexual'
        ];



        let backgroundPath;
        if ( standardBackgrounds.includes(userRankPref) ) {
          backgroundPath = `./backgrounds/standard/${userRankPref}.png`;
        }
        else if ( prideBackgrounds.includes(userRankPref) ) {
          backgroundPath = `./backgrounds/pride/${userRankPref}.png`;
        }





        // CANVAS
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const canvasBackground = await Canvas.loadImage(backgroundPath);
        ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);

        // Apply Text
        const applyText = (canvas, text) => {

          // Base Font Size
          let fontSize = 70;

          do {
            // Change font size based on String Length
            ctx.font = `${fontSize -= 10}px sans-serif`;
          } while ( ctx.measureText(text).width > canvas.width - 300 );

          // Return new result
          return ctx.font;

        };


        // Apply text based on colour needed
        if ( darkenAllFont.includes(userRankPref) ) {

          // DISPLAY NAME
          ctx.font = applyText(canvas, message.member.displayName);
          ctx.fillStyle = '#000000';
          ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 2.6);

          // XPs
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.3);

          // LEVELS
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 1.6);

        }
        else if ( darkenJustUsername.includes(userRankPref) ) {

          // DISPLAY NAME
          ctx.font = applyText(canvas, message.member.displayName);
          ctx.fillStyle = '#000000';
          ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 2.6);

          // XPs
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.3);

          // LEVELS
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 1.6);

        }
        else if ( darkenJustLevels.includes(userRankPref) ) {

          // DISPLAY NAME
          ctx.font = applyText(canvas, message.member.displayName);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 2.6);

          // XPs
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.3);

          // LEVELS
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 1.6);

        }
        else {

          // DISPLAY NAME
          ctx.font = applyText(canvas, message.member.displayName);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 2.6);

          // XPs
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.3);

          // LEVELS
          ctx.font = '28px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 1.6);

        }


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
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank.png`);
        return await message.channel.send(``, attachment);

      }



      //END OF COMMAND
    },
};
