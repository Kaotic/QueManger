let mcIntervals = {};

function removeElement(type, name) {
    const elementFunctions = {
        'class': 'getElementsByClassName',
        'id': 'getElementById',
        'name': 'getElementsByName'
    };

    if (mcIntervals.hasOwnProperty(name)) {
        clearInterval(mcIntervals[name]);
    }

    mcIntervals[name] = setInterval(function() {
        let elements;

        if (type === 'id') {
            elements = [document[elementFunctions[type]](name)];
        } else {
            elements = Array.from(document[elementFunctions[type]](name));
        }

        for (let i = 0; i < Math.min(7, elements.length); i++) {
            try {
                elements[i].remove();
            } catch (e) {
                // Handle the error if needed
            }
        }
    }, 1000);
}

removeElement('class', 'oldPlaceholder-18-05-08-22');
removeElement('class', 'fInPwI');
removeElement('class', 'fCMJIY');
removeElement('class', 'fswIvP');