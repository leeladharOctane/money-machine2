'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var schedule = require('node-schedule');

var app = module.exports = loopback();
console.log("getting started.......");
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
schedule.scheduleJob('40 * * * * *',function(){
  var currentDate = new Date();
  console.log("job scheduled at every 40th second",currentDate.getSeconds());
  var moneyMachine = loopback.getModelByType("MoneyMachine");
  moneyMachine.changePermitStatus();
})
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
