const { Client, Intents } = require('discord.js');
const { token, bitweb_key } = require('./config.json');
const https = require('https');
const http = require("http");
const fetch = require("node-fetch");
const request = require("request")

// instantiate the client and declare intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

function giveRole(guild, member, roleName, interaction){
    // console.log(guild);
    // console.log(member);
    // console.log(roleName);

    //get the role ID
    var roleId = guild.roles.find(r => r.name === roleName);
    console.log(roleId);
}


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply(`Bot ping is: ${client.ws.ping} ms`);
    } else if (commandName === 'server') {
        client.users.fetch(interaction.guild.ownerId).then(function (data) {
            let user = data.username + "#" + data.discriminator;
            interaction.reply(`Server name: ${interaction.guild.name}\nOwner: ${user}\nTotal members: ${interaction.guild.memberCount}`);
        })
    } else if (commandName === 'roles'){
        const email = interaction.options.getString('email');
        var url = "https://api.bitweb.cc/?key="+bitweb_key+"&action=get_user&data="+email;
        let options = {json:true};

        request(url, options, (error, res, body) => {
            if (error) {
                return  console.log(error)
            }
            if (!error && res.statusCode == 200) {
                if(body.code == 200){
                    var roleName = body.data.plan_name;
                    var role = interaction.guild.roles.cache.find(r => r.name === roleName);
                    interaction.member.roles.add(role)
                    interaction.reply({content: 'Roles have been updated!',ephemeral: true})
                }else{
                    // console.log(404)
                    interaction.reply({content: 'Sorry this email is not registered on https://bitweb.cc',ephemeral: true})
                }
            }
        });
    }
});
// Login to Discord with your client's token
client.login(token);