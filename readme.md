# Discord Giveaway Bot

## Description
This Discord bot is made to manage and conduct giveaways in Discord servers. It allows users to set up giveaways, join them, and automatically selects winners at the end of the giveaway period.

## Features
- **Setup Giveaways**: Users can set up giveaways with custom durations, prize descriptions, and the number of winners.
- **Join Giveaways**: Participants can join giveaways through a simple button click.
- **Automatic Winner Selection**: The bot randomly selects the specified number of winners when the giveaway ends.
- **Captcha Verification**: To prevent bot entries, a captcha system is in place for users joining a giveaway.

## Installation
1. **Clone the Repository**: Clone this repository to your local machine or download the source code.
2. **Install Dependencies**: Run `install.bat` to install the necessary packages.
3. **Configuration**: Create a `config.json` file in the root directory with the following structure:
   ```json
   {
     "token": "YOUR_BOT_TOKEN",
     "clientId": "YOUR_CLIENT_ID",
     "guildId": "YOUR_GUILD_ID"
   }
   ```
   Replace `YOUR_BOT_TOKEN`, `YOUR_CLIENT_ID`, and `YOUR_GUILD_ID` with your Discord bot token, client ID, and server (guild) ID, respectively.

## Usage
1. **Start the Bot**: Run `start.bat` to start the bot.
2. **Bot Commands**:
   - `/setup`: Launches a modal to set up a new giveaway.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page]([link-to-your-issues-page](https://github.com/wickstudio/giveaway-discord-bot/issues)) if you want to contribute. or join [Discord Server](https://discord.gg/wicks)

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
This bot was created using the [discord.js](https://discord.js.org/) library.

## Contact

- Email : wick@wick-studio.com

- Website : https://wickdev.xyz

- Discord : https://discord.gg/wicks

- Youtube : https://www.youtube.com/@wick_studio