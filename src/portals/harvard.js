const Nightmare = require('nightmare')
const electron = require('electron')
const path = require('path')
const isDevMode = process.execPath.match(/[\\/]electron/)

function accessHarvard(aamcid, password) {
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
    .goto('https://admissions.hms.harvard.edu/security/Login.aspx?ReturnUrl=%2fdefault.aspx')
    .insert('input[name="Login1$UserName"]', userid)
    .insert('input[name="Login1$Password"]', pass)
    .click('input[name="Login1$LoginButton"]')
    .wait(3000)
    //.goto('https://admissions.hms.harvard.edu/Applicant/Status/Status_com.aspx')
    .evaluate(() => {
        return document.getElementById('unread_count').innerText
    })
    .end()
    .then((message_count) => {
        if (message_count != 0) {
            return true
        } else {
            return false
        }
        //nightmare.click('a[id="ctl00_Header_HyperLink1"]').end()
    })
    .catch((err) => {
        console.log(err)
        return -1
    })

}

module.exports = {
    accessHarvard: accessHarvard
}