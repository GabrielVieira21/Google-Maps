const express = require('express');
const puppeteer = require('puppeteer');
const app = express()
const path = require("path");




/// scroll para pegar mais requisições , pupeetieer !!
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                const element = document.querySelectorAll('.ecceSd')[1];
                var scrollHeight = element.scrollHeight;
                element.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function parsePlaces(page){
  let places = [];  
 

  const elements = await page.$$('.UaQhfb');
  if(elements && elements.length){
      for(const el of elements){
          const name = await el.evaluate(span => span.textContent);
          
          places.push({ name });
      }
  }

  return places;
}

async function goToNextPage(page){
    await page.click('button[aria-label= "Próxima página"]');
    await page.waitForNetworkIdle();

}

(async function (request, response) {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setViewport({
      width: 1300,
      height: 900,
      
    });
    
    
  await page.goto(`https://www.google.com.br/maps/search/vidraçaria`);
  
  
  let places = [];
  do{
    
  await autoScroll(page);

  places = await parsePlaces(page);

  await goToNextPage(page);
  console.log(places); 
} while(true)

})();

