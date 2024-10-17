import { useState, useRef, useMemo, useEffect } from 'react';
//current issue: find away to make the fact arrays globally accesible
//make getfacts() take the api data then pass the data into another function that puts the data into arrays then pass the data to a final array that sends the data to gamehints
//generate all values 
let Cfact = [];
let Nfact = [];
let Ifact = [];
let capfact = [];
let currfact = [];
let factprint = [];
let example = [];



getfacts();


function getRandomInt(max) {
        return Math.floor(Math.random() * max);
  }
 var roll = getRandomInt(249);

function FactsComponent(){
    const [facts, setfacts] = useState([]);
    useEffect (() =>{
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

setfacts[Nfact, Ifact, capfact, factprint];
}
getfacts();

}, []);
}

function returndata(num , data){
    let returnarr = [];
    

switch(num){
    case 1:

    break;

    case 2:
    console.log(2);
    //returnarr = factss;
    let factss = getfacts();
    console.log(factss[0]);
    break;

    case 3:
    console.log(3);

        break;
    case 4:
      
        break;
    case 5:
    
        break;
    case 6:
 
        break;
    
}

return returnarr;
}

 export function GenGameHint(whichfact) {

    const outfactcountries = [Cfact];
    const outfactcapital = [capfact];
    const outfactflag = [Ifact];
    const outfactcontinent = returndata(2);
    const outfactcurrency = [currfact];
    
    //console.log(outfactcapital);
    //var randomcountry1 = outfactcountries[0][roll];
    let [rollnumber, setrollnumber] = useState(roll);
    let [randomcontinent, setContinent] = useState(300);
    let [randomcountryflag, setCountryflag] = useState(outfactflag[rollnumber]);
   // let [randomcurrency, setcurrency] = useState(outfactcurrency[0][roll]);
    //const currdata = Object.values(randomcurrency)[0].name;
    let [randomcapital, setRandomcapital] = useState(outfactcapital[0][rollnumber]);
    //console.log(randomcountryflag);

    
useEffect (()=>{
    setCountryflag(outfactflag[0][70]);
   
}, [])

 //console.log(roll);
    if (randomcountryflag !== outfactflag[70]){
        setContinent(outfactflag[roll]);
        
    }

    useEffect(() => {
        const contin = window.localStorage.getItem('savepls');
        const theroll = window.localStorage.getItem('theRandomroll');
       // setContinent(JSON.parse(contin));
        setrollnumber(JSON.parse(theroll));
        
    }, []);

    useEffect(() => {
    window.localStorage.setItem('savepls', JSON.stringify(randomcontinent));
    window.localStorage.setItem('theRandomroll', JSON.stringify(roll));
   });

    // onclick = (correct) => {
    //  //if the value of correct is true then reroll the values with the set___value thing  
    //}


    if (whichfact === 1){

    return [randomcontinent];

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