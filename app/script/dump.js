const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const mail = require('../service/mail');
const moment = require('moment-timezone');
moment.locale("pt-BR");

const dbConfig = require('../config/database-config');
const dbOptions = dbConfig.db.dbOptions;

exports.stringToDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
        timeZone: 'America/Manaus'
    }, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).split('/').join('-');
}


function empty(mixedVar) {
    var undef, key, i, len;
    const emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};


exports.dbAutoBackUp = () => {


    if (dbOptions.autoBackup == true) {
        var date = new Date();

        var beforeDate, oldBackupDir, oldBackupPath;

        currentDate = makeDate(moment());

        var newBackupDir = currentDate;
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process

        // if (dbOptions.removeOldBackup == true) {
        //     beforeDate = _.clone(currentDate);
        //     beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
        //     oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
        //     oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        // }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' ' + dbOptions.typeFile + ' --out ' + newBackupPath; // Command for mongodb dump process

        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                let currentDate = new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Manaus'
                });
                //send feedback email
                let date = currentDate;
                mail.send_mail_backup_feedback(dbOptions.emailFeedback, date);
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) {});
                    }
                }
            }
        });
    }
}

function makeDate(_date) {
    let date = '';

    date = `${_date.year()}-${_date.month()}-${_date.date()}-${_date.hours()}:${_date.minute()}`;

    return date;
}