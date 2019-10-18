import Vue from 'vue';

const req = require.context('./module', false, /\.js$/);
const allocation = {};

req.keys().forEach(key => {
	let val = req(key);
	key = key.substring(2, key.length - 3);
	allocation[key] = val;
});

Vue.prototype.$g = allocation;