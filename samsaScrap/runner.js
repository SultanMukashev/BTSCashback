const { exec } = require('child_process');
const cron = require('node-cron');


// Schedule a task to run every 15 minutes
cron.schedule('*/30 * * * *', () => {
    // Run the docker-compose up command
    exec('docker run scraper ', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});
