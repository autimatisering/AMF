// Martin
// 22/03/2021
//

// Append the WeatherEindhoven module to the modules the moment this file gets loaded
ModuleRespository.WeatherEindhoven =  (id, rootNode) => {
    this.moduleName = "WeatherEindhoven"
    this.rootNode = rootNode
    this.originalHTML = rootNode.innerHTML
    this.id = id

    this.state = {}

    // module options
    this.updateTime = 10 * 1000 // every 30 seconds refetch data
    this.APIURL  = "https://data.buienradar.nl/2.0/feed/json";


    this.construct = () => {
        this.updateLoop()
    }


    this.setState = (obj) => { // setter for state / rerenders vars on page
        return new Promise((resolve,reject) => {
            try{

                function state (obj) {
                    return new Promise((resolve, reject) => {

                        for (var prop in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                                this.state[prop] = obj[prop]
                            }
                        }

                        resolve(obj)
                    })
                }

                state(obj).then(() => {
                    return this.replaceVars()
                }).then(() =>{
                    resolve(this.state)
                })


            }catch(error){
                reject(error);
            }
        })
    }
    
    this.replaceVars = () => { // funstion to replace all the state vars
        let html = this.originalHTML

        if(this.state && this.rootNode.innerHTML){
            for (var prop in this.state) {
                if (Object.prototype.hasOwnProperty.call(this.state, prop)) {
                    var pattern = new RegExp(`{${prop}}`,"i");
                    html = html.replace(pattern, this.state[prop])

                }
            }
        }

        this.rootNode.innerHTML = html
        return true;
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
                //getFirstClass(rootNode, "WeatherEindhoven").innerHTML = xhttp.responseText;

                let data = JSON.parse(xhttp.responseText);
                let eindhoven = data.actual.stationmeasurements[6]


                // omrekenen waardes
                eindhoven.windgusts = (eindhoven.windgusts * 3.6).toPrecision(4)  // meter per second to km/h
                eindhoven.visibility = (eindhoven.visibility / 1000).toPrecision(4) // not sure about this. km/h


                self.setState({ time: new Date().toUTCString(), ...eindhoven})
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