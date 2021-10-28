// Martin
// 22/03/2021
//

// Append the demo module to the modules the moment this file gets loaded
moduleManager.ModuleRespository.demo = function () {
    this.moduleName = "demo"

    this.subModule;

    // an example as to how to access the dom within modules
    // the rootNode object always points to the element that houses the module
    this.rootNode.querySelector(".demo").innerHTML = "AMF appears to be working correctly";

    // load a secondary JS script as a module.
    // it'll be tied to this module when instanced and it'll be tied to this module
    // the first parameter is the name of the file and module (they need to match!)
    // the second parameter is the directory where to find the module
    // the third parameter is a boolean to determine if extra CSS (with matching name) should be loaded.
    // the fourth parameter is the ID of the parent module
    // any parameters after the fourth is used as parameters for the constructor function of the module
    this.subModule = moduleManager.loadJSModule("subDemo", "pages/demo", false, this.id).then(module => {
        // after the module is loaded and the promise is resolved, you can interact with the module as shown
        console.log("ping") 
        console.log(module.pong())
        return module
    })

    // this function will be called from the dom
    // the button you click passes along a value and is entered as a parameter in this function
    this.domToJSDemo = function (increment)
    {
        // in the HTML you can see that you need to use moduleExecute to get to your module's JS code
        // the first parameter is usually "this" because it is used to determine what object called the function
        // the second parameter is a STRING CONTAINING THE NAME OF THE FUNCTION
        // all that comes after the 2nd parameter, is used as parameters for the function you're calling
        let counter = this.rootNode.querySelector(".click-counter")
        counter.innerHTML = Number.parseInt(counter.innerHTML) + increment
    }

    return this;
}