const { Client, Intents, Modal, TextInputComponent, MessageActionRow, MessageEmbed, MessageButton, Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { slash } = require('@discordjs/builders');
const ms = require('ms');
const config = require('./config.json');

const token = config.token;
const clientId = config.clientId;
const guildId = config.guildId;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commands = [
    {
        options: [],
        name: 'setup',
        name_localizations: undefined,
        description: 'عمل جيف اواي',
        description_localizations: undefined,
        default_permission: undefined,
        default_member_permissions: '8',
        dm_permission: undefined,
        nsfw: undefined
    }
];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();

let giveaways = [];
let captchaChallenges = {};

function generateCaptcha() {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function startGiveaway(interaction, time, winnersCount, prize, description) {
    const endTime = Date.now() + ms(time);
    const giveaway = {
        endTime,
        winnersCount,
        prize,
        description,
        participants: new Set(),
        channelId: interaction.channelId,
        messageId: null,
        updateInterval: null
    };

    giveaways.push(giveaway);

    setTimeout(() => endGiveaway(giveaway), endTime - Date.now());

    giveaway.updateInterval = setInterval(() => updateGiveawayMessage(giveaway), 60000);

    return giveaway;
}

function updateGiveawayMessage(giveaway, ended = false) {
    const remainingTime = parseInt(parseInt(giveaway.endTime) / 1000);

    client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
        .then(message => {
            const originalEmbed = message.embeds[0];

            const updatedEmbed = new MessageEmbed()
                .setColor('#00C7FF')
                .setTitle('🎉 جيف اواي جديد! 🎉')
                .addFields(
                    { name: 'السلعة', value: `🏆 **${giveaway.prize}**`, inline: true },
                    { name: 'الفائزين', value: `👥 ${giveaway.winnersCount}`, inline: true },
                    {
                        name: 'ينتهي بعد', value: `⏳ ${ended ? '`منتهي`' : `<t:${remainingTime}:R>`}

                    `, inline: true
                    }, {
                    name: 'المشاركين', value: `👤 **${giveaway.participants.size}**`, inline: false
                }
                )
                .setFooter({ text: originalEmbed.footer.text })
                .setTimestamp()
                .setThumbnail(originalEmbed.thumbnail.url)

            message.edit({ embeds: [updatedEmbed] });
        })
        .catch(console.error);
}

function endGiveaway(giveaway) {
    clearInterval(giveaway.updateInterval);
    updateGiveawayMessage(giveaway, true)
    if (giveaway.participants.size === 0) {
        client.channels.cache.get(giveaway.channelId).send('لا يوجد مشاركين في الجيف اواي. لم يتم اختيار الفائزين.');
        return;
    }

    const winners = Array.from(giveaway.participants)
        .sort(() => 0.5 - Math.random())
        .slice(0, giveaway.winnersCount)
        .map(userId => `<@${userId}>`);

    const winnersText = winners.join(', ');
    const prizeText = giveaway.prize ? `**${giveaway.prize}**` : 'the prize';
    const announcement = `🎉 انتهى الجيف اواي! مبروك للفائزين: ${winnersText}! لقد فازو ب ${prizeText}! 🎉`;

    client.channels.cache.get(giveaway.channelId).send(announcement);
}

function msToTime(duration) {
    let minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return hours + "h " + minutes + "m";
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'setup') {
        const modal = new Modal()
            .setCustomId('giveawaySetup')
            .setTitle('لوحة جيف اواي');

        const timeInput = new TextInputComponent()
            .setCustomId('time')
            .setLabel("الوقت للجيف اواي (e.g., '10m', '1h')")
            .setStyle('SHORT');

        const winnersInput = new TextInputComponent()
            .setCustomId('winners')
            .setLabel('عدد الفائزين')
            .setStyle('SHORT');

        const prizeInput = new TextInputComponent()
            .setCustomId('prize')
            .setLabel('السلعة')
            .setStyle('SHORT');

        const descriptionInput = new TextInputComponent()
            .setCustomId('description')
            .setLabel('وصف الجيف اواي')
            .setStyle('PARAGRAPH');

        const firstActionRow = new MessageActionRow().addComponents(timeInput);
        const secondActionRow = new MessageActionRow().addComponents(winnersInput);
        const thirdActionRow = new MessageActionRow().addComponents(prizeInput);
        const fourthActionRow = new MessageActionRow().addComponents(descriptionInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'giveawaySetup') {
        await interaction.deferReply({ ephemeral: true });

        const time = interaction.fields.getTextInputValue('time');
        const winnersCount = parseInt(interaction.fields.getTextInputValue('winners'), 10);
        const prize = interaction.fields.getTextInputValue('prize');
        const description = interaction.fields.getTextInputValue('description');

        const giveaway = startGiveaway(interaction, time, winnersCount, prize, description);

        const embed = new MessageEmbed()
            .setColor('#00C7FF')
            .setTitle('🎉 جيف اواي جديد! 🎉')
            .setDescription(`**${description}**`)
            .addField('السلعة', `🏆 **${prize}**`, true)
            .addField('عدد الفائزين', `👥 ${winnersCount}`, true)
            .addField('ينتهي بعد', `⏳ ${msToTime(ms(time))}`, true)
            .setFooter('اضغط على 🎉 للدخول!')
            .setTimestamp()
            .setThumbnail('https://media.discordapp.net/attachments/1178000797825503352/1178501200769974373/logo_1.png?ex=65765fc5&is=6563eac5&hm=6cb5054b570777c3e458f8ccf384421a44a97aca2fc8414d26b4f5e31fd9ab54&=&format=webp&width=738&height=675') // Optional: URL to a relevant image such as a prize image

        const joinButton = new MessageButton()
            .setCustomId(`joinGiveaway_${giveaway.endTime}`)
            .setLabel('الانضمام')
            .setStyle('PRIMARY')
            .setEmoji('🎉');

        const row = new MessageActionRow()
            .addComponents(joinButton);

        interaction.channel.send({ embeds: [embed], components: [row] }).then(sentMessage => {
            giveaway.messageId = sentMessage.id;
            updateGiveawayMessage(giveaway);
        });

        await interaction.followUp({ content: 'تم الانتهاء من العملية!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('joinGiveaway')) {
        const giveawayId = interaction.message.id;
        const giveaway = giveaways.find(g => g.endTime > Date.now() && g.messageId === giveawayId);

        if (giveaway) {
            const captcha = generateCaptcha();
            captchaChallenges[interaction.user.id] = { captcha, giveawayId };

            const captchaModal = new Modal()
                .setCustomId('captchaModal')
                .setTitle(`كود الكابتشا  : ${captcha}`);

            const captchaInput = new TextInputComponent()
                .setCustomId('captchaInput')
                .setLabel('اكتب كود الكابتشا تحت')
                .setPlaceholder('Captcha Code')
                .setStyle('SHORT');

            const actionRow = new MessageActionRow().addComponents(captchaInput);

            captchaModal.addComponents(actionRow);

            await interaction.showModal(captchaModal);
        } else {
            console.log('Giveaway not found or ended');
            await interaction.reply({ content: 'هذا الجيف اواي منتهي.', ephemeral: true });
        }
    }

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'captchaModal') {
        const captchaInput = interaction.fields.getTextInputValue('captchaInput');
        const userId = interaction.user.id;
        const captchaInfo = captchaChallenges[userId];

        if (captchaInfo && captchaInput === captchaInfo.captcha) {
            console.log('Correct CAPTCHA entered');
            const giveaway = giveaways.find(g => g.endTime > Date.now() && g.messageId === captchaInfo.giveawayId);

            if (giveaway) {
                giveaway.participants.add(userId);
                interaction.reply({ content: 'لقد انضميت لهذا الجيف اواي!', ephemeral: true });
                updateGiveawayMessage(giveaway);
            } else {
                console.log('Valid giveaway not found during CAPTCHA validation');
                interaction.reply({ content: 'هذا الجيف اواي منتهي او غير متوفر!', ephemeral: true });
            }
        } else {
            console.log('Incorrect CAPTCHA entered');
            interaction.reply({ content: 'لقد كتبت كود الكابتشا خطا, اعد المحاولة!', ephemeral: true });
        }
        delete captchaChallenges[userId];
    }
});

client.once('ready', () => {
    console.log(`Bot is ready ${client.user.tag}!`);
    console.log(`Code by Wick Studio`);
    console.log(`discord.gg/wicks`);
});

client.login(token);