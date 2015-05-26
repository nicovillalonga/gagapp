var cronJob = require('cron').CronJob;
var users = require('./users');
var config = require('../../config');

//Runs every Monday at 03:00 a.m. 
new cronJob('00 00 03 * * 1', function(){
  try {    
    users();
  } catch(err) {
    console.err(err.message);
  }
}, function () {
    console.log("cron finish");
   }, 
   true, 
   null
);