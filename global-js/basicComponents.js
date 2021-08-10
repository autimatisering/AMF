// Martin
// 22/03/2021
// basic tools to simplify working with the framework

/// gets the first element with the given class within the given scope
/// params: scope - the DOM element wherein to look for the classname
///         classname - name of the class to look for
/// return: first DOM element found with the specified class
function getFirstClass(scope, className) {
    return scope.getElementsByClassName(className)[0]
}

/// create a new DOM Element based on a few parameters
/// params: tagname - string, name of the tag (i.e. "div", "p", "h1")
///         attributes - object describing the attributes, formatted as { <attribute name>:<attribute value>, ...}
/// return: new DOM element
function elementFromObject(tagName, attributes={}, children = []) {
    let newElement = document.createElement(tagName)
    for (const key in attributes) {
        if (attributes[key] != undefined) // important to check for undefined, just checking for falsy is not good enough
            newElement.setAttribute(key, attributes[key])
    }

    children.forEach(child => {
        newElement.append(child)
    });

    return newElement
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

// Simplify parsing json by avoiding having to add a try/catch block every time
function tryParseJson(input) {
    try {
        return JSON.parse(input)
    }
    catch
    {
        console.error("Invalid JSON")
        return undefined
    }
}

var globalStorage = {
    availableThemes: ["Dark", "Light"],
    loadedTheme: "Dark",
    availableOrganisations: {},
    currentOrganisation: 1,
}
