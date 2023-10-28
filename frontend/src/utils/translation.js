function secondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return {hours, minutes};
}

function translateTime(time1, time2 = 0, time3 = 0) {
    let time = time1;
    time += time2;
    time += time3;

    const {hours, minutes} = secondsToHoursAndMinutes(time);

    if(hours < 1 && minutes > 0) {
        return `${minutes}min`;
    }

    return `${hours}h${minutes}`;
}

function translateDifficulty(name) {
    switch(name){
        case 'easy':
            return 'Facile';
        case 'medium':
            return 'Moyen';
        case 'hard':
            return 'Difficile';
    }

    return name;
}

function translateCost(name) {
    switch(name) {
        case 'low':
            return 'Bon marché';
        case 'medium':
            return 'Moyen';
        case 'high':
            return 'Assez cher';
    }
}

function translateIngredient(name, quantity, unit_name) {
    let translation = name;

    if (quantity) {
        translation += ` (${unit_name ? '' : 'x'}${quantity}${unit_name ? ' ' + unit_name : ''})`;
    }

    return translation;
}

function translateIngredientComplement(complement) {
    if (!complement) {
        return '';
    }

    if (complement.startsWith('(') && complement.endsWith(')')) {
        complement = complement.substring(1, complement.length - 1);
    }

    if (complement.startsWith('"') && complement.endsWith('"')) {
        complement = complement.substring(1, complement.length - 1);
    }

    return complement;
}

module.exports = {
    translateTime,
    translateDifficulty,
    translateCost,
    translateIngredient,
    translateIngredientComplement
}