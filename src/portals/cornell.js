const Nightmare = require('nightmare')
const electron = require('electron')
const path = require('path')
const isDevMode = process.execPath.match(/[\\/]electron/)

//var electronpath = electron.remote.require('electron')

function accessCornell (aamcid, birthday) {
    if (isDevMode != null) {
        var electronpath = require('../../node_modules/electron')
    }
    else {
        var electronpath = (electron.app || electron.remote.app).getAppPath()
        electronpath = require(path.join(electronpath,'/node_modules/electron'))
    }    

    let nightmare = new Nightmare({electronPath:electronpath});
    let userid = String(aamcid);
    let date = String(birthday);
    date = date.split("T")[0]
    date = date.split("-")
    let month = date[1]
    let day = date[2]
    let year = date[0]
    
    return nightmare
    .goto('https://s018.med.cornell.edu:8443/OSAF/')
    .insert('input[name="AamcId"]', userid)
    .insert('input[name="birth_date_year"]', year)
    .select('select[name="birth_date_month"]', month)
    .select('select[name="birth_date_day"]', day)
    .click('input[type="submit"]')
    .wait('#wrapper')
    .evaluate(() => {
        return document.querySelector('#wrapper table tbody > tr td').innerText
    })
    .end()
    .then((html) => {
        return html
    })
    .catch((err) => {
        return -1
    })
}
module.exports = {
    accessCornell:accessCornell
}