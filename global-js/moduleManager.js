// Martin
// 22/03/2021
// Manages modules and is the central point through which to make references to any

class ModuleManager  {
    /// stores all the loaded JS modules that can be added to a page
    ModuleRespository = {};

    /// stores all the added JS modules currently on the page
    Modules = (() => {
        let manager = this;
        function modules () {
            this.manager=manager,

            /// adds a new instance of a module to the page and makes the nessesary adjustments
            /// Params:  module          - an instance of a JS module
            ///          htmlDestination - a html element on the page that the module is loaded into
            /// Return:  void
            this.addModule = function (moduleConstructor, params, destination, modulePath) {
                let module = new Object()                                    // prepare a new object to house the module instance
                module.id = this.length;                                     // set the id of the module
                let parentModule
    
                if (destination instanceof Element || destination instanceof HTMLDocument)  // if the destination is an html dom element
                {
                    if (destination.tagName != "BODY")                                      // if the module is not being loaded into the body element
                        parentModule = this.manager.findAssociatedModule(destination.parentElement)      // find the parent module
                    module.rootNode = destination;                                          // set root node of the module
                    module.modulePath = modulePath                                          // set the path to the module
                    destination.id = `${this.length}`                                       // update the id of the htmlDestination element
                }
                else if (Number.isInteger(destination))             // if the destination is an integer
                    parentModule = this[destination]                // get the module from the list
                else                                                // otherwise
                    console.error("invalid destination provided")   // throw error
    
                if (parentModule)                                   // if we have a parent module
                {
                    if (!parentModule.nestedModules)                // if the parent module doesn't have a nestedModules property yet
                        parentModule.nestedModules = []             // set the nestedModules property to an empty array
                    parentModule.nestedModules.push (module)        // push the id of the new module into the array
                    module.parentModule = parentModule              // make the parent module known to the new module
                }
    
                module = moduleConstructor.apply(module, params)    // create the module
    
                if (!module)
                    console.error("Constructor didn't return anything, be sure to add 'return this' at the end of your module")
    
                this.push(module);               // store the created module in the list
                return module
            }
            return this
        };
        modules.prototype = Array.prototype; 
        return new modules();
    })()

    /// executes the function of a module
    /// Params:  callerElement  - the HTML element that called this function
    ///          functionName   - the name of the module function requested to be called
    ///          ...params      - the parameters to be send to the module function
    /// Return:  void
    moduleExecute = (callerElement, functionName, ...params) => {
        let targetModule = this.findAssociatedModule(callerElement)   // find the module associated with the caller
        targetModule[functionName].apply(targetModule, params)   // execute the function of the module as though it were called directly
    }

    /// executes a callback as part of a module
    /// Params:  callerElement  - the HTML element that called this function
    ///          callback       - the the callback function to be called
    ///          ...params      - the parameters to be send to the callback
    /// Return:  void
    callbackExecute = (callerElement, callback, ...params) => {
        let targetModule = this.findAssociatedModule(callerElement)   // find the module associated with the caller
        callback.apply(targetModule, params)                     // execute the function of the module as though it were called directly
    }


    /// recursively go down the html tree until we find a module root element
    /// Params:  element    - the HTML element within a module block
    /// Return:  object     - the module associated with the element
    findAssociatedModule = (element) => {

        if (element.id && this.Modules[element.id])                  // if the ID of this element corresponds with a rootNode of a module
        {   
            //console.log(element.id) 
            //console.log(Modules[element.id].id)
            //console.log(Modules)
            return this.Modules[element.id]                          // return the module associated with it
        }
        else                                                    // otherwise
            return this.findAssociatedModule(element.parentElement)  // repeat the process on the parent of the current element
    }

    /// Creates an instance of a JS module that will be stored in memory
    /// Params:  filePath - String path to the js file
    ///          name     - String name of the module
    /// Return:  Promise that will resolve when the JS is loaded and appended
    loadJSModule = async (name, path, loadCSS, destination, ...constructorParams) => {
        if (!this.ModuleRespository[name])                                  // if the module is not yet in the repository
        {
            await this.prepareJSModule(`${path}/${name}.js`, name)          // load the module into the repository
            if (loadCSS)
                this.loadCSSModule(`${path}/${name}.css`, name)             // load the css of the module
            if (this.ModuleRespository[name])
                this.ModuleRespository[name] = {module: this.ModuleRespository[name], instances: 0}
        }

        if (this.ModuleRespository[name]) {                       // if the module was successfully loaded
            this.ModuleRespository[name].instances+=1             // add 1 to the counter for this module
            return this.Modules.addModule(this.ModuleRespository[name].module, constructorParams.flat(), destination, path) // add a new instance of the module
        }
        else
        {
            console.error("Trying to load an invalid module!")
            console.warn("Script remains loaded and can be used but please use an alternative means to load the JS if this was intentional")
        }
    }

    requireLibrary = async (name, jsPath, destination, cssPath = "") => {
        if (!this.ModuleRespository[name])                              // if the module is not yet in the repository
        {
            await this.prepareJSModule(jsPath, name)      // load the module into the repository
            if (cssPath)
                this.loadCSSModule(cssPath, name)                       // load the css of the module
            if (this.ModuleRespository[name])
                this.ModuleRespository[name] = {module: this.ModuleRespository[name], references: []}
        }

        if (this.ModuleRespository[name]) {                                  // if the module was successfully loaded
            this.ModuleRespository[name].references.push(destination) // add 1 to the counter for this module
            if (!this.Modules[destination].requiredLibraries)
                this.Modules[destination].requiredLibraries = []
            this.Modules[destination].requiredLibraries.push(name)
            return this.ModuleRespository[name].module
        }
        else
        {
            console.error("Trying to load an invalid library!")
            console.warn("Script remains loaded and can be used but please use an alternative means to load the JS if this was intentional")
        }

    }


    /// Prepares a JS file and appends it to the DOM head so it can be made
    /// Params:  filePath - String path to the js file
    ///          name     - String name of the module
    /// Return:  Promise that will resolve when the JS is loaded and appended
    prepareJSModule = (filepath, name) => {
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

    /// Adds the css file associated with the module
    /// Params:  filePath - String path to the js file
    ///          name     - String name of the module
    /// Return:  void
    loadCSSModule = (filepath, name) => {
        var link = document.createElement('link');    // Prepare a new link element
        link.href = filepath;                         // Set the src of the new script element to the JS file
        link.id = `${name}-moduleCSS`;                // Set a classname if provided for identification purposes
        link.rel = "stylesheet"                       // Set the rel of the link element
        document.head.appendChild(link);              // Add the script element to the head of the DOM       
    }

    /// Unloads a JS module, removes the script tag as well as the module from memory
    /// Params: name - String name of the module
    /// Return: success boolean
    unloadJSModule = (module) => {
        try {

            if (module.destructor)
                module.destructor()

            module.requiredLibraries?.forEach(libName => {
                console.log(`module needed ${libName} library`)
                this.ModuleRespository[libName].references.splice(this.ModuleRespository[libName].references.indexOf(module.id), 1)
                if (this.ModuleRespository[libName].references.length == 0)
                    this.ModuleRespository[libName] = undefined
            });

            // if there are nested modules
            if (module.nestedModules && module.nestedModules.length > 0)
            {
                // iterate over them and make them unload as well
                module.nestedModules.forEach(nModule => {
                    this.unloadJSModule(nModule)
                });
            }
            // clear the variable the module was stored in
            this.Modules[module.id] = undefined

            console.log(`unloaded ${module.moduleName} instance`)

            // reduce the instance counter
            this.ModuleRespository[module.moduleName].instances -= 1;

            if (this.ModuleRespository[module.moduleName].instances < 1)
            {
                // remove module from the repository
                this.ModuleRespository[module.moduleName] = undefined
                // get and remove the script tag of the to be unloaded module
                document._GEBI(`${module.moduleName}-module`).remove()
                document._GEBI(`${module.moduleName}-moduleCSS`).remove()
                console.log(`unloaded ${module.moduleName} module`)
            }

            console.log(this.ModuleRespository)
        } 
        catch (error) 
        {
            console.error(error);
            return false;
        }
        return true
    }
}

let moduleManager = new ModuleManager() 
let moduleExecute = moduleManager.moduleExecute
let callbackExecute = moduleManager.callbackExecute