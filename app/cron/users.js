var User = require('../models/user'),
    async = require('async');

module.exports = function() {
  async.parallel([
      function getUnvalidatedUsers(){
          //2 days less than today
          var date = new Date(Date.now() - 1000 * 3600 * 60).toISOString();
          console.log(date);
          User.remove({validated: {$ne: true}, createdDate: {$lt: date}}, function(err, user) {
			  if (err) throw err;				
              console.log("Users removed: " + user);  
				//res.json(user);
			});        
          
      }      
  ], 
    function doneWithCron(err) {
      if(err) return console.log(err.text);
      console.log("Done deleting unvalidated users");
    });
  }