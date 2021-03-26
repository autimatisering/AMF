// Martin
// 22/03/2021
//

// Append the demo module to the modules the moment this file gets loaded
ModuleRespository.demo = function (id, rootNode) {
    this.moduleName = "demo"
    this.rootNode = rootNode
    this.id = id

    getFirstClass(rootNode, "demo").innerHTML = "AMF appears to be working correctly";
}