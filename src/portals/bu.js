const Nightmare = require('nightmare')
const electron = require('electron')
const path = require('path')
const isDevMode = process.execPath.match(/[\\/]electron/)

//var electronpath = electron.remote.require('electron')

function accessBU (email, password) {
    if (isDevMode != null) {
        var electronpath = require('../../node_modules/electron')
    }
    else {
        var electronpath = (electron.app || electron.remote.app).getAppPath()
        electronpath = require(path.join(electronpath,'/node_modules/electron'))
    }    

    let nightmare = new Nightmare({electronPath:electronpath});
    let userid = String(email);
    let pass = String(password);
    
    
    return nightmare
    .goto('https://myapplication.bumc.bu.edu/2018/login.aspx?ReturnUrl=%2f2018')
    .click('input[name="ctl00$MainContent$ButtonLogin"]')
    .wait(6000)
    .insert('input[name="j_username"]', email)
    .insert('input[name="j_password"]', pass)
    .click('button[name="_eventId_proceed"]')
    .wait(6000)
    .goto('https://myapplication.bumc.bu.edu/2018/Main/ApplicationStatus.aspx')
    .wait(7000)
    //.count('table.tableMain > tbody table tr')
    .evaluate(() => {
        return document.querySelectorAll('table.tableMain > tbody table tr').length
    })
    .end()
    .then((message_count) => {
        message_count = message_count -1;
        if (message_count != 0) {
            return message_count;
        } else {
            return false;
        }
        
    })
    .catch((err) => {
        console.log(err)
        return -1
    })
}
module.exports = {
    accessBU:accessBU
}