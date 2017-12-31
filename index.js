const request = require("request-promise");
const Discord = require("discord.js");
const settings = require("./settings.json");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Online");
});

const reqOptions = {
	uri: "https://www.binance.com/vote/getVote.html",
	json: true
};

client.on("message", async message => {
	if (message.content === "!votes") {
		let reply = await message.channel.send("Getting vote standings...");
		const res = await request(reqOptions);
		let voteOptions = res.voteList[0].optionList;
		voteOptions = voteOptions.sort((a, b) => {
			return b.voteNumber - a.voteNumber;
		}).slice(0, 5);
		reply.edit({ embed: {
			description: "Binance community vote - top 5\nGo [here](https://www.binance.com/vote.html) to vote.",
			fields: toFields(voteOptions)
		}});
	}
});

function toFields(voteOptions) {
	return voteOptions.map(v => {
		return {
			name: v.optionName,
			value: v.voteNumber,
			inline: false
		};
	});
}

client.login(settings.token);