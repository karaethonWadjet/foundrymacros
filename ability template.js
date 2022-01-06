// For abilities that require an attack roll
//preliminary check for token and target selected
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
let tar = game.user.targets;
if (tar.size <= 0){
	new Dialog({
		title: "Hold up",
		content: `You don't have an enemy token targeted!`,
		buttons: {
			oops: {
				icon: '<i class="fas fa-frown"></i>',
				label: "Oops..."
			}
		}
	}).render(true);
	return;
}
let hit = token[0];
let miss = token[1];
let crit = token[2];
let area = token[3];
let area_dmg = token[4];
let effect = token[5];
let name = token[6];
//do dialog to get boons, boosts and bonus
let optionsText1 = "";
optionsText1 += `<option value=0>Neutral</option>`;
let i = 3;
for (; i > 0; i--) {
    optionsText1 += `<option value="${i}">+${i} Boon</option>`;
}
for (i = -1; i > -4; i--) {
    optionsText1 += `<option value="${i}">${i} Curse</option>`;
}
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
    title: "Attack Roll & Damage Mods",
    content: `
        <form id="attack-form"> <div class="form-group"> <label>Boons or Curses</label> <div class="form-fields">
        <select name="boons-curses">` + optionsText1 + `</select>
        </div> </div> </form> 
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
        label: "Roll Attack!",
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
        let boons = parseInt(html.find('[name=boons-curses]')[0].value);
        let bonus = parseInt(html.find('[name=bonus-dmg]')[0].value);
        let boosts = parseInt(html.find('[name=boost-dmg]')[0].value);
        attack_roll(boons, boosts, bonus);
	}
    }}).render(true);
//do attack
async function attack_roll(boons,boosts,bonus){
    console.log(`ability-template: boons: `+boons+` boosts: `+boosts+` bonus: `+bonus);
	let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
        }
    let suffix = ``;
    if(boons>1){
        suffix = `+`+Math.min(boons,3)+`d6kh`;
    } else if (boons===1){
        suffix = `+1d6`;
    }
    let r = await new Roll(actors[0].data.data.attributes.attack.value+suffix).roll({async:true})
    let [mark] = tar;
    let def = mark.actor.data.data.attributes.defense.value;

    let result_text = '';
    let direct_dmg = 0;
    if(r.total >= 20){
        result_text = `CRITICAL HIT!`;
        direct_dmg = crit;
    } else if(r.total >= def){
        result_text = `HIT!`;
        direct_dmg = hit;
    } else {
        result_text = `MISS!`;
        direct_dmg = miss;
    };
	let atk_html = effect + ``; 
	if(!(effect.localeCompare(``)===0)){
		atk_html += `<hr>` // add horizontal line to divide effect from rolls
	}
	atk_html += `<div style="text-align:center">Attack Roll:`+await r.render()+`<h2>`+result_text+`</h2><hr>`
    //do damage
    atk_html += await game.macros.getName('ability-damage').execute({token: [direct_dmg,boosts,bonus,0]});
    if(!(area.localeCompare(``)===0)){
        //do area effect damage
        atk_html += `<hr>` + await game.macros.getName('ability-damage').execute({token: [area_dmg,0,0,1]});
    }
	game.macros.getName('ability-text').execute({token: [name, atk_html+`</div>`]});
}