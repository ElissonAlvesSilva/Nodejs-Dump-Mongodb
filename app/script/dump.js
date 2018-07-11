const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const mail = require('../service/mail');

const dbConfig = require('../config/database-config');
const dbOptions = dbConfig.db.dbOptions;

exports.stringToDate = (dateString) => {
    return new Date(dateString);
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
        currentDate = this.stringToDate(date); // Current date
        var newBackupDir = date.getHours() + ':' + date.getHours() + '-' + currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process

        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' ' + dbOptions.typeFile + ' --out ' + newBackupPath; // Command for mongodb dump process

        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                var dateNow = new Date();
                currentDate = new Date(dateNow); // Current date
                //send feedback email
                let date = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getFullYear();
                let hour = dateNow.getHours() + ':' + dateNow.getMinutes();
                mail.send_mail_backup_feedback(dbOptions.emailFeedback, date, hour);
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) {});
                    }
                }
            }
        });
    }
}