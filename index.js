const express = require("express");
const server = express();
const route = require("./route");
const puppeteer = require("puppeteer");
const path = require("path");
const { search } = require("./route");
server.use(route);

server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");
server.get('/', (req, res) => {

  function eventoC() {
    alert('ok');
  }  res.render("web.ejs",{eventoC});
});

/// scroll para pegar mais requisições , pupeetieer !!
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 300;
      var timer = setInterval(() => {
        const element = document.querySelectorAll(".ecceSd")[1];
        var scrollHeight = element.scrollHeight;
        element.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function parsePlaces(page) {
  let places = [];
  const elements = await page.$$(".UaQhfb");
  if (elements && elements.length) {
    for (const el of elements) {
      const name = await el.evaluate((span) => span.textContent);

      places.push({ name });
    }
  }

  return places;
}





(async function (request, response) {
  //headless:false - raspagem dos dados



  // if (!!request && !!request.query && !!request.query.search) {
  //   const { search } = request.query;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1300,
      height: 900,
    });

    await page.goto(`https://www.google.com.br/maps/search/engenheiro`);

    let places = [];
   

   

    
      do {
        await autoScroll(page);
        places = await parsePlaces(page);
        //  await goToNextPage(page);
        places = JSON.stringify(places);
        console.log(places);
        server.get("/web", (req, res) => {
          res.render("web.ejs", {
            places
          });
        });
      } while (true);
    
  
  // }
})();


server.listen(3001, function () {
  console.log("conexão de porta");
});
