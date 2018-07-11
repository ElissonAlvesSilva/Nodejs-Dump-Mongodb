let dbOptions =  {
    user: '<databaseUsername>',
    pass: '<databasePassword>',
    host: 'localhost',
    port: 27017,
    database: '<databaseName>',
    autoBackup: true, 
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    typeFile: '--gzip',
    autoBackupPath: '<serverPath>',
    emailFeedback: '<email>'
 
};

exports.db = {
    dbOptions
}