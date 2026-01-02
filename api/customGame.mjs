//add mod function to make custom games
//save data so player cannot play again from same browser
//watch equal signs 

// fetch(`/api/test?value=123`)
//   .then(res => res.json())
//   .then(console.log);
// then 
// you might not even need to have a new api just use test
// you dead could just check the ?value and if it exists then find the key and return the country

let countrynames = [];
let continentnames = [];
let flagImg = [];
let capitalnames = [];
let countryLanguages = [];

const currDate = new Date().toISOString().slice(0, 10);
  
try{
        const factres = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,capital,flags,languages,continents");
        const data = await factres.json();
        countrynames = data.map(fact => fact.name.common);
        continentnames = data.map(fact => fact.continents);
        flagImg = data.map(fact => fact.flags.png);
        capitalnames = data.map(fact => fact.capital);
        countryLanguages = data.map(fact => fact.languages);

        console.log(currDate + ": Custom data loaded successfully.");
    }
    catch(error){
        console.log(error);
    }

export default function handler(req, res) {
  // If no internal header → user visited in browser → redirect to homepage
  if (!req.headers["x-internal-request"]) {
    return res.redirect(302, "/");
  }

  // Otherwise, allow API logic
  const { value } = req.query;

  let customCountryNames = countrynames[value];
  let customContinentNames = continentnames[value];
  let customFlagImg = flagImg[value];
  let customCapitalnames = capitalnames[value];
  let customCountryLanguages = countryLanguages[value];

  console.log("value prop: " + value, " country:", countrynames[value]);
  console.log(customCountryNames, customContinentNames, customFlagImg, customCapitalnames, customCountryLanguages);

  res.status(200).json({ customCountryNames, customContinentNames, customFlagImg, customCapitalnames, customCountryLanguages });
}