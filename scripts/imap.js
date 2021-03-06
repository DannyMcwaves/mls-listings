const MailListener = require("mail-listener2")
const rp = require('request-promise-native');
const mlsLinkToDb = require('./mlsScrape')
const db = require('../db/db')
const Xvfb = require('xvfb')
const xvfb = new Xvfb()
const mailListener = new MailListener({
	username: "realpropertynumbers@gmail.com",
	password: "torontotdot",
	host: "imap.gmail.com",
	port: 993,
	tls: true,
	mailbox: "INBOX",
	fetchUnreadOnStart: true,
	markSeen: true
})

mailListener.start()

mailListener.on("server:connected", () => {
	console.log("imap Connected")
})

mailListener.on("server:disconnected", () => {
	console.log("imap Disonnected")
	console.log("exiting imap.js process")
	process.exit(1)
})

mailListener.on("mail", async (mail, seqno, attributes) => {
	/**
	 * Listen for incoming mails,
	 * Look only for emails with subject containing "property match"
	 * Find links in that email
	 * Find a specific link (/Live/Pages/Public)...
	 * Check if link is not expired
	 * Call mlsScrape
	 */

	const result = mail.subject.match(/property match/i)
	if (result) {
		const matches = mail.html.match(/\bhttp?:\/\/\S+/gi);
		if (matches !== null) {
			const match = matches[0].slice(0, -1).replace(/&amp;/g, '&').replace(/"/g, '')
			
			if (~match.indexOf('torontomls.net/Live/Pages/Public')) { 
				xvfb.start(async function(err, xvfbProcess) {
					console.log(`Calling mlsLinkToDb`)
					try {
						await mlsLinkToDb(match)
						console.log(`Finished mlsLinkToDb`)
						xvfb.stop(function(err) {});
						console.log(`xvfb stop called`)
					} catch(e) {
						console.log(e)
						process.exit(1)
					}
				})
			}
		}
	}
})
