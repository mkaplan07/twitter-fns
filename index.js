// https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
const dotenv = require('dotenv');
dotenv.config();

const twitter = require('twitter-lite');
const client = new twitter({
  version: '2', // v2
  extension: false, // v2
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.token_secret,
  bearer_token: process.env.bearer_token
});

function printMetrics(id) {
  client.get(`users/${id}/tweets`, {
      exclude: 'replies',
      'tweet.fields': 'public_metrics'
      // TODO: max_results?
    })
    .then(obj => {
      obj.data.forEach(obj => {
        console.log(obj.text);
        console.log(`${JSON.stringify(obj.public_metrics)}\n`);
        // TODO: extract the retweets, replies, likes, and quotes
      })
    })
    .catch(console.error);
}

function getMetrics(username) {
  client.get(`users/by/username/${username}`, {
      'tweet.fields': 'author_id'
    })
    .then(obj => {
      return obj.data.id;
    })
    .then(id => {
      printMetrics(id);
    })
    .catch(console.error);
}

getMetrics('bengoertzel');
