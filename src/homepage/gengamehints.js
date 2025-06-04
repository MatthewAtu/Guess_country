import { useState, useEffect } from 'react';
import GameHints from './gamehints';
import SearchbarComponent from './searchbar';
import React from 'react';

//here the values will be displayed


let Cfact = [];
let Nfact = [];
let Ifact = [];
let capfact = [];
let langfact = [];
let allfact = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var roll = getRandomInt(249);

async function getfacts(){
try{
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

        langfact = data.map((fact) => {
            return fact.languages;
        });
    
        allfact = data.map((fact) => {// total array
            return fact;
        });

}
catch(error){
    console.log(error);
}
 
}
getfacts();

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
    const countryname = [Cfact];
    const continentname = [Nfact];
    const capitalname = [capfact];
    const flagsimg = [Ifact];
    const languagesname = [langfact]; 

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


    //this needs to be fully loaded before it is run
    useEffect(() => {
            hidehints();
        }, []);

    //use the usePersistedState hook to save the roll and country
    const [currentRoll, setRoll] = usePersistedState("roll" , null);
    useEffect(() =>{
        function setroll(){
            var roll = getRandomInt(249);
            setRoll(roll);
            setcountry(countryname[0][roll]);
            setcontinent(continentname[0][roll]);
            setcapital(capitalname[0][roll]);
            setlanguage(languagesname[0][roll]);
            setflag(flagsimg[0][roll]);
        }

        if (currentRoll == null){
            setroll();
        }
    }, [currentRoll, setRoll]);


    const [currentcountry, setcountry] = usePersistedState("currentcountry", null);
    useEffect(() =>{
        function setthecountry(){
            setcountry(countryname[0][currentRoll]);
        }

        if (currentcountry == null){
            setthecountry();
        }
        
    }, [currentcountry, setcountry]);

    const [currentcontinent, setcontinent] = usePersistedState("currentcontinent", null); // get and save contient
    useEffect(() =>{
        function setthecontinent(){
            setcontinent(continentname[0][currentRoll]);
        }

        if (currentcontinent == null){
            setthecontinent();
        }
        
    }, [currentcontinent, setcontinent]);

    const [currentcapital, setcapital] = usePersistedState("currentcapital", null);//get and save capital
    useEffect(() =>{
        function setthecapital(){
            setcapital(capitalname[0][currentRoll]);
        }

        if (currentcapital == null){
            setthecapital();
        }
        
    }, [currentcapital, setcapital]);

    const [currentlanguage, setlanguage] = usePersistedState("currentlanguage", null);//get and save language
    useEffect(() =>{
        function setthelanguage(){
            setlanguage(languagesname[0][currentRoll]);
        }

        if (currentlanguage == null){
            setthelanguage();
        }
        
    }, [currentlanguage, setlanguage]);

    const [currentflag, setflag] = usePersistedState("currentflag", null);//get and save language
    useEffect(() =>{
        function settheflag(){
            setflag(flagsimg[0][currentRoll]);
        }

        if (currentflag == null){
            settheflag();
        }
        
    }, [currentflag, setflag]);

    return ( 
        <div>
            <SearchbarComponent changeroll={setRoll} resetHidden={hidehints} />
            <GameHints roll={currentRoll} country={currentcountry} continent={currentcontinent} capital={currentcapital} language={currentlanguage} flag={currentflag} />
        </div>
    )
}

export default GenGameHints;