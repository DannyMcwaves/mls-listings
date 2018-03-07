const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const base64url = require('base64url');

const request = require('request');
const rp = require('request-promise-native');
const cheerio = require('cheerio');
const Mlslink = require('../db/mlslink')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mls_listings')

const SCOPES = ['https://mail.google.com/'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

/**
 * HOW THIS FILE WORKS
 * fs.readFile() -> where the program starts
 * 1. authorize() first, then add what you wanna do as a callback param
 * 2. readMessages() -> where you search for emails
 * 3. inside readMessages() -> finds torontomls links from emails
 *    checks if they're not expired, and inserts them into db
 * 4. Run this script to populate db with torontomls links
 */

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
 * The function that does stuff
 *
 */

function readMessages(auth) {
  	// - get the links that are needed
	// - organize that data 
	// - insert into db
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth,
    userId: 'me'
  },{
    qs: {
      q: 'subject:property match from:michaellombardi29@gmail.com',
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

      let urls = []
      messages.forEach((m, i) => {
        gmail.users.messages.get({
          auth,
          userId: 'me',
          id: m.id
        }, {
          format: 'full'
        }, async function(err, response) {
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
          const match = matches[0].slice(0, -1)
          
          let url 
          if (~match.indexOf('torontomls.net')) { 
            url = match
          } else {
            url = null
          }

          if (url) {
            const websiteCheck = await rp(url)
            if (websiteCheck.length > 150) {
              // this means link is not expired
              // insert into Mlslink db
              let mlslink = new Mlslink()
              mlslink.link = url
              mlslink.save(err => {
                if (err) {
                  console.error(err)
                } else {
                  console.log(`${mlslink.link} saved`)
                }
              })
            }
          }
        })
      })
    }
  })
}

