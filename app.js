const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const rp = require('request-promise-native');

const OAuth = require('oauth');
const OAuth2 = OAuth.OAuth2;    
const oauth2 = new OAuth2(config.slack.client_id,
	config.slack.client_secret,
	'https://slack.com/', 
	'oauth/authorize',
	'api/oauth.token', 
	null);

const { WebClient } = require('@slack/client');

const app = express();

app.engine('hb', exphbs({
	defaultLayout: 'main',
	extname: 'hb'
}));

app.set('view engine', 'hb');
app.enable('view cache');

app.use(express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.render('home', {
		slack: config.slack
	});
});

app.get('/install', function (req, res) {
	res.redirect('https://slack.com/oauth/authorize?client_id=' + config.slack.client_id + '&scope=commands');
});

app.post('/command', function (req, res) {

	if (req.body.token != config.slack.verification_token){
		return res.sendStatus(401);
	}

	const responseUrl = req.body.response_url;

	res.status(200).send();

	rp({
		uri: responseUrl,
		json: true,
		method: 'POST',
		body: {
			"text": " \n".repeat(50),
			"response_type": "in_channel",
		}
	}).catch(function(e) {
		console.log(e);
	});

});

app.get('/oauth', function (req, res) {

	oauth2.getOAuthAccessToken(
		req.query.code,
		{'grant_type':'client_credentials'},
		function (e, access_token, refresh_token, results) {

			if (e) {
				return res.sendStatus(500);
			}

			res.redirect('https://slack.com/app_redirect?app=' + results.app_id + '&team=' + results.team_id);

			let web = new WebClient(results.access_token);
			web.chat.postMessage({ channel: results.authorizing_user_id, text: 'Thanks for installing Clear. You can clear the screen by typing `/clear`, try it now.' });

		}
	);

});

app.listen(config.port, function () {
	console.log('Server started on port ' + config.port + '.');
});