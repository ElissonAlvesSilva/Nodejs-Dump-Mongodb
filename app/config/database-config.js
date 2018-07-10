export const dbOptions =  {
    user: '<databaseUsername>',
    pass: '<databasePassword>',
    host: 'localhost',
    port: 27017,
    database: '<databaseName>',
    autoBackup: true, 
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: '<serverPath>' // i.e. /var/database-backup/
};