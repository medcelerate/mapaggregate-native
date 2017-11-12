/*
This is the parser for the stanford applicaiton, there needs to be a user agent in the user agent field.
This specific package depends on horsemanjs and phantom js. Phantom can be installed using npm with -g.
*/

const Horseman = require('node-horseman');
const Nightmare = require('nightmare')
function accessStanford(aamcid, password) {
    if (aamcid == null || password == null) {
        return Promise.resolve(null)
    }
    else {
    let nightmare = new Nightmare({electronPath: require('../../node_modules/electron'), show:true});
    let horseman = new Horseman();
    let pass = ""
    let userid = String(aamcid);
    let n = password.length
    if (n > 10) {
        pass = String(password.substring(0, 10));
    }
    else {
        pass = String(password);
    }
    
    let poststring = 'aamcId=' + userid + '&password=' + pass
 
    /*return horseman
    .userAgent('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0')
    .open('https://med.stanford.edu/aes')
    .post('https://med.stanford.edu/aes/login.do', poststring)
    .wait(500)
    .open('https://med.stanford.edu/aes/applicationStatus.do')
    .html('table[class="application-table"]')*/
    return nightmare
    .goto('https://med.stanford.edu/aes')
    .evaluate(() => {
        /*return new Promise((resolve, reject) => {
            var http = new XMLHttpRequest();
            var url = "https://med.stanford.edu/aes/login.do";
            var params = poststring;
            http.open("POST", url, true);
    
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    console.log(document.cookie)
                    resolve(http); // <- Get some data here
                }
            }
            http.send(params);
        });*/
        console.log(document.cookie)
    })
    .goto('https://med.stanford.edu/aes/applicationStatus.do')
    .evaluate(() => {
       return document.querySelector('table[class="application-table"]')
    })
    .then((text) => {
        console.log(text)
        return text
       //horseman.open('https://med.stanford.edu/aeslogout.do/').close()
    })
    .catch((err) => {
        console.log(err);
        return -1
    })
}}
module.exports = {
    accessStanford: accessStanford
};
