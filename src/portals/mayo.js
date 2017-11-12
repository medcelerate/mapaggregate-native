const Nightmare = require('nightmare')
const electron = require('electron')
const path = require('path')
const isDevMode = process.execPath.match(/[\\/]electron/)

function accessMayo(aamcid, password) {
    if (isDevMode != null) {
        var electronpath = require('../../node_modules/electron')
    }
    else {
        var electronpath = (electron.app || electron.remote.app).getAppPath()
        electronpath = require(path.join(electronpath,'/node_modules/electron'))
    }    

    let nightmare = new Nightmare({electronPath: electronpath});
    let userid = aamcid;
    let pass = password;
    let state = null;

    return nightmare
    .goto('https://medschoolapplyminnesota.mayo.edu/Security/Login.aspx?ReturnUrl=%2f')
    .click('a[data-toggle="collapse"]')
    .insert('input[name="ctl00$ContentMain$Login1$UserName"]', userid)
    .insert('input[name="ctl00$ContentMain$Login1$Password"]', pass)
    .click('input[name="ctl00$ContentMain$Login1$LoginButton"]')
    .wait(9000)
    .goto('https://medschoolapplyminnesota.mayo.edu/Applicant/Status/Status_com.aspx')
    .evaluate(() => {
        return document.querySelectorAll('#ctl00_content_main_gvCommunication >tbody >tr').length
    })
    .end()
    .then((message_count) => {
        message_count = message_count -1;
        if (message_count != 0) {
            return message_count
        } else {
            return 0;
        }
    })
    .catch((err) => {
        console.log(err)
        return -1
    })
}

module.exports = {
    accessMayo: accessMayo
}