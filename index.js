require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 8100;
const request = require('request');
const bodyParser = require('body-parser');
const incomingWebhookURL = process.env.SLACK_WEBHOOK_URL;
const Promise = require('promise');
const app = express();
app.use(bodyParser.json());

function _post(url, data) {
	return new Promise((resolve, reject) => {
		let options = {
			url: url,
			method: 'POST',
			json: data
		};
		request(options, (err, res, body) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	}); 
}

var messageTemplate = {
	"username": "MugShot",
	"channel": "bot", //TODO Update Channel
	"icon_emoji": ":rage:",
}

app.post('/push/img', (req, res) => {
	let img_url = req.body.img_url;
	let message = {};
	for (let key in messageTemplate) {
		message[key] = messageTemplate[key];
	}
	let msgAttachments = [];
	msgAttachments.push({
		"title": "Shame on you!",
		"text": "for leaving dirty dishes in the kitchen sink! \nHere's a headshot of the worst employee of the month!",
		// "image_url": img_url
		"image_url": "http://localhost:8100/"
	}); 
	message["attachments"] = msgAttachments;
	_post(incomingWebhookURL, message)
	// success posting message
	.then(() => {
		res.sendStatus(200);
	// failure posting message
	}).catch((err) => {
		console.log('Failed post request. Status code = ', res.statusCode);
	});
});

app.listen(port, () => {
	console.log(`server listening on ${port}`);
});

