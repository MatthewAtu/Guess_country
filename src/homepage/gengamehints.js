/* eslint-disable */
import { useState, useEffect } from 'react';
import GameHints from './gamehints';
import SearchbarComponent from './searchbar';
import Swal from 'sweetalert2';
import DayTimerComponent from './dayTimerComponent';
import ReactDOM from 'react-dom/client';

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

function usePersistedSessionState(key, initialValue) {
    // Retrieve the initial value from sessionStorage
    const [state, setState] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        try{
           return storedValue ? JSON.parse(storedValue) : initialValue; 
        } catch{
            console.error(`Error parsing localStorage key "${key}":`);
            return initialValue;
        } 
    });

    // Update localStorage whenever the state changes
    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];   
}

function GenGameHints(){ 
    const [dataLoaded, setDataLoaded] = useState(false);

    //state variables hold all country facts
    const [countrynames, setCountryname] = useState([]);
    const [continentnames, setContinentname] = useState([]);
    const [capitalnames, setCapitalname] = useState([]);
    const [flagsimgs, setFlagsimg] = useState([]);
    const [languagesnames, setLanguagesname] = useState([]);

    //get the URL and then decide which api to fetch daily/custom/infinite
    const params = new URLSearchParams(window.location.search);//run the 
    const gamemode = params.get("mode");
    const URLvalue = params.get("value");

    const [gCounter, setGCounter] = usePersistedState(`counter_daily`, 0);//store a count for daily gamemode, reset between switching from custom to infinite

    const [customData, setCustomData] = usePersistedSessionState("customData", {
        country: null,
        continent: null,
        capital: null,
        language: null,
        flag: null,
        roll: null
    });

    const [infiniteData, setInfiniteData] = usePersistedState("infiniteData", {
        country: null,
        continent: null,
        capital: null,
        language: null,
        flag: null,
        roll: null
    });

    const [dailyData, setDailyData] = usePersistedState("DailyData", {
        date: null,
        country: null,
        continent: null,
        capital: null,
        language: null,
        flag: null,
        roll: null
    });


    const [hintCount, setHintCount] = useState(() =>
            Number(localStorage.getItem("counter_daily")) || 0
    );
    
    const [completetionStatus, setCompletionStatus] = useState(() =>
            Boolean(localStorage.getItem("complete_status")) || 0
    );


    //daily counter need the time from the api in order to store data that only resets after the date changes
    const [lastMode, setLastMode] = usePersistedState("lastMode", "daily");
    const [lastURLValue, setLastURlValue] = usePersistedState("lastValue", null);

    useEffect(()=>{
        const newDay = new Date();

        if (completetionStatus === true && gamemode ==="daily"){
          Swal.fire({
            title: "Comeback tomorrow for a new country!",
            html: `<div id="gamecomplete-text">
                    Try playing one of the other modes.<br>
                    New country in:
                   </div>
                   <div id="gamecomplete-timer">
                   </div>`,
            didOpen: () => {
                hidehints(4);
                const root = ReactDOM.createRoot(
                    document.getElementById("gamecomplete-timer")
                );
                root.render(<DayTimerComponent/>);
            },
            allowOutsideClick: false,
            confirmButtonColor: "#000000"
        });
        }
    }, [completetionStatus, dataLoaded]);

     async function customGame(){
        const res = await fetch(`/api/customGame?mode=${gamemode}&value=${URLvalue}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-internal-request": "true"
            },
        });

        const data = await res.json();
        //load data -> set current localstorage to null -> check if localstorage is null -> put values in local storage
        //should only happen on params change

        setCountryname([data.customCountryNames]); 
        setContinentname([data.customContinentNames]);
        setFlagsimg([data.customFlagImg]);
        setCapitalname([data.customCapitalnames]);
        setLanguagesname([data.customCountryLanguages]);

        setDataLoaded(true); // Mark data as loaded
        console.log("Custom Data loaded successfully.");
    }

    async function dailyGame() {//do after 
        const res = await fetch(`/api/dailyGame`, {
            method: "POST",
            headers: { 
                "x-internal-request": "true",
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });

        const data = await res.json();

        setCountryname([data.dailyCountryNames]); 
        setContinentname([data.dailyContinentNames]);
        setFlagsimg([data.dailyFlagImg]);
        setCapitalname([data.dailyCapitalnames]);
        setLanguagesname([data.dailyCountryLanguages]);

        setDataLoaded(true); // Mark data as loaded
        console.log("Daily loaded successfully.");
    }
    
    function hidehints(counter){//hide text/images too
        const hintBoxes = [
            document.getElementById("hintBox1"),
            document.getElementById("hintBox2"),
            document.getElementById("hintBox3"),
            document.getElementById("hintBox4")
        ];

        //hide all hints
        hintBoxes.forEach(box => {
            if (!box) return;
            box.classList.add("hidden");
        });

        // Reveal only up to counter
        if (counter !== undefined){
            for (let i = 0; i < counter; i++) {
                if (hintBoxes[i]) {
                    hintBoxes[i].classList.remove("hidden"); 
                }   
            }
        }else if(gamemode === "daliy"){
            for (let i = 0; i < hintCount; i++) {
                if (hintBoxes[i]) {
                    hintBoxes[i].classList.remove("hidden"); 
                }   
            }
        }
        
    }

    function onGameComplete(){
        localStorage.setItem("complete_status", true);
           Swal.fire({
            title: "Comeback tomorrow for a new country!",
            html: `<div id="gamecomplete-text">
                    Try playing one of the other modes.<br>
                    New country in:
                   </div>
                   <div id="gamecomplete-timer">
                   </div>`,
            didOpen: () => {
                const root = ReactDOM.createRoot(
                    document.getElementById("gamecomplete-timer")
                );
                root.render(<DayTimerComponent/>);
            },
            allowOutsideClick: false,
            confirmButtonColor: "#000000"
        });
    }



    useEffect(() => {
        if (!dataLoaded) return;

        const keys = [
            "roll",
            "currentcountry",
            "currentcontinent",
            "currentcapital",
            "currentlanguage",
            "currentflag"
        ];

        const modeChange = () =>{
            if (gamemode !== lastMode){
                return true;
            }
        }

        const valueChange = () =>{
            if (URLvalue !== lastURLValue){
                return true;
            }
        }

        let missing = false;

        // Check localStorage for missing/null values
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value === null || value === "null" || value === undefined) {
                missing = true;
            }
        });

        if (modeChange() || (valueChange() && gamemode === "custom")){//use value to see if guess counter needs to be reset
            updateRoll();
            if (gamemode !== null){
                setLastMode(gamemode);
                setLastURlValue(URLvalue);
            } else{
                setLastMode("daily");
            }
        }

        if (missing) {
            updateRoll();
        } else {
            console.log("All values loaded from localStorage.");
        }
    }, [dataLoaded]);

    useEffect(() => {
        if (gamemode !== "daily") return;

        const checkDailyVal = setInterval(() => {
            //declare a get a date index here if the date index does not match the one returned then reset the local storage
            dailyGame();
            console.log("daily check");
        }, 60000);

        return () => clearInterval(checkDailyVal);
    },[gamemode]);

    useEffect(() => {
        if (!dataLoaded) return;
        if (!countrynames?.length) return;

        if (dailyData.country !== countrynames[0] && gamemode === "daily") {// change this to prevent infinite reloads add daily game storage
            console.log("daily reset");
            hidehints();
            localStorage.removeItem("complete_status");
            setGCounter(0);
            updateRoll();

            window.location.href = `${window.location.origin}/?mode=daily`;
        }
    }, [countrynames, dailyData, dataLoaded]);

useEffect(()=>{  
        console.log("Mode: ", gamemode, " Value: ", URLvalue);
        if (!window.location.search.includes("mode=")) {
            window.location.replace(
                window.location.pathname + "?mode=daily"
            );
        }

        if (gamemode === "infinite"){//this will get the null tag bc this is the default
            console.log("Mode selected: ", gamemode);
            fetch('/api/test').then(r => r.json())
            .then(data => {
                setCountryname(data.countrynames);  //names )  
                setContinentname(data.continentnames);
                setFlagsimg(data.flagImg);
                setCapitalname(data.capitalnames);
                setLanguagesname(data.countryLanguages);

                setDataLoaded(true); // Mark data as loaded
                console.log("Data loaded successfully.");
            });
        } else if(gamemode === "custom" && URLvalue < 195 && URLvalue > -1 && URLvalue !== null){
            console.log("Mode selected: ", gamemode);
            customGame();//call custom game API
        } else{
            console.log("Mode selected: ", gamemode);
            //daily
            dailyGame();
        } 
    }, [dataLoaded]);// Run on component mount


function updateRoll() {
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

        if (gamemode === "custom"){
            console.log("setting: ", gamemode);
            setCustomData({
                country: `${countrynames[roll]}`,
                continent: `${continentnames[roll]}`,
                capital: `${capitalnames[roll]}`,
                language: Object.values(languagesnames[roll]).join(", "),
                flag: `${flagsimgs[roll]}`,
                roll: `${roll}`
            });
        }if (gamemode === "infinite") {
            console.log("setting: ", gamemode);
            setInfiniteData({
                country: `${countrynames[roll]}`,
                continent: `${continentnames[roll]}`,
                capital: `${capitalnames[roll]}`,
                language: Object.values(languagesnames[roll]).join(", "),
                flag: `${flagsimgs[roll]}`,
                roll: `${roll}`
            })
        }else if(gamemode !=="custom" && gamemode !=="infinite"){
            console.log("setting: ", gamemode);
            setDailyData({
                date: "2025-01-01",
                country: `${countrynames[roll]}`,
                continent: `${continentnames[roll]}`,
                capital: `${capitalnames[roll]}`,
                language: Object.values(languagesnames[roll]).join(", "),
                flag: `${flagsimgs[roll]}`,
                roll: `${roll}`
            });
        }

        hidehints();
    }


    if (!dataLoaded) {
        return <div>Loading...</div>;
    }

    return ( 
        <div>
            <SearchbarComponent changeroll={updateRoll} resetHidden={hidehints} usePersistedState={usePersistedState} count={gCounter} setCounter={setGCounter} onGameComplete={onGameComplete}/>
            <GameHints 
                customData={customData}
                infiniteData={infiniteData}
                dailyData={dailyData}
            />
        </div>
    )
}

export default GenGameHints;