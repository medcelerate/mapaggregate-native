# MapAggregate - The Native Version


MappAggregate Native is the native fork of the MapAggregate project. The aim here is to simplify the task of running MappAggregate. This is the preferred version to use if running locally and is where the binaries can be found.

Latest Binaries can be found here -> [Releases](https://github.com/medcelerate/mapaggregate-native/releases)

# Development Guide

Want to contribute? Great! We need all the help we can get to make this great! Submit a new pull request to add new features.

To build the app [electron-forge](https://electronforge.io/) is used. Before you install it make sure you have at least [Node.js](https://nodejs.org/) v8  and the latest version of npm installed.

If you have issues installing electron-forge (although this is highly unrecommended) run the following command

```sh
sudo npm install -g electron-forge --allow-root --unsafe-perm=true
```
To build the app using electron-forge simply run the following commands.
```sh
$ git clone https://github.com/medcelerate/mapaggregate-native.git
cd mapaggregate-native
$ npm install
$ npm start
```

### Tech

MapAggregate uses several open source projects to work:

* [ReactJS] - A framework for building UIs
* [Electron] - A framework to build cross-platform apps
* [BlueprintJS] - A UI toolkit built for React
* [node.js] - evented I/O for the backend

### License
```
Copyright 2017 VisualiCandy LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

Any comments can be sent to medcelerate@gmail.com

#### Disclaimer

THIS DOES NOT REPLACE YOUR SECONDARY APPLICATIONS!!

You should still use your secondary portals to double check your status and send communications, as this tool is made to aid you and not replace them. 


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [ReactJS]: <https://reactjs.org/>
   [Electron]: <https://electron.atom.io/>
   [node.js]: <http://nodejs.org>
   [BlueprintJS]: <http://blueprintjs.com/>
