[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-player-abi?style=flat-square)

# IQB Verona Player Abi
Verona interfaces are specifications concerning computer based assessment. You can learn
more about this German initiative [here](https://github.com/verona-interfaces/introduction).

IQB´s verona-player-abi is a software component which runs unit definitions inside verona
compliant web applications. The main target for this player are surveys. Unit
definitions are written as simple text scripts.

## Using the Player

To learn more about using the player [read here](https://github.com/iqb-berlin/verona-player-abi/wiki) (German only). 

* You need a Verona host system to run this software, for example the
[IQB-Testcenter](https://github.com/iqb-berlin/testcenter-setup) or the
[Verona-Player-Testbed](https://github.com/iqb-berlin/verona-player-testbed).
* This angular application builds to one single html file. You can find a ready-to-use player in [release section](https://github.com/iqb-berlin/verona-player-abi/releases) of
this repository.

## Development

This player is an Angular web application. After cloning this repository, you need to download all components this application depends on: 

```
npm install
```

After install of all required components, `ng serve` will start the player. You get a simple helper menu to load unit definitions.

### Build Verona Player Html File
The Verona Interface Specification requires all programming to be built in one single html file. All styles and images need to be packed in one file.
```
npm run build
```
This way, the Angular application is built into the folder `dist` and then packed into the file `docs/index.html`. This way, one can try out the player via GitHub pages. The helper menu will show up when the player is started without host.

### Release

Please copy the `docs/index.html` file locally, rename it to `verona-player-abi-<version>.html` 
and load it as artefact into the release.
