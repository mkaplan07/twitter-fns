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

function getMetrics(id) {
  let engagement = { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0 }

  client.get(`users/${id}/tweets`, {
      exclude: 'replies',
      max_results: 30,
      'tweet.fields': 'public_metrics'
    })
    .then(response => {
      response.data.forEach(obj => {
        // console.log(obj.text);
        // console.log(`${JSON.stringify(obj.public_metrics)}\n`);
        for (let k in obj.public_metrics) {
          engagement[k] += obj.public_metrics[k];
        }
      })
    })
    .then(() => {
      console.log(engagement);
    })
    .catch((e) => {
      console.log(`Something went wrong –\n`, e)
    })
}

function engager(username) {
  client.get(`users/by/username/${username}`, {
      'tweet.fields': 'author_id'
    })
    .then(obj => {
      return obj.data.id;
    })
    .then(id => {
      getMetrics(id);
    })
    .catch((e) => {
      console.log(`Something went wrong –\n`, e)
    })
}

engager('bengoertzel');
