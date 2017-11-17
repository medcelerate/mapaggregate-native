const fs = require('fs')
const path = require('path');
const electron = require('electron');


//const stanford = require('./portals/stanford')
const casew = require('./portals/case2')
const mayo = require('./portals/mayo')
const harvard = require('./portals/harvard')
const cc = require('./portals/cc2')
const bosU = require('./portals/bu')
const cornell = require('./portals/cornell')


function computeDeltas(dataUpdated) {
    const usrPath = (electron.app || electron.remote.app).getPath('userData');
    console.log(usrPath)
    const filePath = path.join(usrPath,'db.json')
    return new Promise(function(resolve,reject){
    if (fs.existsSync(filePath)) {
        let state = []
        let rawdata
        let data
        try {
            rawdata = fs.readFileSync(filePath);
        } catch (e) {
            reject(e)
        }
        try {
             data = JSON.parse(rawdata);
        } catch (e) {
            reject(e)
        }

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof dataUpdated[key] == 'undefined' || dataUpdated[key] == -1) {
                    state.push({school: key, update: 'failed'})

                }
                else if (data[key].data != dataUpdated[key] || data[key].data == true) {
                    data[key].data = dataUpdated[key]
                    state.push({school: key, update: true})
                }
                else {
                    state.push({school: key, update: false})
                }
            }
        }
        data = JSON.stringify(data)
        fs.writeFile(filePath, data, 'utf8', () => {
            resolve(state)
        })
    }
    else {
        let state = []
        let data = {}
        for (var key in dataUpdated) {
            if (dataUpdated.hasOwnProperty(key)) {
                if (typeof dataUpdated[key] == 'undefined' || dataUpdated[key] == -1) {
                    state.push({school: key, update: 'failed'})
                    data[key] = {data: dataUpdated[key], update: true};
                }
                else {
                    data[key] = {data: dataUpdated[key], update: true};
                    state.push({school: key, update: false})
                }
            }
            else {
                continue;
            }
        }
        data = JSON.stringify(data)
        fs.writeFile(filePath, data, 'utf8', () => {
            resolve(state)
            console.log(data)
        })
    }
    })
}


 async function pulldata(req) {

    //This is the code with the issue, I can't get it generate an array of functions and variables to assign the data
    /*
     let Dict = {
         'Harvard':{key:'hd', command:'harvard.accessHarvard(req.body.aamcid, req.body.pass)'},
         'Mayo Clinic':{key:'mc', command:'mayo.accessMayo(req.body.aamcid, req.body.pass)'},
         'Case Western':{key:'cw', command:'casew.accessCase(req.body.email, req.body.pass)'},
         'Boston University':{key:'bu', command:'bosU.accessBU(req.body.email, req.body.pass)'},
         'Cleveland Clinic':{key:'ccn', command:'cc.accessCC(req.body.email, req.body.pass)'}
     }
     //let buildPromiseKeys = []
     //let buildPromise = []
 
    Promise.all(req.body.schools.map(function(data,i){
        console.log(Dict[data.school].command)
        return Function(Dict[data.school].command)
    })).then((data)=> {
        console.log(data)
        return data
    })*/
    
    // Scratch that I figured out Async so I made EVERYTHING async.
    let dataUpdate = {}
    let [hd, mo, ce, bu, cn, cl] = await Promise.all([
        //stanford.accessStanford(req.body.aamcid, req.body.pass),
        harvard.accessHarvard(req.body.aamcid, req.body.pass),
        mayo.accessMayo(req.body.aamcid, req.body.pass),
        casew.accessCase(req.body.email, req.body.pass),
        bosU.accessBU(req.body.email, req.body.pass),
        cc.accessCC(req.body.email, req.body.pass),
        cornell.accessCornell(req.body.aamcid, req.body.date)
        ])

    //let result = await Promise.all(buildPromise)
    //console.log(hd)
    
    dataUpdate = {
        'Harvard':hd,
        'Mayo Clinic':mo,
        'Case Western':ce,
        'Cleveland Clinic':cn,
        'Boston University':bu,
        'Weill Cornell': cl
    }
    /*
    dataUpdate.sd = await stanford.accessStanford(req.body.aamcid, req.body.pass);
    dataUpdate.hd = await harvard.accessHarvard(req.body.aamcid, req.body.pass);
    dataUpdate.mo = await mayo.accessMayo(req.body.aamcid, req.body.pass);
    dataUpdate.ce = await casew.accessCase(req.body.email, req.body.pass);
    dataUpdate.cc = await cc.accessCC(req.body.email, req.body.pass);*/
    //console.log(dataUpdate)
    return dataUpdate
}

function pulldown(req) {

    return new Promise (function(resolve, reject){
    pulldata(req)
    .then((result) => {
        computeDeltas(result)
        .then((result) => {
            let payload = {
                status:'Success',
                data: result
            }
            resolve(payload)
        })
        .catch((err) => {
            reject(err)
        })
    })
    .catch((err) => {
        reject(err)
    })
})
}

module.exports = {
    pulldown:pulldown
};