// ICON Narrative Play Fortune Roll
const controlled = canvas.tokens.controlled;
if (controlled.length <= 0){
	new Dialog({
		title: "Hold up",
		content: `<h3>You don't have your token selected!</h3>`,
		buttons: {
			oops: {
				icon: '<i class="fas fa-frown"></i>',
				label: "Oops..."
			}
		}
	}).render(true);
	return;
}
const actionList = [
`ACTION`,
`Sneak`,
`Excel`,
`Survey`,
`Channel`,
`Charm`,
`Command`,
`Tinker`,
`Study`,
`Recall`,
`Traverse`,
`Smash`,
`Endure`,
`Skirmish`,
`Snipe`,
`Crush`
];
let actionsText = ``;
actionList.forEach(function(item){
	actionsText += `<option value="${item}">${item}</option>`
});
let optionsText = `<option value=0>0 [2d6kl]</option>`;
let i = 1;
for (; i < 10; i++) {
    optionsText += `<option value="${i}">${i}</option>`;
}
let confirmed = false;
let boonmod = "";
new Dialog({
    title: "FORTUNE Roll",
    content: `
			<form id="action-form"> <div class="form-group"> <label>Action</label> <div class="form-fields">
            <select name="action-type">` + actionsText + `</select>
            </div> </div> </form>
            <form id="fortune-form"> <div class="form-group"> <label># of Dice</label> <div class="form-fields">
            <select name="dice-number">` + optionsText + `</select>
            </div> </div> </form> `,
    buttons: {
        one: {
        icon: '<i class="fas fa-dice"></i>',
        label: "ROLL!!",
        callback: () => confirmed = true
    },
        two: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => confirmed = false
    }
},
default: "Cancel",
    close: html => {
    if(confirmed){
        let boonmod = parseInt(html.find('[name=dice-number]')[0].value);
		let act_type = html.find('[name=action-type]')[0].value;
        disp(boonmod, act_type);}
    }}).render(true); 

async function disp(boons){
	let rollterm = ``;
	if(boons === 0){
		rollterm = `2d6kl`;
	} else if (boons === 1){
		rollterm = `1d6`;
	} else {
		rollterm = boons+`d6kh`;
	}
	
	let r = new Roll(rollterm).roll({async:false});
	
	let result_html = ChatMessage.getSpeaker({token:actor})+`'s Fortune: `;

	switch(r.total){
		case 1:
		case 2:
		case 3:
			result_html += `Poor result or outcome`
		break;
		case 4:
		case 5:
			result_html += `Expected or average result or outcome`
		break;
		case 6:
			result_html += `Good result or outcome`
		break;
		default:
			result_html += `??`
	};

	await r.toMessage({
		flavor: `<h2 style="text-align:center">` + act_type + ` roll</h2>`,
		speaker: ChatMessage.getSpeaker({token:actor}),
		content: await r.render()+result_html,
	});
}