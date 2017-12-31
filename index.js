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
		const totalVotes = res.voteList[0].voteCount;

		let voteOptions = res.voteList[0].optionList;
		voteOptions = voteOptions.sort((a, b) => {
			return b.voteNumber - a.voteNumber;
		}).slice(0, 5);
		reply.edit({ embed: {
			description: "Binance community vote - top 5\nGo [here](https://www.binance.com/vote.html) to vote.",
			fields: toFields(voteOptions, totalVotes)
		}});
	}
});

function toFields(voteOptions, totalVotes) {
	return voteOptions.map(v => {
		const percentage = (v.voteNumber / totalVotes) * 100;
		return {
			name: v.optionName,
			value: `${v.voteNumber} (${percentage.toFixed(2)}%)`,
			inline: false
		};
	});
}

client.login(settings.token);