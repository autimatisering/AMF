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
        let clickval = Number.parseInt(counter.getAttribute("clickCounter"))
        clickval += increment
        counter.setAttribute("clickCounter", clickval)
        switch (clickval) {
            case 2:
                counter.innerHTML = `2 times; dubbel click`
                break;
            case 3:
                counter.innerHTML = `3 times; triple click`
                break;
            case 4:
                counter.innerHTML = `4 times; multi click`
                break;
            case 5:
                counter.innerHTML = `5 times; mega click - Clicking Spree!`
                break;
            case 6:
                counter.innerHTML = `6 times; ultra click`
                break;
            case 7:
                counter.innerHTML = `7 times; m-m-m-m-m-monster click!!`
                break;
            case 8:
                counter.innerHTML = `8 times; l-l-l-l-l-ludicrous click!!`
                break;
            case 9:
                counter.innerHTML = `9 times; HOLY SHIT!!!`
                break;
            case 10:
                counter.innerHTML = `10 times - Rampage!`
                break;
            case 15:
                counter.innerHTML = `15 times - Dominating!`
                break;
            case 20:
                counter.innerHTML = `20 times - Unstoppable!`
                break;
            case 25:
                counter.innerHTML = `25 times - Godlike!`
                break;
            case 30:
                counter.innerHTML = `30 times - WICKED SICK!!`
                break;
            case 42:
                counter.innerHTML = `life the universe and everything's meaning times`
                break;
            case 69:
                counter.innerHTML = `nice times`
                break;
            case 616:
                counter.innerHTML = `actual satanic times`
                break;
            case 666:
                counter.innerHTML = `satanic times`
                break;
            default:
                counter.innerHTML = `${clickval} times`
                break;
        }
    }

    return this;
}