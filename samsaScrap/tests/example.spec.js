const { chromium } = require('playwright');
const crypto = require('crypto');
// const express = require('express')
const axios = require('axios');


// const app = express();
// CONFIG
const CONFIG = {
  eu: {
    baseUrl: 'https://eubank.kz/promotions',
    cardLinks: '.elementor-post__title a',
    cardTexts: '.elementor-section-wrap',
    pagination: 'https://eubank.kz/promotions/?page='
  },
  halyk: {
    baseUrl: 'https://halykbank.kz/promo',
    cardLinks: '#stock-wrap a',
    cardTexts: '.content-inner-editer .mb-10',
    pagination: null,
  },
  home: {
    baseUrl: 'https://home.kz/press-center/actions',
    cardLinks: 'a[am-link-button]',
    cardTexts: 'div[itemscope]',
    pagination: null  
  },
  jmart: {
    baseUrl: 'https://jmart.kz/promotions',
    cardLinks: '.jbYSvw a',
    cardTexts: '.kPhZXs',
    pagination: null
  },
};

// INITIALIZATION
function isRelativeUrl(url) {
  return /^(\/|\.\.?\/)/.test(url);
}

if (process.argv.length <= 2) {
  console.log("Использование: node run.js <параметр>");
  process.exit(-1);
}

const parameter = process.argv[2];

console.log(parameter)

function hashText(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
}

// MAIN
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Получаем ссылки
  async function scrapeCardLinks() {
    try {
      const cards = await page.$$(CONFIG[parameter].cardLinks);
      const links = [];
      for (const card of cards) {
        const link = await card.getAttribute('href');
        const currentUrl = await page.evaluate(() => window.location.href); 
        const cleanLink = new URL(link, currentUrl)
        links.push(String(cleanLink));
      }
      if (links.length>0) {
        return links;
      }
      else return null
    }
    catch (e) {
      console.log(e)
    }
    
  }

  // Получаем текст
  async function scrapeCardTexts(links) {
    const texts = [];
    if (!links) return
    try {
      for (const link of links) {
          await page.goto(link);
        
        const text = await page.textContent(CONFIG[parameter].cardTexts, {timeout: 5000})
        if(!text.length) {
          return null
        }
        const normalizedText = text.trim().replace(/\s+/g, ' ').trim();
        const hash = hashText(normalizedText);
        texts.push({ hash, article: normalizedText });
      } 
      return texts;
    }
    catch (e) {
      console.log(e)
      return null
    }
  }
  

  let allCardTexts = [];

  let currentPage = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    if (CONFIG[parameter].pagination) {
      await page.goto(CONFIG[parameter].pagination + currentPage);
    } else {
      hasNextPage = false;
      await page.goto(CONFIG[parameter].baseUrl)
    }
    const cardLinks = await scrapeCardLinks();
    const cardTexts = await scrapeCardTexts(cardLinks);

    if(cardTexts) allCardTexts = allCardTexts.concat(cardTexts);

    if (cardLinks) {
      currentPage++;
    } else {
      hasNextPage = false;
    }
  }

  // Закрываем браузер
  await browser.close();

  const chunkSize = 300; // Максимальный размер пакета
const evenChunks = allCardTexts.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / 2);
    if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = []; 
    }
    const currentItemLength = item.length;
    if (chunks[chunkIndex].reduce((total, text) => total + text.length, 0) + currentItemLength <= chunkSize) {
        chunks[chunkIndex].push(item); 
    } else {
        chunks.push([item]); 
    }
    return chunks;
}, []);

const url = 'http://localhost:3000/bot/gemini'; // Example URL for a server running on port 3000

evenChunks.forEach(async (chunk) => {
  try {
    // Extracting hash and article from each item in the chunk
    const requests = chunk.map(({ hash, article }) => {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Sending POST request for each hash-article pair
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            axios.post(url, { hash, article }, options)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        }, 60000); // 20000 milliseconds delay between each request
        // 1000 milliseconds delay between each request
        });
    });

    // Wait for all requests to complete before processing the next chunk
    await Promise.all(requests);
  } catch (error) {
    console.error('Error processing chunk:', error);
  }
});

})();
