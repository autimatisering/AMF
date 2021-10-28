// Martin
// 22/03/2021
//

// Append the demo module to the modules the moment this file gets loaded
moduleManager.ModuleRespository.demo = function () {
    this.moduleName = "demo"

    this.rootNode.querySelector(".demo").innerHTML = "AMF appears to be working correctly";
    moduleManager.loadJSModule("subDemo", "pages/demo", false, this.id)

    return this;
}