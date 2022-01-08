//GEOMANCER-BIO
const ability = {
	image_path: `https://i.ibb.co/HTwqRpN/explosion-lava-stone-green.webp`,
    ability_name: `BIO`,
	attack: {
		attack_type: `ranged`,
		attack_roll: `d20`,
		attack_effects: [
            {   //effect 1
                effect_text: `<b>Effect:</b> Inflict poisoned on your attack target. If your target was already poisoned, deal bonus damage.`,
                effect_type: `condition`,
                effect_target: `target`,
                condition: {
                    criteria: `check poisoned function`, //check for condition as true against target
                    is_true: `bonus damage`, //add a bonus die to damage roll
                    is_false: `inflict poisoned on enemy` 
                    //game.macros.getName('inflict-status').execute(tar, `poisoned`)
                },
            },
        ],
        true_strike: false
    },
    damage: {
        on_miss: -1, //number of dice rolled, 0 indicates fray damage, -1 indicates 1 damage
        on_hit: 1,
        on_crit: 2,
        godly: false,
        piercing: false
    },
	area_damage: {
        area_type: `Cross 2, Range 6`,
		damage: 0,
		godly: false,
        piercing: false
	}
};
let confirmed = false;
game.macros.getName('ability_execute').execute(ability);
new Dialog({
	title: "Infuse 2: Salted Earth",
	content: `Attack area becomes difficult terrain for the rest of combat.`,
	buttons: {
		no: {
			icon: '<i class="fas fa-times"></i>',
			label: "nah",
			callback: () => confirmed = false
		},
		yes: {
			icon: '<i class="fas fa-dice"></i>',
			label: "DO IT",
			callback: () => confirmed = true
		}
	},
	default: "nah",
	close: html => {
		if(confirmed){
			game.macros.getName('terrain double').execute();
		}
	}	
}).render(true);
