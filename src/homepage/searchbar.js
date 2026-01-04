import "./searchbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useInput } from "./AutocompleteComponent";
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import Swal from "sweetalert2";
import Fuse from "fuse.js";
import Homepage from "./homepage";
import PageHeader from "./pageHeader";

//import the hints then the set methods 
//here the values will be changed

    let countries =[];
        fetch('/api/test').then(r => r.json())
        .then(data => {
                countries = data.countrynames; //names )  
                console.log("Searchbar data loaded successfully.");
            });

function RevealHint(counter){
    const hintBoxes = [
        document.getElementById("hintBox1"),
        document.getElementById("hintBox2"),
        document.getElementById("hintBox3"),
        document.getElementById("hintBox4")
    ];

    //hide all hints
    hintBoxes.forEach(box => {
        box.classList.add("hidden");
    });


    // Reveal only up to counter
    for (let i = 0; i < counter; i++) {
        if (hintBoxes[i]) {
            hintBoxes[i].classList.remove("hidden"); 
            console.log("test1", i);
        }
       
    }
}

function SearchbarComponent({changeroll, resetHidden, count, setCounter, onGameComplete}){//
  
const [inputValue, handleInputChange] = useInput('');
// eslint-disable-next-line
const [selectedItem, setSelectedItem] = useState('');

const [quickCount, setQuickCount] = useState(0);

//get the URL and then decide which api to fetch daily/custom/infinite
const params = new URLSearchParams(window.location.search);//run the 
const gamemode = params.get("mode");


const [lastguesses, setLastguesses] = useState([]); // Store last guesses (this needs to be put in local storage too for daily)
//infinite and custom can just be state variables
//add another variable that tracks game progress True/False so daily challenge cant be replayed 

useEffect(()=>{
    if (gamemode==="daily") {
        if (countries <= 4 && count > -1){
            resetHidden(count); 
        }  
    }else{
        if (quickCount <= 4 && quickCount > -1){
            RevealHint(quickCount);
        }
    }
},[]);//on component mount

useEffect(() => {
    if (gamemode === "daily"){
       if (count <= 4 && count > -1){
            resetHidden(count); 
        }
    }else{
        if (quickCount <= 4 && quickCount > 0){ 
            RevealHint(quickCount);
        }
    }
}, [count, quickCount]);//on count change 

const [uiProps, setUiProps] = useState({
    showConfetti: false,
});

function showConfetti() {
    setUiProps({ showConfetti: true });
    setTimeout(() => {
        setUiProps({ showConfetti: false });
    }, 8000); // Hide confetti after 10 seconds
}

function validCountry(value){//if the country is in the list then return true
    for(const country of countries){
        if (country.toLowerCase() === value.toLowerCase()){
            return true;
        }
    }
    return false;
}

function getStorageVal(gamemode){
    let storedcountry = null;
    let getStoredVal = null;

    switch (gamemode){
        case "infinite":
            getStoredVal = JSON.parse(localStorage.getItem("infiniteData"));
            storedcountry = getStoredVal.country;
        break;
        case "custom":
            getStoredVal = JSON.parse(sessionStorage.getItem("customData"));
            storedcountry = getStoredVal.country;
        break;
        default:
            getStoredVal = JSON.parse(localStorage.getItem("DailyData"));
            storedcountry = getStoredVal.country;
        break;
    }

    return storedcountry;
}

function CheckInput(){//when the search button is pressed the page is reloaded and the value that is entered is compared to the country that was rolled 
    //get value from local storage
    let storedCountry = getStorageVal(gamemode);

    const searchbar = document.getElementById("input-bar");
    
    if(searchbar.value != null && searchbar.value !== "" && validCountry(searchbar.value)){//add a function to check if its a valid country
        //clear value in searchbar after check
        if (searchbar.value.trim().toLowerCase() === storedCountry.trim().toLowerCase()){//the goal is to only roll a new country once the entered value matches the rolled country
            Swal.fire({
                title: "Success",
                text: `Correctly guessed the Country: ${storedCountry}`,
                icon: "success",
                confirmButtonColor: "#000000",
                allowOutsideClick: false,
                didClose: () => {
                    if (gamemode === "daily"){
                        onGameComplete();
                    }
                }
            });
            Clearsearchbar();//make the clear search a function
            if (gamemode === "daily"){
                setCounter(() => {
                    resetHidden(4);//show all hints
                    return 4;
                });
            } else{
                setQuickCount(() => {
                    return 0;
                })
            }
            showConfetti(); // Show confetti when the answer is correct
            changeroll(true);
            setLastguesses([]);
        }else{
            Swal.fire({
                title: "Failed",
                text: "Selected the wrong country",
                icon: "error",
                confirmButtonColor: "#000000",
            });
            setLastguesses(prevGuesses => [...prevGuesses, inputValue]); //for svg highlight
            if (gamemode === "daily"){
               setCounter(prevcount => {
                    const newcount = prevcount + 1;
                    if (newcount > 4) {//if the counter is greater than 4 then the game will reset 
                        changeroll(true);
                        setLastguesses([]); // Clear last guesses
                        resetHidden(4);//show all hints
                        Swal.fire({
                            title: "Failed",
                            text: `Reached max guesses, Country was: ${storedCountry}, Try again...`,
                            icon: "error",
                            confirmButtonColor: "#000000",
                            allowOutsideClick: false,
                            didClose: () => {
                                onGameComplete();
                            }
                        });
                        return 4; // Reset the counter
                    }
                    return newcount;
                }); 
            } else{
                setQuickCount(prevcount =>{
                    const newcount = prevcount + 1;
                    if (newcount > 4) {//if the counter is greater than 4 then the game will reset 
                        changeroll(true);
                        setLastguesses([]); // Clear last guesses
                        Swal.fire({
                            title: "Failed",
                            text: `Reached max guesses, Country was: ${storedCountry}, Try again...`,
                            icon: "error",
                            confirmButtonColor: "#000000",
                            allowOutsideClick: false
                        });
                        return 0; // Reset the counter
                    }
                      
                    return newcount;
                });
        }         
        Clearsearchbar();
        }
    } else{
        Swal.fire({
            title: "Failed",
            text: "Enter a Country or terriory",
            icon: "warning",
            confirmButtonText:"Try again",
            confirmButtonColor: "#000000"
        });
    }
}

function Clearsearchbar(){
    handleInputChange({ target: { value: '' } }); // Clear the input field
}

const options = {
    includeScore: true
}

const fuse = new Fuse(countries, options);

  //filter the items
    const filteritems = (inputs) => {
      //filter the item by the score 
      //display matches with associated keys less than 0.6 if any match has a key display none
      if (!inputs || inputs.trim() === '') return [];//checks if input is empty
      
      const matches = fuse.search(inputs);

       // Check for exact match (score === 0)
      if (matches.some(result => result.score === 0)) {
        return []; // Hide suggestions if exact match found
      }
      //if a search matches (returns score of 0) return empty array
      return matches.filter(result => result.score < 0.2).map(result => result.item).slice(0, 7);
    }

    const filterednames = filteritems(inputValue); //update using fuse.js   

const handleSelectItem = (item) => {
    setSelectedItem(item);
    handleInputChange({ target: { value: item } });// this changes the values entered in the searchbar
};

// add another on click event in order to refresh the page on press
return(
    <div className="search-bar">
        <PageHeader countrylist={countries}/>
        <Homepage lastguesses={lastguesses} />
        {uiProps.showConfetti && <ReactConfetti />}
            <div id ="autocomplete-wrapper" className="autocomplete-wrapper">  
                <input type="text" id="input-bar" placeholder="Country, territory..." className="input-bar"  value={inputValue} onChange={handleInputChange} 
                   onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevent form submission
                        CheckInput(); // Call CheckInput on Enter press
                    }
                }}
                />
                <button type="button" className="submitbtn" onClick={CheckInput} title="submitbtn"> <FontAwesomeIcon icon={faMagnifyingGlass}/> </button>
                {inputValue && (
                    <ul className="autocomplete-list">
                        {filterednames.map((item, index) => (
                            <li key={index} onClick={() => handleSelectItem(item)} > 
                                {item}
                            </li>
                         ))}
                    </ul>
                    )}
            </div>
    </div>   
    
);
}

export default SearchbarComponent;