require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const port = process.env.PORT || 8100;
const request = require('request');
const bodyParser = require('body-parser');
const token = process.env.SLACK_TOKEN;
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const incomingWebhookURL = process.env.SLACK_WEBHOOK_URL;
const Jimp = require('jimp');
const Promise = require('promise');
const app = express();
app.use(bodyParser.json());

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, './www/index.html'));
});

var messageTemplate = {
	"username": "mugshots",
	"channel": "bot", //TODO Update Channel
	"icon_emoji": ":mugshots:",
}

app.post('/upload', upload.single('mugshot'), (req, res) => {

	let message = {};
	for (let key in messageTemplate) {
		message[key] = messageTemplate[key];
	}
	let msgAttachments = [];
	msgAttachments.push({
		"title": "Shame on you!",
		"text": "for leaving dirty dishes in the kitchen sink!",
		// "image_url": img_url
		"callback_id": "wopr_game",
    "color": "#e60000",
    "attachment_type": "default",
    "actions": [{
	    "name": "game",
	    "text": "Approve",
	    "type": "button",
	    "value": "yes",
	    "confirm": {
	        "title": "Are you sure?",
	        "text": "Wouldn't you prefer a good game of chess?",
	        "ok_text": "Yes",
	        "dismiss_text": "No"
	    }
    },{
    	"name": "game",
    	"text": "Deny",
    	"type": "button",
    	"value": "no"
    }]
	}); 
	message["attachments"] = msgAttachments;
	_post(incomingWebhookURL, message)
	.then(() => {
			request.post({
			    url: 'https://slack.com/api/files.upload',
			    formData: {
			        token: token,
			        title: "WANTED!",
			        // filename: "", //TODO Maybe sth with the name of the person?
			        filetype: "auto",
			        channels: "#bot",
			        initial_comment: "Here's a headshot of the worst team member of the month!",
			        file: fs.createReadStream(req.file.path)
			    },
			}, function (err, response) {
				if (err) {
					console.log('Failure posting image', err);
				} else {
			    res.status(200).redirect('/');
				}
			});
	}).catch((err) => {
		console.log('Failed post request. Status code = ', res.statusCode);
	});

});


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



// app.post('/push/img', (req, res) => {
// 	let message = {};
// 	for (let key in messageTemplate) {
// 		message[key] = messageTemplate[key];
// 	}
// 	let msgAttachments = [];
// 	msgAttachments.push({
// 		"title": "Shame on you!",
// 		"text": "for leaving dirty dishes in the kitchen sink! \nHere's a headshot of the worst employee of the month!",
// 		// "image_url": img_url
// 		"callback_id": "wopr_game",
//     "color": "#3AA3E3",
//     "attachment_type": "default",
//     "actions": [{
// 	    "name": "game",
// 	    "text": "Approve",
// 	    "type": "button",
// 	    "value": "yes"
//     },{
//     	"name": "game",
//     	"text": "Deny",
//     	"type": "button",
//     	"value": "no"
//     }]
// 	}); 
// 	message["attachments"] = msgAttachments;
// 	_post(incomingWebhookURL, message)
// 	.then(() => {
// 		res.sendStatus(200);
// 	}).catch((err) => {
// 		console.log('Failed post request. Status code = ', res.statusCode);
// 	});
// });




app.listen(port, '0.0.0.0' ,() => {
	console.log(`server listening on ${port}`);
});

