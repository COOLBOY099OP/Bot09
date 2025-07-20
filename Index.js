const mineflayer = require('mineflayer');
const express = require('express');

let bot;

function createBot() {
    bot = mineflayer.createBot({
        host: 'dtyagi-lol10110.aternos.me:40234', // Aternos server IP
        port: 40234,
        username: 'Bot_' + Math.floor(Math.random() * 1000),
        version: false
    });

    bot.on('login', () => {
        console.log("Bot logged in!");

        setTimeout(() => {
            bot.chat('/register 123456 123456');
            bot.chat('/login 123456');
        }, 3000);

        startRandomMovement(bot);
    });

    bot.on('end', () => {
        console.log("Bot disconnected! Reconnecting...");
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => {
        console.log("Error: ", err);
    });
}

function startRandomMovement(bot) {
    const movements = ['forward', 'back', 'left', 'right'];

    setInterval(() => {
        const action = movements[Math.floor(Math.random() * movements.length)];
        bot.setControlState(action, true);
        setTimeout(() => bot.setControlState(action, false), 1000);
    }, 3000);
}

// Start the bot
createBot();


// Create Web Server
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    if (bot && bot.username) {
        res.send(`<h1>Bot Status</h1><p>Bot is running as <b>${bot.username}</b></p>`);
    } else {
        res.send('<h1>Bot Status</h1><p>Bot is not connected.</p>');
    }
});

app.get('/say/:message', (req, res) => {
    const msg = req.params.message;
    if (bot) {
        bot.chat(msg);
        res.send(`Sent message: ${msg}`);
    } else {
        res.send('Bot not connected.');
    }
});

app.listen(PORT, () => {
    console.log(`Web server is running at http://localhost:${PORT}`);
});
