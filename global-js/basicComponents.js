// Martin
// 22/03/2021
// basic tools to simplify working with the framework

// disable the use of getElementById
document._GEBI = document.getElementById
document.getElementById = function () {
    throw("Modules are not allowed to use IDs, use classnames instead");
}


/// executes a request to the AMP API with
/// params: route - a partial url that specifies the route e.g. "auth/me"
///         requestType - the type of request e.g. "GET" or "POST"
///         args - the additional parameters/arguments passed with the request in object format
///         auth - set this to add an authorization header with the specified value
/// return: a promise that'll resolve with the requested data or reject if there was an issue executing the request
function xhrAPIRequest(route, requestType, args, auth) {
    requestType = requestType.toUpperCase()
    
    switch (requestType) {
        case 'GET':
        case 'HEAD':
            // if we are dealing with a GET or HEAD request, put the args within the URL
            route=`${route}?`
            for (const [key, value] of Object.entries(args)) {
                route=`${route}&${key}=${value}`
            }
            // clear the args so we don't needlessly add them in the body of the request
            args = undefined
            break;
        default:
            break;
    }

    return new Promise ((resolve, reject) => {
        var xhr = new XMLHttpRequest();                                 // create new XMLHttp request
        xhr.open(requestType, `http://127.0.0.1:1337/${route}`, true)   // open the specified route in async mode
        xhr.setRequestHeader('Content-Type', 'application/json');       // set the content type to json
        if (auth)                                                       // if we have an auth...
            xhr.setRequestHeader('authorization', auth);                // add an authorization header

        xhr.onreadystatechange = function () {                          // when we get a change in the request state...
            if (this.readyState != 4) return;                           // if the ready state isn't 4, just return
        
            if (this.status == 200)                                     // if we get back a 200 response...
                resolve(this.responseText)                              // resolve the promise with the returned data
            else                                                        // otherwise reject
                reject(`request could not be resolved. Error code: ${this.status}`)
            
            reject("unknown error")
        };

        xhr.send(args ? JSON.stringify(args) : '');                     // send the request with the args in the body if applicable
    })
}

/// shows a callback based 2-option dialog with it's function and appearance determined by the parameters
/// params: contianer - DOM element within which the dialog will be added
///         header - string containing the header html
///         body - string containing the body html
///         positiveBtn - string containing the html of the positive button option
///         negativeBtn - string containing the html of the negative button option
///         positiveAction - function that will be executed when the user presses the positive button
///         negativeAction - function that will be executed when the user presses the negative button
/// return: void
function showCallbackDialogQuestion (container, header, body, positiveBtn, negativeBtn, positiveAction, negativeAction) {
    let dialog = document.createElement('div')
    dialog.className="dialog-curtain"
    dialog.innerHTML = `
        <div class="panel dialog-panel">
            <div class="panel-top-bar">
                <div class="panel-title">${header}</div>
            </div>
            <div class="dialog-body">${body}</div>
            <div class="dialog-buttons">
                <div onclick="callbackExecute(this, ${negativeAction})" class="btn btn-Negative">${negativeBtn}</div>
                <div onclick="callbackExecute(this, ${positiveAction})" class="btn btn-Positive">${positiveBtn}</div>
            </div>
        </div>
    `
    container.appendChild(dialog)
}

function showPromiseDialogQuestion (container, header, body, positiveBtn, negativeBtn) {
    return new Promise((resolve) => {
        let dialog = document.createElement('div')
        dialog.className="dialog-curtain"
        dialog.innerHTML = `
            <div class="panel dialog-panel">
                <div class="panel-top-bar">
                    <div class="panel-title">${header}</div>
                </div>
                <div class="dialog-body">${body}</div>
                <div class="dialog-buttons">
                    <div class="btn btn-Negative dialog-negative">${negativeBtn}</div>
                    <div class="btn btn-Positive dialog-positive">${positiveBtn}</div>
                </div>
            </div>
        `
        dialog.querySelector('.dialog-negative').addEventListener('click', function(){
            resolve(false)
            document.querySelector('.dialog-curtain').remove()
        },{once:true})
        dialog.querySelector('.dialog-positive').addEventListener('click', function(){
            resolve(true)
            document.querySelector('.dialog-curtain').remove()
        },{once:true})

        container.appendChild(dialog)
    })
}

/// create a new DOM Element based on a few parameters
/// params: tagname - string, name of the tag (i.e. "div", "p", "h1")
///         attributes - object describing the attributes, formatted as { <attribute name>:<attribute value>, ...}
/// return: new DOM element
function makeNewHTMLElement(tagName, attributes={}, children = []) {
    let newElement = document.createElement(tagName)
    for (const key in attributes) {
        if (attributes[key] != undefined) // important to check for undefined, just checking for falsy is not good enough
            newElement.setAttribute(key, attributes[key])
    }

    children.forEach(child => {
        if (Array.isArray(child))
            child.forEach(innerChild => {newElement.append(innerChild)})
        else
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


Array.equals = function (arr1, arr2) {
    if (arr1.length == arr2.length)
    {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i])
                return false
        }
    }
    else
        return false
    return true
}


var globalStorage = {
    availableThemes: ["Dark", "Light"],
    loadedTheme: "Dark",
    availableOrganisations: {},
    currentOrganisation: 1,
}