import { useState, useRef, useMemo, useEffect } from 'react';


//generate all values 
let Cfact = [];
let Nfact = [];
let Ifact = [];
let capfact = [];
let currfact = [];
let factprint = [];

getfacts();



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }



async function getfacts(){
const factres = await fetch("https://restcountries.com/v3.1/all");
const data = await factres.json();
Cfact = data.map((fact) => { //names
    return fact.name.common;
});

Nfact = data.map((fact) => { //continents
    return fact.continents;
});

Ifact = data.map((fact) => { //flag
    return fact.flags.png;
});

capfact = data.map((fact) => { //capital
    return fact.capital;
});

currfact = data.map((fact) => { //currency
    
    return fact.currencies;
});


factprint = data.map((fact) => {// total array
    return fact;
});
 

}

 export function GenGameHint(whichfact) {
   var roll = getRandomInt(249);

    const outfactcountries = [Cfact];
    const outfactcapital = [capfact];
    const outfactflag = [Ifact];
    const outfactcontinent = [Nfact];
    const outfactcurrency = [currfact];
    //var randomcountry1 = outfactcountries[0][roll];
    let [randomcontinent, setContinent] = useState(outfactcontinent[0][roll]);
    let [randomcountryflag, setCountryflag] = useState(outfactflag[0][roll]);
    let [randomcurrency, setcurrency] = useState(outfactcurrency[0][roll]);
    //const currdata = Object.values(randomcurrency)[0].name;
    let [randomcapital, setRandomcapital] = useState(outfactcapital[0][roll]);
//get the relevant info


useEffect(() => {
   window.localStorage.setItem('savepls', JSON.stringify(randomcontinent));
  });

    // onclick = (correct) => {
    //  //if the value of correct is true then reroll the values with the set___value thing  
    //}


    if (whichfact === 1){

    return [randomcontinent, setContinent];

    }
    else if (whichfact === 2){
        return randomcapital;
    }
    else if(whichfact ===3){
       

    }
    else if (whichfact === 4){
    //console.log(randomcountryflag);
    return randomcountryflag;
    }

    return [randomcontinent];
   // console.log(randomcountry1);
}