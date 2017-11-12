import React, { Component } from 'react';
import * as Blueprint from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
const remote = require('electron').remote;
const path = require('path')
const fs = require('fs')
const electron = require('electron')
const isDevMode = process.execPath.match(/[\\/]electron/)

if (isDevMode != null) {
  var handlerspath = path.resolve('src/handlers.js')
  var filePath = path.resolve('src/schools.json')
}
else {
  var electronpath = (electron.app || electron.remote.app).getAppPath()
  var handlerspath = path.join(electronpath,'src/handlers.js')
  var filePath = path.join(electronpath,'/schools.json')
}

const handlers = remote.require(handlerspath)
const schools = JSON.parse(fs.readFileSync(filePath))

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      aamcid: null,
      password: null,
      email: null,
      selectedSchools: [],
      date: new Date(),
      data: null,
      view: null,
      schoolList:schools
    }
  };

  componentDidMount() {

  }
  runHandlers(event){
    event.preventDefault();
    this.setState({view: 'loading'})
    let req = {
      body: {
        aamcid: this.state.aamcid,
        pass: this.state.password,
        email: this.state.email,
        schools: this.state.selectedSchools
      }
    }
    handlers.pulldown(req)
      .then((response) => {
        this.setState({
          data: response,
          view: 'complete'
        })
      })
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'aamcid':
        this.setState({aamcid:event.target.value})
        break;
      case 'password':
        this.setState({password:event.target.value})
        break;   
      case 'email':
        this.setState({email:event.target.value})
        break;
      case 'school':
      //This section could be improved, if you attempt to use for loops please note that the transpiler seems to have an issue
      //with them and they always stop at the first index only
        let newSchool = event.target.value
        let oldSchool = this.state.selectedSchools
        let duplicate = false
        if (event.target.value != null ){
          if (oldSchool.length == 0) {
            duplicate = false
          } else {
            oldSchool.map(function(data,i) {
              if (data.school == newSchool) {
                duplicate = true
                oldSchool.splice(i,1)
              } 
            })
          }
          if (duplicate == false) {
            oldSchool.push({school:newSchool})
          }
          this.setState({SelectedSchools: oldSchool})
        break;
      }
    }
  }
  handleDate(event) {
    this.setState({date:event.toISOString()})
  }

  //All the rendering and view logic happens here, no more state control.

  render() {
    let dateprops ={
      name:'date'
    }
    let results = null

    //This controls the rendering of each school section when execution is completed
    let SelectedSchools = this.state.SelectedSchools
    if (this.state.data != null) {
     results = this.state.data.data.map(function (data, i){
       for (var x = 0; x < SelectedSchools.length; x++) {
         if (SelectedSchools[x].school == data.school) {
  
        if (data.update === true) {
          return (
            <div key={i} className="pt-card pt-elevation-2 card-modifier">
              <h3>{data.school}</h3>
              <p>Update is available</p>
            </div>
            )
        } else if (data.update === false) {
          return (
            <div key={i} className="pt-card pt-elevation-2 card-modifier">
              <h3>{data.school}</h3>
              <p>Sorry no updates available</p>
            </div>
            )
        } else if (data.update === "failed") {
          return (
            <div key={i} className="pt-card pt-elevation-2 card-modifier">
              <h3>{data.school}</h3>
              <p>Sorry this check failed, please try again in a few minutes or you may have incorrect login credentials</p>
            </div>
            )
        }
        }
       }
      })
    } else {
      results = null
    }

    //As you may guess from the syntax below this controls the styling applied when data is loading.

    var view = this.state.view
    let loading = null;
    if (view == 'loading') {
      loading =
            <div className="loading">
            <div className="loader">Loading</div>
            </div>;
        }
    else {
      loading = null;
    }

    //This controls the appearence of the list of selected schools

    var schoollist = this.state.selectedSchools.map(function(data,i){
      return (
        <h4 key={i} className="card-modifier">{data.school}</h4>
      )
    })
 
    //This controls the appearence of schools in the list if they are selected so no duplicates can be selected
    var schools = this.state.schoolList.map(function(data, i) {
        return (
          <option key={i} value={data.school}>{data.school}</option>
        )
      })

      //This is the main react render section. This is where it all comes together. Ideally I will move
      //some of this to seperate importable classes just to be able to keep the global state cleaner.

    return (
      <section>
      <div>
      <div className="pt-navbar navbar-modifier">
        <div className="pt-navbar-group pt-align-left navbar-heading-modifier">
          <div className="pt-navbar-heading">Map Aggregator</div>
        </div>
      </div>
      {loading}
      <div className="pt-card pt-elevation-2 card-modifier">
        <form onSubmit={this.runHandlers.bind(this)}>
          <div className="input-wrapper">
          <input className="pt-input input-modifier" name="aamcid" type="text" placeholder="AAMC ID" onChange={this.handleChange.bind(this)}/>
          <input className="pt-input input-modifier" name="email" type="text" placeholder="Email" onChange={this.handleChange.bind(this)}/>
          <input className="pt-input input-modifier" name="password" type="password" placeholder="Password" onChange={this.handleChange.bind(this)}/>
          <DateInput format="MM/DD/YYYY" value={this.state.date} inputProps={dateprops} onChange={this.handleDate.bind(this)}/>
          <button className="pt-button pt-intent-success button-modifier" type="submit">Login</button>
          </div>
        </form>
      </div>
      <div className="pt-card pt-elevation-2 card-modifier">
        <h3>Select Your Schools</h3>
        <div className="pt-select pt-fill">
          <select name="school" onChange={this.handleChange.bind(this)}>
          {schools}
          </select>
          {schoollist}
        </div>
      </div>
        {results}
      </div>
      </section>
    );
  }
}
