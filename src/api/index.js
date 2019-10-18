import Vue from 'vue';

const req = require.context('./module', false, /\.js$/);
const api = {};

req.keys().forEach(key => {
	let val = req(key);
	key = key.substring(2, key.length - 3);
	api[key] = val;
});

Vue.prototype.$api = api;