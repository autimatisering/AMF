// Martin
// 22/03/2021
//

// Append the demo module to the modules the moment this file gets loaded
ModuleRespository.demo = function () {
    this.moduleName = "demo"

    getFirstClass(this.rootNode, "demo").innerHTML = "AMF appears to be working correctly";
    loadJSModule("subDemo", "pages/demo", false, this.id)

    return this;
}