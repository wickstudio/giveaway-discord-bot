# Discord Giveaway Bot

## Description
This Discord bot is designed to manage and conduct giveaways in Discord servers. It empowers users to set up giveaways, participate in them, and automatically selects winners at the end of the giveaway period.

## Features
- **Setup Giveaways**: Users can easily configure giveaways with custom durations, prize descriptions, and the number of winners.
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
     "guildId": "YOUR_GUILD_ID",
     "saveCommandRoleId": "YOUR_ROLE_ID"
   }
   ```
   Replace `YOUR_BOT_TOKEN`, `YOUR_CLIENT_ID`, `YOUR_GUILD_ID`, and `YOUR_ROLE_ID` with your Discord bot token, client ID, server (guild) ID, and the role ID that can use setup and save commands.

## Usage
1. **Start the Bot**: Run `start.bat` to initiate the bot.
2. **Bot Commands**:
   - `/setup`: Launches a modal to set up a new giveaway.
   - `/give`: Displays a list of users who joined the giveaway (Requires the specified role permission).

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/wickstudio/giveaway-discord-bot/issues) if you want to contribute or join our [Discord Server](https://discord.gg/wicks).

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
This bot was created using the [discord.js](https://discord.js.org/) library.

## Contact

- Email: info@wickdev.xyz
- Website: [Wick Dev](https://wickdev.xyz)
- Discord: [Wick Studio Discord](https://discord.gg/wicks)
- Youtube: [Wick Studio YouTube](https://www.youtube.com/@wick_studio)
