const express = require('express');
const route = require('./route')
const puppeteer = require('puppeteer');
const server = express()
const path = require("path");



server.use(route);

server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");  



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




 server.get('/home', function (req, res){
    ;(async function (request, response) {

    //  if (!!request.places && !!request.places.search) {
    //      const {
    //        search
    //      } = request.places;
    //     }
    //headless:false - raspagem dos dados 
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setViewport({
      width: 1300,
      height: 900,
      
    });
     const search = '';
  await page.goto(`https://www.google.com.br/maps/search/${search}`);
  let places = [];

  do{

      await autoScroll(page);
      
      places = await parsePlaces(page);
      
      await goToNextPage(page);
      
      console.log(places); 
    } 
    while(true);
    
})();
 });

server.listen(3000, function(){
    console.log('conexão de porta')
}) 