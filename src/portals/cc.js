const Horseman = require('node-horseman');

function accessCC (email, password) {
    let horseman = new Horseman({ignoreSSLErrors:true});
    let userid = String(email);
    let pass = String(password);

    
    return horseman
    .open('https://iapply.case.edu/appStep1.aspx')
    .waitForSelector('body')
    .type('input[name="ctl00$MainContent$tcLogin$tpLogin$txtEmailLogin"]', userid)
    .type('input[name="ctl00$MainContent$tcLogin$tpLogin$txtPasswordLogin"]', pass)
    .click('input[name="ctl00$MainContent$tcLogin$tpLogin$btnLogin"]')
    .waitForSelector('body')
    .count('#MainContent_dtlCP > span')
    .then((message_count) => {
        message_count = message_count -1
        if (message_count != 0) {
            return message_count;
        } 
        else {
            return false;
        }
        horseman.open('https://iapply.case.edu/appStep1.aspx').waitForNextPage().close()
    })
    .catch((err) => {
        console.log(err)
        return -1
    })
}
module.exports = {
    accessCC: accessCC
}