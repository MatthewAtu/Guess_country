//roll one daily game 
//send the date to the front end and store it in the local storage on page load it sees the date in the storage and loads the country
//save data so player cannot play again from same browser
//get date make it a number then add a secret key to it using sha256
//use mod(195) for the hash to make sure it is a valid index
//base URL should route to daily game

import { createClient } from 'redis';

let countrynames = [];
let continentnames = [];
let flagImg = [];
let capitalnames = [];
let countryLanguages = [];

const now = new Date();

const UTCdate = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours(),
  now.getUTCMinutes(),
  now.getUTCSeconds()
);

const currDate = new Date(UTCdate).toISOString();

    const loadCountryData = async () => {
      try {
        const factres = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,capital,flags,languages,continents");
        const data = await factres.json();

        countrynames = data.map(fact => fact.name.common);
        continentnames = data.map(fact => fact.continents);
        flagImg = data.map(fact => fact.flags.png);
        capitalnames = data.map(fact => fact.capital);
        countryLanguages = data.map(fact => fact.languages);

        console.log(currDate + ": daily data loaded successfully.");
      } catch (error) {
        console.log("Country data load error:", error);
      }
    };

    await loadCountryData();

    const readDB = async (key) => {
      try{
        const redis = createClient({ url: process.env.guess_country_daily_REDIS_URL });

        redis.on("error", err => console.log("Redis Client Error:", err));
        await redis.connect();
        console.log("Redis Read connected!");
       

        if (key === "currentDayIndex"){
          return Number(await redis.get("currentDayIndex"));
        }else if (key === "DailyCompleteStatus"){
          return await redis.get("DailyCompleteStatus");
        }
              
        await redis.quit();

        

      }catch(err) {
        console.error("callDB error:", err);
      }  
    }

    const writeDB = async (key, value) => {
      try{
        const redis = createClient({ url: process.env.guess_country_daily_REDIS_URL });

        redis.on("error", err => console.log("Redis Client Error:", err));
        await redis.connect();
        console.log("Redis Write connected!");

        switch (key) {
          case "currentDayIndex":
            await redis.set("currentDayIndex", value);
            console.log("wrote: ", await redis.get(key));
          break;

          case "DailyCompleteStatus":
            await redis.set("DailyCompleteStatus", value);
            console.log("wrote: ", await redis.get(key));
          break;
          default:
            console.log(`${key}`, "is an invalid key.");
            break;
        }
              
        await redis.quit();

      }catch(err) {
        console.error("callDB error:", err);
      }  
    }

    const getDateIndex = () => {
      const anchor = Date.UTC(2025, 0, 1, 0, 0, 0, 0);
      const now = new Date();

      const UTCnow = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );

      const msPerDay = 1000 * 60 * 60 * 24;
      const dayNumber = Math.floor((UTCnow - anchor) / msPerDay);

      return ((dayNumber % 195) + 195) % 195;;
    }

export default async function handler(req, res) {
  if (!req.headers["x-internal-request"]) {
    return res.redirect(302, "/");
  }

  let keys = {
    dailyIndex: "currentDayIndex",
  }

  var countryIndex = getDateIndex();
  const lastIndex = await readDB(keys.dailyIndex);

  console.log("country:", lastIndex, countryIndex);
  
  if (lastIndex !== countryIndex){
    await writeDB(keys.dailyIndex, countryIndex);
  }
  

  let dailyCountryNames = countrynames[countryIndex];
  let dailyContinentNames = continentnames[countryIndex];
  let dailyFlagImg = flagImg[countryIndex];
  let dailyCapitalnames = capitalnames[countryIndex];
  let dailyCountryLanguages = countryLanguages[countryIndex];


  console.log(dailyCountryNames, dailyContinentNames, dailyFlagImg, dailyCapitalnames, dailyCountryLanguages);

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ dailyCountryNames, dailyContinentNames, dailyFlagImg, dailyCapitalnames, dailyCountryLanguages});
}