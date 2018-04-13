const nodemailer = require('nodemailer')
const pw = require('../special').gpw

const sendMail = (url, address, caprate) => {
	let transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
				user: 'realpropertynumbers@gmail.com',
				pass: 'torontotoronto'
		},
		tls:{
			rejectUnauthorized:false
		}
	});

	let msg = `
		<p>A property of interest.</p>
		<p>${address}</p>
		<p>Cap rate: ${caprate}</p>
		<a href="${url}">${url}</a>
	`

	let mailOptions = {
		from: '"Real Property Numbers" <realpropertynumbers@gmail.com>',
		to: 'michaellombardi29@gmail.com', 
		subject: `New property, cap rate: ${caprate}`,
		text: 'A property of interest.', 
		html: msg
	};

	transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
		}
		console.log(`${address} sent to michaellombardi29@gmail.com`);
	});
}

module.exports = sendMail