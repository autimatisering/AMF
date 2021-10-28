// Martin
// 22/03/2021
//

// Append the subDemo module to the modules the moment this file gets loaded
moduleManager.ModuleRespository.subDemo = function () {
    this.moduleName = "subDemo"

    // note: because of how this module is loaded in this demo, it does not have a rootnode, as it's loaded effectively as a slave module.

    // the moment the module is loaded, it'll append some things to a particular class on screen
    // also demonstrates how a child module can interact with the parent module
    // this.parentModule can be used to access the parent module
    this.parentModule.rootNode.querySelector(".demo").innerHTML += ` <span style="color:#0f0">also the sub-module works</span>`;

    // a pong function to demonstrate how the modules can interact from parent to child
    this.pong = function () {
        return "pong"
    }

    return this
}