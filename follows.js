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

// https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck
function getFollowing(id) {
  let following = [];
  client.get(`users/${id}/following`, {
    'max_results': '10',
    // 'pagination_token': 'next_token',
    'user.fields': 'public_metrics'
  })
  .then(results => {
    if (results.meta.result_count > 0) {
      results.data.forEach(obj => {
        following.push([obj.username, obj.public_metrics.followers_count]);
      })
      following.sort((a, b) => b[1] - a[1]);
      console.log(following);
      console.log(following.length);
    } else {
      console.log('Not following');
    }
    console.log(results.meta.next_token);
  })
  .catch((e) => {
    console.log(`Something went wrong –\n`, e)
  })
}

function getFollowers(id) {
  let followers = [];
  client
  .get(`users/${id}/followers`, {
    'max_results': '10',
    // 'pagination_token': 'next_token',
    'user.fields': 'public_metrics'
  })
  .then(results => {
    if (results.meta.result_count > 0) {
      results.data.forEach(obj => {
        followers.push([obj.username, obj.public_metrics.followers_count]);
      })
      followers.sort((a, b) => b[1] - a[1]);
      console.log(followers);
      console.log(followers.length);
    } else {
      console.log('No followers');
    }
    console.log(results.meta.next_token);
  })
  .catch((e) => {
    console.log(`Something went wrong –\n`, e)
  })
}

// ultimately, would be followers by # followers then following by # followers
function getFollows(username) {
  client.get(`users/by/username/${username}`)
  .then(response => {
    return response.data.id;
  })
  .then(id => {
    getFollowing(id);
    getFollowers(id);
  })
  .catch((e) => {
    console.log(`Something went wrong –\n`, e)
  })
}
getFollows('bengoertzel');
