const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const base64url = require('base64url');

const SCOPES = ['https://mail.google.com/'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  authorize(JSON.parse(content), readMessages);
});

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function readMessages(auth) {
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth,
    userId: 'me'
  },{
    qs: {
      q: 'subject:listings from:michaellombardi29@gmail.com',
    }
  }, function(err, response) {
    if (err) {
      console.log('Error');
      return;
    }
    var messages = response.messages;
    if (messages.length == 0) {
      console.log('no messages found');
    } else {
      // Got list of messages from query
      // Now get them and get that info
      messages.forEach((m, i) => {
        gmail.users.messages.get({
          auth,
          userId: 'me',
          id: m.id
        }, {
          format: 'full'
        }, function(err, response) {
          if (err) {
            throw err;
          }
          const payload = response.payload
          const parts = payload.parts
          const body = parts[0].body
          const data = body.data

          // v - the email we want to get a link from
          const msg = base64url.decode(data)

          // v - array of links containing http
          const matches = msg.match(/\bhttp?:\/\/\S+/gi);

          // check if it contains torontomls

          matches.forEach(m => {
            if (~m.indexOf('torontomls.net')) {
              const formattedUrl = m.substring(0, m.length - 1);
              console.log(formattedUrl);
            }
          })


        })
      })



    }
  })
}

function listLabels(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}
