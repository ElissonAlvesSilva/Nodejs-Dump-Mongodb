const CronJob = require('cron').CronJob;

const Cron = require('../script/dump');

new CronJob('0 0 0 * * *', () => {
    Cron.dbAutoBackUp();
}, null, true, 'America/New_York');