let flavor = token;
let title = flavor[0];
let effects = flavor[1];
ChatMessage.create({
	user: game.user._id,
	flavor: `<h2 style="text-align:center">`+title+`</h2>`,
	speaker: ChatMessage.getSpeaker({token: actor}),
	content: effects
});