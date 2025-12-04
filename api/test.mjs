//update boxes so value cannot be seen by highlighting it
//save data so player cannot play again from same browser
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

        console.log(currDate + ": Data loaded successfully.");
    }
    catch(error){
        console.log(error);
    }


export default function handler(req, res) {
  res.status(200).json({ countrynames, continentnames, flagImg, capitalnames, countryLanguages });
}
