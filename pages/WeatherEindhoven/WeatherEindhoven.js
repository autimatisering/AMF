// Martin
// 22/03/2021
//

// generate tag list
// optimize regex


class StateManager {

    constructor (rootNode, state = {}){

        let d = new Date()

        this.rootNode = rootNode // module node
        this.originalHTML = rootNode.innerHTML // needs to be saved to continually update {var} tags
        this.state = state

        this.tagPattern = /{(\s?)[a-zA-Z0-9+]*(\s?)}/g; // { tagname } {tagname} { tagname} {tagname }
        this.taglist = this.originalHTML.match(this.tagPattern).map((match) => match.replace("{","").replace("}","").trim())

        if(state !== {}){ // if state is not empty set and replace vars
            this.setState(state)
        }

        let s = new Date();
        console.log("Construct Time", (s - d))

        //this.clearOriginalTags()

    }

    clearOriginalTags(){ // testing
        let newHTML = this.originalHTML;
        this.rootNode.innerHTML = this.originalHTML.replace(this.tagPattern, "")        
    }

    setState (newState) { // setter for state

        let d = new Date()
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

                let s = new Date();
                console.log("SetState Time", (s - d))

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



// Append the WeatherEindhoven module to the modules the moment this file gets loaded
ModuleRespository.WeatherEindhoven =  (id, rootNode) => {
    this.moduleName = "WeatherEindhoven"
    this.rootNode = rootNode
    this.originalHTML = rootNode.innerHTML
    this.id = id

    this.sm = new StateManager(this.rootNode)

    // module options
    this.updateTime = 1  * 1000 // every 5 minutes refetch data
    this.APIURL  = "https://data.buienradar.nl/2.0/feed/json";


    this.construct = () => {
        this.updateLoop()
    }

    this.updateLoop = () => {
        this.getWeather();
        const self = this;

        setTimeout(() => {
            self.updateLoop()
        }, this.updateTime);
    }


    this.getURL = (url) => {
        var xhttp = new XMLHttpRequest();
        let self = this
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let data = JSON.parse(xhttp.responseText);
                let eindhoven = data.actual.stationmeasurements[6]


                // omrekenen waardes
                eindhoven.windgusts = (eindhoven.windgusts * 3.6).toPrecision(4)  // meter per second to km/h
                eindhoven.visibility = (eindhoven.visibility / 1000).toPrecision(4) // not sure about this. km/h


                self.sm.setState({ time: new Date().toUTCString(), ...eindhoven})
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }


    this.getWeather = () => {
        try {
            this.getURL(this.APIURL)
        }catch(error){
            this.error = error
            console.error(error);
        }
    }



    this.construct();

    return this
}