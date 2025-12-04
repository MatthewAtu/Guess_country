import "./searchbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useInput } from "./AutocompleteComponent";
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import Swal from "sweetalert2";
import Fuse from "fuse.js";
import Homepage from "./homepage";

//import the hints then the set methods 
//here the values will be changed

    let countries =[];
        fetch('/api/test.js').then(r => r.json())
        .then(data => {
                countries = data.countrynames; //names )  
                console.log("Searchbar data loaded successfully.");
            });

function RevealHint(counter){
    var hintBox1 = document.getElementById("hintBox1");
    var hintBox2 = document.getElementById("hintBox2");
    var hintBox3 = document.getElementById("hintBox3");
    var hintBox4 = document.getElementById("hintBox4");

    switch(counter){
        case 1: 
            hintBox1.classList.remove("hidden");
            console.log("revealing hint 1...");
        break;
        case 2:
            hintBox2.classList.remove("hidden"); 
            console.log("revealing hint 2..."); 
        break;
        case 3:
            hintBox3.classList.remove("hidden");
            console.log("revealing hint 3...");
        break;
        case 4:
            hintBox4.classList.remove("hidden");
            console.log("revealing hint 4...");

        break;
        default:
            console.log(counter);
            alert("invalid index");
    }
}

function SearchbarComponent({changeroll, resetHidden, usePersistedState}){//take a random country input
  
const [inputValue, handleInputChange] = useInput('');
// eslint-disable-next-line
const [selectedItem, setSelectedItem] = useState('');
//if (localStorage.getItem("counter")) localStorage.removeItem("counter");

const [guessCounter, setGuessCounter] = usePersistedState("counter" , 0);

const [lastguesses, setLastguesses] = useState([]); // Store last guesses (this needs to be put in local storage too)
//add another variable that tracks game progress True/False so daily challenge cant be replayed 

useEffect(() => {
    resetHidden();
}, [guessCounter, resetHidden]);

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

function CheckInput(){//when the search button is pressed the page is reloaded and the value that is entered is compared to the country that was rolled 
    //get value from local storage
    let storedCountry = JSON.parse(localStorage.getItem("currentcountry"));
    const searchbar = document.getElementById("input-bar");

    if(searchbar.value != null && searchbar.value !== "" && validCountry(searchbar.value)){//add a function to check if its a valid country
        //clear value in searchbar after check
        if (searchbar.value.trim().toLowerCase() === storedCountry.trim().toLowerCase()){//the goal is to only roll a new country once the entered value matches the rolled country
            console.log("correct");
            Swal.fire({
                title: "Success",
                text: "Correctly guessed the country",
                icon: "success"//changed to type from icon
            });
            Clearsearchbar();//make the clear search a function
            setGuessCounter(prevcount => {
                resetHidden();//reset the hidden hints true
                return 0;
            });
            
            showConfetti(); // Show confetti when the answer is correct
            changeroll(true);
            setLastguesses([]);
        }
        else{
            console.log("wrong");
            Swal.fire({
                title: "Failed",
                text: "Selected the wrong country",
                icon: "error"
            });
            setLastguesses(prevGuesses => [...prevGuesses, inputValue]); //for svg highlight
            setGuessCounter(prevcount => {
                    console.log("newcount: " + prevcount);
                    const newcount = prevcount + 1;
                    if (newcount > 4) {//if the counter is greater than 4 then the game will reset 
                        changeroll(true);
                        resetHidden();//reset the hidden hints true
                        setLastguesses([]); // Clear last guesses
                        Swal.fire({
                            title: "Failed",
                            text: `Reached max guesses, Country was: ${storedCountry}, Try again...`,
                            icon: "error"
                        });
                        return 0; // Reset the counter
                    }
                    RevealHint(newcount); 
                    return newcount;
                });
            console.log("reached");
            Clearsearchbar();
        }
    } else{
        Swal.fire({
            title: "Failed",
            text: "Enter a Country or terriory",
            icon: "warning"
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
      return matches.filter(result => result.score < 0.4).map(result => result.item);
    }

    const filterednames = filteritems(inputValue); //update using fuse.js   

const handleSelectItem = (item) => {
    setSelectedItem(item);
    handleInputChange({ target: { value: item } });// this changes the values entered in the searchbar
};

// add another on click event in order to refresh the page on press
return(
    <div className="search-bar">
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
                    <button type="button" className="submitbtn" onClick={CheckInput}> <FontAwesomeIcon icon={faMagnifyingGlass}  /> </button>
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