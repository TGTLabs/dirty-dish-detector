require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 8100;
const request = require('request');
const bodyParser = require('body-parser');
const incomingWebhookURL = process.env.SLACK_WEBHOOK_URL;
const app = express();
app.use(bodyParser.json());

function _post(url, data) {
	let options = {
		url: url,
		method: 'POST',
		json: data
	};
	request(options, (err, res, body) => {
		if (err) {
			console.log('Failed post request. Status code = ', res.statusCode);
		}
	});
}

var messageTemplate = {
	"username": "Afsoon",
	"channel": "bot2", //TODO Update Channel
	"icon_emoji": ":rage:",
	"attachments": []
}

app.post('/push/img', (req, res) => {
	let img_url = req.body.img_url;
	let message = Object.assign(messageTemplate);
	message.attachments.push({
		"title": "Shame on you!",
		"text": "Here's the worst employee of the month!",
		"image_url": img_url
	}); 
	_post(incomingWebhookURL, message);

});

app.listen(port, () => {
	console.log(`server listening on ${port}`);
});