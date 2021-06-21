# challonge.js

### Install

```bash
$ npm install simple-challonge-api
```

### Get all use the API for your account

```js
const Challonge = require('simple-challonge-api');

const client = new Challonge({
	"username" : "Your challonge username",
	"apiKey" : "Your API key", // https://challonge.com/settings/developer
	"tournamentID" : "The tournament id of the tournament you are using the API with" // https://challonge.com/<tournamentID>
})
```

## API Client

Everything documented in the [challonge API docs](https://api.challonge.com/v1) **except the "Attatchment" section** are available in this API

The commands for the API are sorted based on branches on the API docs. For example the [match index command](https://api.challonge.com/v1/documents/matches/index) is called with `client.matches.index()` whereas the [participants index command](https://api.challonge.com/v1/documents/participants/index) is `client.participants.index()`

To use the functions of the API with post data (i. e. the [tournament show](https://api.challonge.com/v1/documents/tournaments/show) api call has the arguments `include_participants` and `include_matches`) just call the methods with arguments in order as they show on the challonge api documentation page or check the documentation for the api (in progress). Example:
```js
client.tournements.show(0, 1) // Where 0 is the `include_participants` parameter and 1 is the `include_matches` parameter as indicated by https://api.challonge.com/v1/documents/tournaments/show
```

When using the [create_bulk](https://api.challonge.com/v1/documents/participants/bulk_add), [create](https://api.challonge.com/v1/documents/participants/create), and [update](https://api.challonge.com/v1/documents/participants/update) functions of `client.participants` use the format used in `client.participants.participant`. On a similar note, when using the [update](https://api.challonge.com/v1/documents/tournaments/update) and [create](https://api.challonge.com/v1/documents/tournaments/create) methods of `client.tournaments` use the format used in `client.tournaments.tournament`

Everything here returns promises synchronously you can than acces with `.then`. Example:
```js
client.matches.index().then(h => console.log(h)
```

## Development

### Install

```bash
 $ git clone https://github.com/NicoNekoru/challonge.js
 $ cd challonge.js
 $ npm install
```

### Run Tests
[![Build Status](https://api.travis-ci.com/NicoNekoru/challonge.js.svg?branch=main)](https://api.travis-ci.com/NicoNekoru/challonge.js)

```bash
$ npm test
```

### Issue Tracking

Issues are tracked on github: https://github.com/NicoNekoru/challonge.js/issues


### Branching

``master`` is the active development branch

``live`` is the latest published build on npm
