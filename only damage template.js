// for abilities that do damage without an attack roll
//preliminary check for token and target selected
const controlled = canvas.tokens.controlled;
if (controlled.length <= 0){
	new Dialog({
		title: "Hold up",
		content: `You don't have your token selected!`,
		buttons: {
			oops: {
				icon: '<i class="fas fa-frown"></i>',
				label: "Oops..."
			}
		}
	}).render(true);
	return;
}

let direct_dmg = token[0];
let area = token[1];
let area_dmg = token[2];
let effect = token[3];
let name = token[4];

//do dialog to get boosts and bonus
let optionsText2 = "";
for(i = 0; i < 11; i++){
    optionsText2 += `<option value="${i}">${i} Dice</option>`;
}
let optionsText3 = "";
for(i = 0; i < 11; i++){
    optionsText3 += `<option value="${i}">${i} Boost(s)</option>`;
}
let confirmed = false;
new Dialog({
    title: "Damage Modifiers",
    content: `
        <form id="attack-form"> <div class="form-group"> <label>Bonus Damage</label> <div class="form-fields">
        <select name="bonus-dmg">` + optionsText2 + `</select>
        </div> </div> </form>
        <form id="attack-form"> <div class="form-group"> <label>Damage Boosts</label> <div class="form-fields">
        <select name="boost-dmg">` + optionsText3 + `</select>
        </div> </div> </form>
    `,
    buttons: {
        one: {
        icon: '<i class="fas fa-dice"></i>',
        label: "Roll Damage!",
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
        let bonus = parseInt(html.find('[name=bonus-dmg]')[0].value);
        let boosts = parseInt(html.find('[name=boost-dmg]')[0].value);
        damage_roll(boosts, bonus);}
    }}).render(true);
//do attack
async function damage_roll(boosts,bonus){
	if(!(effect.localeCompare(``)===0)){
        ChatMessage.create({
            user: game.user._id,
            flavor: name,
            speaker: ChatMessage.getSpeaker({token:actor}),
            content: effect
        });
	}
	//game.macros.getName('ability-flavor').execute({token: [name, effect]});
    console.log(`ability-template: boosts: `+boosts+` bonus: `+bonus);
    //do damage
    game.macros.getName('ability-damage').execute({token: [result,hit,miss,crit,boosts,bonus,0]});
    if(!(area.localeCompare(``)===0)){
        //do area effect damage
        game.macros.getName('ability-damage').execute({token: [result,area_dam,area_dam,area_dam,0,0,1]});
    }
}