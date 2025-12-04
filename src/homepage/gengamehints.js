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

    // const [hideHints, setHideHints] = useState({
    //     Continent: true,
    //     Capital: true,
    //     Language: true,
    //     Flag: true
    // });


    useEffect(()=>{
        fetch('/api/test.js').then(r => r.json())
        .then(data => {
            setCountryname(data.countrynames);  //names )  
            setContinentname(data.continentnames);
            setFlagsimg(data.flagImg);
            setCapitalname(data.capitalnames);
            setLanguagesname(data.countryLanguages);

            setDataLoaded(true); // Mark data as loaded
            console.log("Data loaded successfully.");
        });
    }, []);// Run once on component mount

    function hidehints(revealreset){//hide text/images too
            console.log("Hiding hints...");
            let storedCount = JSON.parse(localStorage.getItem("counter"));
            console.log("count: " + storedCount);

            // Hide all hint boxes
            const hintBox1 = document.getElementById("hintBox1");
            const hintBox2 = document.getElementById("hintBox2");
            const hintBox3 = document.getElementById("hintBox3");
            const hintBox4 = document.getElementById("hintBox4");

            if (hintBox1 && storedCount < 1) hintBox1.classList.add("hidden");
            if (hintBox2 && storedCount < 2) hintBox2.classList.add("hidden");
            if (hintBox3 && storedCount < 3) hintBox3.classList.add("hidden");
            if (hintBox4 && storedCount < 4) hintBox4.classList.add("hidden");

            if (storedCount === 5){
                if (hintBox1) hintBox1.classList.add("hidden");
                if (hintBox2) hintBox2.classList.add("hidden");
                if (hintBox3) hintBox3.classList.add("hidden");
                if (hintBox4) hintBox4.classList.add("hidden");
            }
    }

    // useEffect(()=>{
    //     hidehints();
    // }, []);

    //use the usePersistedState hook to save the roll and country
    const [currentRoll, setRoll] = usePersistedState("roll" , null);
    const [currentcountry, setcountry] = usePersistedState("currentcountry", null);
    const [currentcontinent, setcontinent] = usePersistedState("currentcontinent", null); // get and save contient
    const [currentcapital, setcapital] = usePersistedState("currentcapital", null);//get and save capital
    const [currentlanguage, setlanguage] = usePersistedState("currentlanguage", null);//get and save language
    const [currentflag, setflag] = usePersistedState("currentflag", null);//get and save language

function setroll() {
    if (
        !dataLoaded ||
        countrynames.length === 0 ||
        continentnames.length === 0 ||
        capitalnames.length === 0 ||
        languagesnames.length === 0 ||
        flagsimgs.length === 0
    ) {
        console.error("Data not loaded or arrays are empty. Cannot set roll.");
        return;
    }
    let roll = getRandomInt(countrynames.length);
    setRoll(roll);
    setcountry(countrynames[roll]);
    setcontinent(continentnames[roll]);
    setcapital(capitalnames[roll]);
    setlanguage(languagesnames[roll]);
    setflag(flagsimgs[roll]);
    hidehints();
}

useEffect(() => {
    hidehints();//true
    if (
        dataLoaded &&
        countrynames.length > 0 &&
        continentnames.length > 0 &&
        capitalnames.length > 0 &&
        languagesnames.length > 0 &&
        flagsimgs.length > 0 &&
        (
            currentRoll === null ||
            currentcountry === null ||
            currentcontinent === null ||
            currentcapital === null ||
            currentlanguage === null ||
            currentflag === null
        )
    ) {
        setroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
    dataLoaded,
    countrynames,
    continentnames,
    capitalnames,
    languagesnames,
    flagsimgs
]);

    if (!dataLoaded) {
        return <div>Loading...</div>;
    }

    return ( 
        <div>
            <SearchbarComponent changeroll={setroll} resetHidden={hidehints} usePersistedState={usePersistedState}/>
            <GameHints roll={currentRoll} country={currentcountry} continent={currentcontinent} capital={currentcapital} language={currentlanguage} flag={currentflag} />
        </div>
    )
}

export default GenGameHints;