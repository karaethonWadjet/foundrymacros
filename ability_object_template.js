//TEMPLATE: Example used here is Spellblade Ability: Levinblade
const ability = {
    imagepath: `images/whatever/levinblade.jpg`,
    attack: {
        attack_type: `melee`-`ranged`,
        attack_roll: `d20`-`auto hit`,
        attack_effects: [
            {   //example effect 1
                effect_type: `target`, // `target` - `area` - `terrain`
                effect_text: `Teleport 1 before or after the attack` // rules text or flavor text
            },
            {   //example effect 2
                effect_type: `target`,
                status_effect: {
                    status: `electrified`,
                    save: false,
                    already_effect: {
                        type: `bonus`, //`bonus` - `boost` - `text`
                        specific: `damage` //only relevant if type is `text`
                    }
                }
            },
            {   //example effect 3
                effect_type: `terrain`,
                effect_text: `The attack area becomes difficult terrain for the rest of combat, or until you create terrain with this ability again.`
            }
        ],
        true_strike: false
    },
    damage: {
        on_miss: 1, //number of dice rolled, 0 indicates fray damage, -1 indicates 1 damage
        on_hit: 2,
        on_crit: 3,
        godly: false,
        piercing: false
    },
    area_damage: {
        area_type: `Arc 3`,
        damage: 1,
        godly: false,
        piercing: false
    }
};
game.macros.getName('ability_execute').execute(ability);
