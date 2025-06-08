import { useState, useEffect } from 'react';
import GameHints from './gamehints';
import SearchbarComponent from './searchbar';
import React from 'react';

//here the values will be displayed


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



function usePersistedState(key, initialValue) {
    // Retrieve the initial value from localStorage
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        try{
           return storedValue ? JSON.parse(storedValue) : initialValue; 
        } catch{
            console.error(`Error parsing localStorage key "${key}":`);
            return initialValue;
        }
        
    });

    // Update localStorage whenever the state changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}


function GenGameHints(){ //add a check to see whether one of the facts are undefined if so reroll
    const [dataLoaded, setDataLoaded] = useState(false);

    //state variables hold all country facts
    const [countrynames, setCountryname] = useState([]);
    const [continentnames, setContinentname] = useState([]);
    const [capitalnames, setCapitalname] = useState([]);
    const [flagsimgs, setFlagsimg] = useState([]);
    const [languagesnames, setLanguagesname] = useState([]);

useEffect(() => { 
    async function getfacts(setDataLoaded){
    try{
        const factres = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,capital,flags,languages,continents");
        const data = await factres.json();
        
            setCountryname(data.map(fact => fact.name.common));  //names )  
            setContinentname(data.map(fact => fact.continents));
            setFlagsimg(data.map(fact => fact.flags.png));
            setCapitalname(data.map(fact => fact.capital));
            setLanguagesname(data.map(fact => fact.languages));

            setDataLoaded(true); // Mark data as loaded
    }
    catch(error){
        console.log(error);
    }
    
    }
    getfacts(setDataLoaded); // Call the function to fetch data
}, []); // Run once on component mount
   
    function hidehints(){
        const hintBox1 = document.getElementById("hintBox1");
        const hintBox2 = document.getElementById("hintBox2");
        const hintBox3 = document.getElementById("hintBox3");
        const hintBox4 = document.getElementById("hintBox4");

        if (hintBox1) hintBox1.classList.add("hidden");
        if (hintBox2) hintBox2.classList.add("hidden");
        if (hintBox3) hintBox3.classList.add("hidden");
        if (hintBox4) hintBox4.classList.add("hidden");
    }

    
   

    //use the usePersistedState hook to save the roll and country
    const [currentRoll, setRoll] = usePersistedState("roll" , null);
    const [currentcountry, setcountry] = usePersistedState("currentcountry", null);
    const [currentcontinent, setcontinent] = usePersistedState("currentcontinent", null); // get and save contient
    const [currentcapital, setcapital] = usePersistedState("currentcapital", null);//get and save capital
    const [currentlanguage, setlanguage] = usePersistedState("currentlanguage", null);//get and save language
    const [currentflag, setflag] = usePersistedState("currentflag", null);//get and save language

   

    useEffect(() =>{
        if (dataLoaded && !currentRoll && !currentcountry && !currentcontinent && !currentcapital && !currentlanguage && !currentflag) { // if the data is loaded and the roll is null, set the roll
            let roll = getRandomInt(countrynames.length);
            setRoll(roll);
            setcountry(countrynames[roll]);
            setcontinent(continentnames[roll]);
            setcapital(capitalnames[roll]);
            setlanguage(languagesnames[roll]);
            setflag(flagsimgs[roll]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLoaded]); // when the component mounts, set the roll

function setroll(changevalue){
        if (changevalue === true || currentcountry === undefined ){
            var roll = getRandomInt(249);
            setRoll(roll);
            setcountry(countrynames[roll]);
            setcontinent(continentnames[roll]);
            setcapital(capitalnames[roll]);
            setlanguage(languagesnames[roll]);
            setflag(flagsimgs[roll]);
            hidehints(); 
           } 
        }

useEffect(() => {
        // Hide hints when the component mounts
        hidehints();
        setroll(false); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    if (!dataLoaded) {
        return <div>Loading...</div>;
    }

    return ( 
        <div>
            <SearchbarComponent changeroll={setroll} resetHidden={hidehints} />
            <GameHints roll={currentRoll} country={currentcountry} continent={currentcontinent} capital={currentcapital} language={currentlanguage} flag={currentflag} />
        </div>
    )
}

export default GenGameHints;