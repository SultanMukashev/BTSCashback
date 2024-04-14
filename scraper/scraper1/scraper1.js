const axios = require('axios');
const fs = require('fs');

// Function to scrape data from Website 1
async function scrapeWebsite1() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        const data = response.data;
        console.log('Something')
        return data;
    } catch (error) {
        console.error('Error scraping Website 1:', error);
        return null;
    }
}

// Main function
async function main() {
    const scrapedData = await scrapeWebsite1();
    console.log('Something');
    if (scrapedData) {
        console.log(scrapedData)
        fs.writeFileSync('./output/data1.json', JSON.stringify(scrapedData));
        console.log('Scraping of Website 1 complete.');
    }
}

main();


