// Martin
// 22/03/2021
//

// Append the demo module to the modules the moment this file gets loaded
moduleManager.ModuleRespository.subDemo = function () {
    this.moduleName = "subDemo"

    console.log(this)
    this.parentModule.rootNode.querySelector(".demo").innerHTML += ` <span style="color:#0f0">also the sub-module works</span>`;

    return this
}