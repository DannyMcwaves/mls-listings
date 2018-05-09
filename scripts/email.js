const nodemailer = require('nodemailer')

const michael = 'michaellombardi29@gmail.com'

const sendMail = (url, address, caprate) => {
	let transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
				user: 'realpropertynumbers@gmail.com',
				pass: 'torontotdot'
		},
		tls:{
			rejectUnauthorized:false
		}
	});

	let msg = `
		<p>A property of interest.</p>
		<p>${address}</p>
		<p>Cap rate: ${caprate}</p>
		<a href="http://realpropertynumbers.com">realpropertynumbers.com</a>
	`

	let mailOptions = {
		from: '"Real Property Numbers" <realpropertynumbers@gmail.com>',
		to: michael, 
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
