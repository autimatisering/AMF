export default class StateManager {

    constructor (rootNode, state = {}){
        this.rootNode = rootNode // module node
        this.originalHTML = rootNode.innerHTML // needs to be saved to continually update {var} tags
        this.state = state

        this.tagPattern = /{(\s?)[a-zA-Z0-9+]*(\s?)}/g; // { tagname } {tagname} { tagname} {tagname }
        this.taglist = this.originalHTML.match(this.tagPattern).map((match) => match.replace("{","").replace("}","").trim())

        console.log(this.taglist)

        if(state !== {}){ // if state is not empty set and replace vars
            this.setState(state)
        }

        //this.clearOriginalTags()

    }

    clearOriginalTags(){ // testing
        let newHTML = this.originalHTML;
        this.rootNode.innerHTML = this.originalHTML.replace(this.tagPattern, "")        
    }

    setState (newState) { // setter for state
        let newHTML = this.originalHTML;
        return new Promise((resolve,reject) => {
            try{

                for (var prop in newState) { // loop over properties of new state
                    if (this.state[prop] != newState[prop]) { // if new value is not the same as the old value (not sure if this check is more performant than just setting)
                        this.state[prop] = newState[prop] // add and/or replace new values in state
                    }
                }
                
                this.taglist.map((tag) => {
                    if (this.state[tag] !== undefined) {
                        newHTML = this.replaceVar(newHTML, tag); // replace tag in html with new state values
                    }
                })

                this.rootNode.innerHTML = newHTML; // replace html in rootnode
                resolve(this.state)

            }catch(error){
                console.error("AMF: setState recieved an invalid object", error)
                reject(error);
            }
        });
    }


    replaceVar(html, tag){ 
        try {
            var pattern = new RegExp(`{\\s??${tag}\\s??}`,"g");

            return html.replace(pattern, this.state[tag])
        }catch(error) {
            console.error("AMF: State variable not found on page", error)
            return html;
        }
    }

}
