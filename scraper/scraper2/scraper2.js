const axios = require('axios');
const fs = require('fs');

// Function to scrape data from Website 2
async function scrapeWebsite2() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/2');
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error scraping Website 2:', error);
        return null;
    }
}

// Main function
async function main() {
    const scrapedData = await scrapeWebsite2();
    if (scrapedData) {
        console.log(scrapedData)
        fs.writeFileSync('./output/data2.json', JSON.stringify(scrapedData));
        console.log('Scraping of Website 2 complete.');
    }
}

main();
