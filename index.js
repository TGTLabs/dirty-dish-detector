require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 8100;
const request = require('request');


const app = express();

const incomingWebhookURL = process.env.SLACK_WEBHOOK_URL;

let messageTemplate = {
	"username": "Afsoon",
	"channel": "bot",
	"icon_emoji": ":rage:",
	"text": "Really?????"
}

app.post('/push/img', (req, res) => {
	let img_url = req.body.img_url;
	request(incomingWebhookURL, function(err, res, body) {  
		if (err) {
			console.error(err);
		}
	    
		}
	});

});

app.listen(port, () => {
	console.log(`server listening on ${port}`);
});