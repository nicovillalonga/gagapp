var cronJob = require('cron').CronJob;
var users = require('./users');
var config = require('../../config');

/**
 * @api {get} /cron Delete inactives users
 * @apiName Cron Delete Users
 * @apiGroup Cron
 * @apiDescription Runs every Monday at 03:00 a.m.
 *
 * @apiSuccess {String} message List all users deleted.
 */
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