const moment = require('moment')
const request = require('request')
const Discord = require('discord.js')
const config = require('../config.json')

const execute = (fullArgs,message) => {
    moment.locale("FR_fr");
    
    const type = fullArgs.split(' ').filter((val) => val !== '')[0];

    const user = fullArgs.split(' ').filter((val) => val !== '').slice(1).join(' ');

    const options = {
        method: "GET",
        url: `https://fortnite.y3n.co/v2/player/${user}`,
        headers: {
            'User-Agent': 'nodejs request',
            'X-Key': config.fortnite_key
        }
    }
    
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const stats = JSON.parse(body);

            switch (type) {
                case 'pc':
                    return results(message,stats.br.stats.pc,stats);
                    break;
                case 'xbox':
                    return results(message,stats.br.stats.xbox,stats);
                    break;
                case 'ps4':
                    return results(message,stats.br.stats.ps4,stats);
                    break;
                default:
                    message.channel.send(`:no_entry_sign: | Veuillez utiliser la commande comme ceci : \`/fortnite <pc|xbox|ps4> <Pseudo>\``);
            }
        } else {
            message.channel.send(`:no_entry_sign: | Le pseudo ${user} n'existe pas !`)
        }
    })
}

const results = (message,type,stats) => {
    const embed = new Discord.RichEmbed()
    .setAuthor(`Statistiques fortnite de ${stats.displayName}`, message.author.displayAvatarURL)
    .setDescription(`Voici les statistiques du joueur ${stats.displayName} sur le jeu [fortnite](https://www.epicgames.com/fortnite/fr/home).`)
    .setColor(0xcd6e57)
    .addField("Victoires Solo", type.solo.wins, true)
    .addField("Victoires Duo", type.duo.wins, true)
    .addField("Victoires Section", type.squad.wins, true)
    .addField("Kills Solo", type.solo.kills, true)
    .addField("Kills Duo", type.duo.kills, true)
    .addField("Kills Section", type.squad.kills, true)
    .addField("Morts Solo", type.solo.deaths, true)
    .addField("Morts Duo", type.duo.deaths, true)
    .addField("Morts Section", type.squad.deaths, true)
    .addField("Temps de jeu Solo", (type.solo.minutesPlayed > 60 ? `${Math.trunc(type.solo.minutesPlayed/60)} heures` : `${type.solo.minutesPlayed} minutes`), true)
    .addField("Temps de jeu Duo", (type.duo.minutesPlayed > 60 ? `${Math.trunc(type.duo.minutesPlayed/60)} heures` : `${type.duo.minutesPlayed} minutes`), true)
    .addField("Temps de jeu Section", (type.squad.minutesPlayed > 60 ? `${Math.trunc(type.squad.minutesPlayed/60)} heures` : `${type.squad.minutesPlayed} minutes`), true)
    .addField("Dernière partie Solo", moment(type.solo.lastMatch).fromNow(), true)
    .addField("Dernière partie Duo", moment(type.duo.lastMatch).fromNow(), true)
    .addField("Dernière partie Section", moment(type.squad.lastMatch).fromNow(), true)
    .setTimestamp(message.createdAt)
    .setFooter("DraftMan | Développeur FrontEnd & Graphiste", "https://www.draftman.fr/images/favicon.png")

    message.reply({embed})
}

module.exports.execute = execute;