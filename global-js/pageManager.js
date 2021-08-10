// Martin
// 22/03/2021
// Manages the loading of pages and associated modules

/// Load the default theme and default page
loadTheme("Dark")
loadModule("login", document.body, () => {loadModule("main", document.body)}) // <=== for testing purposes

/// Loads an HTML file and it's associated JS file, then appends the HTML in the innerHTML of the destination element
/// The JS file gets appended to the head of the DOM
/// Params:  filePath - String path to the js file
/// Return:  Promise that will resolve when the JS is loaded and appended
async function loadModule(filename, htmlDestination, ...moduleParams) {
    if (htmlDestination.id)
        unloadJSModule(Modules[htmlDestination.id])
        
    console.log(`loading ${filename}`)
    await loadHTML(`/pages/${filename}/${filename}.html`).then((v) => {
        htmlDestination.innerHTML = v
    }); // Load HTML

    loadJSModule(filename, `pages/${filename}`, true, htmlDestination, moduleParams) // Load JS
}

/// Sets the href of a link element in the head to change the theme
/// Params: Name of the theme (without extension or any of the sort)
/// Return: void
function loadTheme(name) {
    globalStorage.loadedTheme = name;
    document.getElementById("CSSThemeFile").setAttribute("href", `/css/themes/${name}.css`)
}

/// Loads an html file based on a path/url
/// Params:  filePath - String path/url to the html file
/// Return:  Promise that will resolve and return the html file when loaded, or reject if a code other than 200 resulted
function loadHTML(filepath) {
    return new Promise((resolve, reject) => {   // Create and return the Promise
        let xhr= new XMLHttpRequest();          // Prepare XMLHttpRequest
        xhr.open('GET', filepath, true);        // Declare the url and protocol
        xhr.onreadystatechange=function() {     // The moment the page is loaded...
            if (this.readyState!==4) return;
            if (this.status!==200) 
            {                                   // If the response code is not 200, reject the promise with an error
                reject(`Failed to load HTML: ${this.status} ${this.responseText}`)
                return;
            }
            resolve(this.responseText)          // If the page successfully loaded, resolve the promise with the html
        };
        xhr.send();                             // Send the XMLHttpRequest
    })
}