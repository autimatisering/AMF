// Martin
// 22/03/2021
// Manages modules and is the central point through which to make references to any

/// stores all the loaded JS modules that can be added to a page
var ModuleRespository = {};

/// stores all the added JS modules currently on the page
var Modules = {
    counter: 0,  // counter to generate ID's from

    /// returns the amount of Modules currently added on the page
    count: function () {
        return Object.keys(this).length-3
    },

    /// adds a new instance of a module to the page and makes the nessesary adjustments
    /// Params:  module          - an instance of a JS module
    ///          htmlDestination - a html element on the page that the module is loaded into
    /// Return:  void
    add: function (moduleConstructor, params, htmlDestination) {
        params = [this.counter+1, htmlDestination].concat(params);      // add the basic module params to the existing ones
        htmlDestination.id = `${this.counter+1}`                        // update the id of the htmlDestination element
        let module = moduleConstructor.apply(moduleConstructor, params) // create the module
        this[this.counter+1] = module;                                  // store the created module in the list
        this.counter+= 1;                                               // up the counter so the next module will also have a unique number
    }
};

/// executes the function of a module
/// Params:  callerElement  - the HTML element that called this function
///          functionName   - the name of the module function requested to be called
///          ...params      - the parameters to be send to the module function
/// Return:  void
function moduleExecute(callerElement, functionName, ...params) {
    let targetModule = findAssociatedModule(callerElement)      // find the module associated with the caller
    targetModule[functionName].apply(targetModule, params)   // execute the function of the module as though it were called directly
}

/// recursively go down the html tree until we find a module root element
/// Params:  element    - the HTML element within a module block
/// Return:  object     - the module associated with the element
function findAssociatedModule(element) {
    if (element.id && Modules[element.id])                  // if the ID of this element corresponds with a rootNode of a module
        return Modules[element.id]                          // return the module associated with it
    else                                                    // otherwise
        return findAssociatedModule(element.parentElement)  // repeat the process on the parent of the current element
}

/// Creates an instance of a JS module that will be stored in memory
/// Params:  filePath - String path to the js file
///          name     - String name of the module
/// Return:  Promise that will resolve when the JS is loaded and appended
async function loadJSModule(name, htmlDestination, ...constructorParams) {
    if (!ModuleRespository[name])                                               // if the module is not yet in the repository
    {
        ModuleRespository[`${name}InstanceCounter`] = 0                         // prepare a counter for this module to keep track of the amount of instances
        await prepareJSModule(`/pages/${name}/${name}.js`, name)                // load the modle into the repository
    }

    if (ModuleRespository[name]) {                                              // if the module was successfully loaded
        ModuleRespository[`${name}InstanceCounter`]+=1                          // add 1 to the counter for this module
        Modules.add(ModuleRespository[name], constructorParams.flat(), htmlDestination) // add a new instance of the module
    }
    else
    {
        console.error("Trying to load an invalid module!")
        console.warn("Script remains loaded and can be used but please use an alternative means to load the JS if this was intentional")
    }
}

/// Adds the css file associated with the module
/// Params:  filePath - String path to the js file
///          name     - String name of the module
/// Return:  void
function loadCSSModule(filepath, name) {
    var link = document.createElement('link');    // Prepare a new link element
    link.href = filepath;                         // Set the src of the new script element to the JS file
    link.id = `${name}-moduleCSS`;                // Set a classname if provided for identification purposes
    link.rel = "stylesheet"                       // Set the rel of the link element
    document.head.appendChild(link);              // Add the script element to the head of the DOM       
}

/// Prepares a JS file and appends it to the DOM head so it can be made
/// Params:  filePath - String path to the js file
///          name     - String name of the module
/// Return:  Promise that will resolve when the JS is loaded and appended
function prepareJSModule(filepath, name) {
    return new Promise((resolve, reject) => {           // Create and return the Promise
        var script = document.createElement('script');  // Prepare a new script element
        script.src = filepath;                          // Set the src of the new script element to the JS file
        script.id = `${name}-module`;                   // Set a classname if provided for identification purposes
        document.head.appendChild(script);              // Add the script element to the head of the DOM
        script.onload = function () {                   // The moment the script is successfully loaded...
            resolve(`Loaded ${name}`)                   // Resolve the promise
        };
    })
}

/// Unloads a JS module, removes the script tag as well as the module from memory
/// Params: name - String name of the module
/// Return: success boolean
function unloadJSModule(module) {
    try {
        // clear the variable the module was stored in
        Modules[module.id] = undefined

        console.log(`unloaded ${module.moduleName} instance`)

        // reduce the instance counter
        ModuleRespository[`${module.moduleName}InstanceCounter`] -= 1;

        if (ModuleRespository[`${module.moduleName}InstanceCounter`] < 1)
        {
            // get and remove the script tag of the to be unloaded module
            let ScriptElement = document.getElementById(`${module.moduleName}-module`)
            ScriptElement.remove()
            console.log(`unloaded ${module.moduleName} module`)
        }
    } 
    catch (error) 
    {
        console.error(error);
        return false;
    }
    return true
}
