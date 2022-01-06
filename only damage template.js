// for abilities that do damage without needing an attack roll
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
async function damage_roll(boosts,bonus){
	let dmg_html = effect + ``;
	if(!(effect.localeCompare(``)===0)){
		dmg_html += `<hr>`; // add horizontal line to divide effect from rolls
	}
    //do damage
    dmg_html += `<div style="text-align:center">`+await game.macros.getName('ability-damage').execute({token: [direct_dmg,boosts,bonus,0]});
    if(!(area.localeCompare(``)===0)){
        //do area effect damage
        dmg_html += `<hr>` + await game.macros.getName('ability-damage').execute({token: [area_dmg,0,0,1]});
    }
	game.macros.getName('ability-text').execute({token: [name, dmg_html+`</div`]});
}