const { exec } = require("child_process");
const moment = require('moment');
const config = require("../config/config")
const logger = require('../config/logger');

function parseConnectionString(connectionString) {
  const matches = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);

  if (matches) {
    const username = matches[1];
    const password = matches[2];
    const host = matches[3];
    const port = matches[4];
    const database = matches[5];

    return {
      username,
      password,
      host,
      port,
      database
    };
  }

  return null;
}

const backupDB = () => {
  const containerName = "hit_postgres";
  const { username, password, host, port, database } = parseConnectionString(config.dbURL);

  const currentTime = moment().format('YYYY_MM_DD_hh_mm_ss');

  const dumpCommand = `PGPASSWORD=${password} pg_dump -U ${username} -h ${host} -p ${port} -d ${database} -Z6 -Fc -f backup_${currentTime}.dump --data-only`;
  const command = `docker exec -i ${containerName} bash -c "cd /home && ${dumpCommand}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(error, { label: "backupDB" });
      return;
    }

    logger.info('Dump executed successfully', { label: "backupDB" });
    logger.debug(`stdout: ${stdout}`, { label: "backupDB" });
    logger.debug(`stderr: ${stderr}`, { label: "backupDB" });
  });
}

// pg_restore -U hit -h 127.0.0.1 -p 5432 -d hit
module.exports = { backupDB }