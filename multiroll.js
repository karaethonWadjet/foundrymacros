// example of a chat message containing more than one die roll
const controlled = canvas.tokens.controlled;
if (controlled.length > 0) {
    let actors = [];
    for (let i = 0; i < controlled.length; i++) {
        actors.push(controlled[i].actor);
        }
 
    let r = await new Roll("1d20").roll({async:true});
	let r2 = await new Roll("1d6").roll({async:true});
	let result_html = `<p style="text-align:center">Direct Damage</p>`;
	result_html += await r.render();
	result_html += `<p style="text-align:center">Area Damage</p>`
	result_html += await r2.render();
	
    await r.toMessage({
        speaker: ChatMessage.getSpeaker({token:actor}),
        flavor: `<h2 style="text-align:center"><img src="Character_Images/Macro%20Icons/explosion-lava-stone-green.webp" width="50" height="50"><br></img>Multi-Dice Madness!</h2>`,
        content: result_html
    });
}