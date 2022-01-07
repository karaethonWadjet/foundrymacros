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
        resolve_ability(boons, boosts, bonus);
	}
    }}).render(true);
//do attack
async function resolve_ability(boons,boosts,bonuses){
    let ability = args[0];
    let true_strike = false;
    let evaded = false;
    let missed = false;
    
    let actors = [];
    let attack_html = ``;
    let direct_damage = 0;
    for (let i = 0; i < controlled.length; i++) { //get player token as actors[0]
        actors.push(controlled[i].actor);
    }
    //fix true_strike if actor or ability has it
    if(ability.hasOwnProperty('attack')){
        true_strike = ability.attack.true_strike;
    }
    true_strike = true_strike || (actors[0].data.data.attributes.buffs.true_strike.value > 0); 
    //iterate over effects in attack effects and print them out
    if(ability.attack.attack_effects.length > 0){
        attack_html = await attack_effects(ability) + attack_html;
    } 
    if(ability.hasOwnProperty('attack')){ //If this has an attack portion carry it out
        //check true_strike, evasion
        evaded = await check_evasion(true_strike);
        if(evaded){//if evasion succeeds
            if(ability.damage.hasOwnProperty('on_miss')){
                direct_damage = ability.damage.on_miss;
            } else {
                direct_damage = ability.damage.on_auto_hit;
            }
            missed = true;
            attack_html += `<div style="text-align:center"><h3>Attack Roll: EVADED!</h3>`;
        } else if(ability.attack.attack_roll.localeCompare(`d20`)===0){//if the attack has to be rolled for 
            //Insert attack results into final html
            let val = await roll_attack(boons, actors[0], ability);
            attack_html += val[0]; 
            direct_damage = val[1];
            missed = (val[2].localeCompare(`MISS!`)===0); //true if attack missed
            console.log('attack hit comparison '+missed)
        } else { //the attack is an auto hit
            direct_damage = ability.damage.on_auto_hit;
            attack_html += `<div style="text-align:center"><h3>Attack Roll: AUTO HIT!</h3>`;
        }  
    }
    //check for and roll damage
    if(ability.hasOwnProperty('damage')){
        //check for dodge and true_strike
        if(missed & await check_dodge(true_strike)){
            attack_html += `<hr><h3>Damage Roll:</h3> DODGED!`;
        } else {
            attack_html += `<hr><h3>Damage Roll:</h3>` + await roll_damage(direct_damage, boosts, bonuses, actors[0]);
        }
    }
    //check for and roll area damage
    if(ability.hasOwnProperty('area_damage')){
        attack_html += `<hr><h3>Area Damage Roll:</h3>` + await roll_damage(ability.area_damage.damage, 0, 0, actors[0]);
    }
    ability_text(ability.ability_name, attack_html+`</div>`);
}
//attack roll function
async function roll_attack(boons, character, ability){
    let result_text = ``;
    let roll_suffix = ``;
    if(boons > 1) {
        roll_suffix = `+`+Math.min(boons,3)+`d6kh`;
    } else if (boons === 1) {
        roll_suffix = `+1d6`;
    } else if (boons < -1) {
        roll_suffix = `-`+Math.abs(Math.max(boons,-3))+`d6kh`;
    } else if (boons === -1) {
        roll_suffix = `-1d6`;
    }
    //prepare the roll
    let roll = await new Roll(`1d20+`+character.data.data.attributes.attack.value+roll_suffix).roll({async:true});
    let [mark] = tar; //get the target
    let def = mark.actor.data.data.attributes.defense.value; //get target's defense
    //analyze attack result to figure out damage     
    if(roll.total >= 20){
        result_text = `CRITICAL HIT!`;
    } else if(roll.total >= def){
        result_text = `HIT!`;
    } else {
        result_text = `MISS!`;
    };
    let direct_damage = 0;
    if(ability.hasOwnProperty('damage')){
        switch(result_text){
            case `CRITICAL HIT!`:
                direct_damage = ability.damage.on_crit;
            break;
            case `HIT!`:
                direct_damage = ability.damage.on_hit;
            break;
            default: //miss
                direct_damage = ability.damage.on_miss;
        }
    }
    //Insert attack results into final html
    return [`<div style="text-align:center"><h3>Attack Roll: `+result_text+`</h3>`+await roll.render(), direct_damage, result_text];
}
//used to roll damage
async function roll_damage(damage, boosts, bonuses, character){    
    let rollterm = 0;
    if(damage < 0){ //flat damage
        return `<div style="text-align:center">`+(-1 * damage);
    } else if (damage == 0){ //fray damage
        return `<div style="text-align:center">`+character.data.data.attributes.fray.value; 
    } else { //regular damage calculation
        if(bonuses > 0 || damage+boosts > 3){
            rollterm = damage+boosts+bonuses+'d'+character.data.data.attributes.damage.value+'k'+Math.min(damage+boosts, 3)+'+'+character.data.data.attributes.damage_bonus.value;
        } else {
            rollterm = damage+boosts+bonuses+'d'+character.data.data.attributes.damage.value+'+'+character.data.data.attributes.damage_bonus.value;
        }
    }
    //roll the damage
    let roll = await new Roll(rollterm).roll({async:true});
	let damage_result = await roll.render();
	return damage_result;
}
//used to collect effects text
async function attack_effects(ability){
    let val = ability.attack.attack_effects[0];
    let attack_effects_html = ``;
    for(let i = 0; i < ability.attack.attack_effects.length; i++){
        attack_effects_html += ability.attack.attack_effects[i].effect_text;
        if(i != ability.attack.attack_effects.length-1){
            attack_effects_html+=`<br>`
        }
    }
    attack_effects_html += `<hr>` // add horizontal line to divide effect from rolls
    return attack_effects_html;
}
//used to display final html
async function ability_text(title, text){
    ChatMessage.create({
        user: game.user._id,
        flavor: `<h2 style="text-align:center"><img src="`+ability.imagepath+`"  width="50" height="50"></img>`+title+`</h2>`,
        speaker: ChatMessage.getSpeaker({token: actor}),
        content: text
    });
}
//checks for evasion-true strike
async function check_evasion(true_strike){
    let target = await get_target();
    if(target.actor.data.data.attributes.buffs.evasion.value > 0 & !true_strike){
        let evasion_roll = await new Roll('1d6').roll({async:true});
        if(evasion_roll.total >= 4){
            return true;
        }
    } 
    return false;
}
//checks for dodge-truestrike
async function check_dodge(true_strike){
    let target = await get_target();
    return (target.actor.data.data.attributes.buffs.dodge.value > 0 & !true_strike);
}
async function get_target(){
    let [ans] = game.user.targets;
    return ans;
}