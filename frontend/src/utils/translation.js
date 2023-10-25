function secondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return {hours, minutes};
}

function translateTime(time1, time2 = 0, time3 = 0) {
    time = time1;
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

module.exports = {
    translateTime,
    translateDifficulty,
    translateCost
}