const request = require("request-promise");
const Discord = require("discord.js");

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
			color: 3846809,
			description: "[Binance community vote](https://www.binance.com/vote.html) - top 5",
			fields: toFields(voteOptions, totalVotes)
		}});
	}
});

function toFields(voteOptions, totalVotes) {
	const emojis = [":one:", ":two:", ":three:", ":four:", ":five:"];
	return voteOptions.map((v, idx) => {
		const percentage = (v.voteNumber / totalVotes) * 100;
		return {
			name: `${emojis[idx]} ${v.optionName}`,
			value: `${v.voteNumber} (${percentage.toFixed(2)}%)`,
			inline: false
		};
	});
}

console.log(process.env);

client.login(process.env.TOKEN);