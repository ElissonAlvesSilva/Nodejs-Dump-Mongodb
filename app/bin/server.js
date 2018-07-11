const CronJob = require('cron').CronJob;

const Cron = require('../script/dump');

new CronJob('* * * * * *', () => {
    Cron.dbAutoBackUp();
}, null, true, 'America/Manaus');