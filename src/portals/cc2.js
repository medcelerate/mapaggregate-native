const Nightmare = require('nightmare');
const electron = require('electron')
const path = require('path')
const isDevMode = process.execPath.match(/[\\/]electron/)

function accessCC (email, password) {
    if (isDevMode != null) {
        var electronpath = require('../../node_modules/electron')
    }
    else {
        var electronpath = (electron.app || electron.remote.app).getAppPath()
        electronpath = require(path.join(electronpath,'/node_modules/electron'))
    }

    let nightmare = new Nightmare({electronPath: electronpath});
    let userid = String(email);
    let pass = String(password);
   
    
    return nightmare
    .goto('https://iapply.case.edu')
    .wait('body')
    .insert('input[name="ctl00$MainContent$tcLogin$tpLogin$txtEmailLogin"]', userid)
    .insert('input[name="ctl00$MainContent$tcLogin$tpLogin$txtPasswordLogin"]', pass)
    .click('input[name="ctl00$MainContent$tcLogin$tpLogin$btnLogin"]')
    .wait(2000)
    .evaluate(() => {
        return document.querySelectorAll('#MainContent_dtlCP > span').length
    })
    .end()
    .then((message_count) => {
        message_count = message_count -1
        if (message_count != 0) {
             return message_count
        }
        else {
            return false;
        }
    })
    .catch((err) => {
        console.log(err)
        return -1
    })
}
module.exports = {
    accessCC: accessCC
}