import "./searchbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useInput } from "./AutocompleteComponent";
import { useState } from 'react';
import ReactConfetti from 'react-confetti';

//import the hints then the set methods 
//here the values will be changed

getcountrydata();
    let countries =[];
    
    async function getcountrydata() {
        try{
            const countryres = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name");
            const data = await countryres.json();
        
            countries = data.map((fact) => { //names
                return fact.name.common;
            }); 
        } catch(error){
            console.log(error);
        }
 
    }

function RevealHint(counter){
    var hintBox1 = document.getElementById("hintBox1");
    var hintBox2 = document.getElementById("hintBox2");
    var hintBox3 = document.getElementById("hintBox3");
    var hintBox4 = document.getElementById("hintBox4");

    switch(counter){
        case 1: 
            hintBox1.classList.remove("hidden");
        break;
        case 2:
            hintBox2.classList.remove("hidden");  
        break;
        case 3:
            hintBox3.classList.remove("hidden");
        break;
        case 4:
            hintBox4.classList.remove("hidden");
        break;
        case 5:
            //alert("You have used all your hints, the game will now reset");
        break;
        default:
            alert("invalid index");
    }
}



function SearchbarComponent({changeroll, resetHidden}){//take a random country input
  
const [inputValue, handleInputChange] = useInput('');
// eslint-disable-next-line
const [selectedItem, setSelectedItem] = useState('');
const [counter, setCounter] = useState(() => {
    // Initialize counter from localStorage or default to 0
    return parseInt(localStorage.getItem("counter")) || 0;
});//this is the counter that will be used to check how many times the user has guessed wrong

const [uiProps, setUiProps] = useState({
    showConfetti: false,
});

function showConfetti() {
    setUiProps({ showConfetti: true });
    setTimeout(() => {
        setUiProps({ showConfetti: false });
    }, 8000); // Hide confetti after 10 seconds
}

function CheckInput(){//when the search button is pressed the page is reloaded and the value that is entered is compared to the country that was rolled 
    //get value from local storage
    let storedCountry = JSON.parse(localStorage.getItem("currentcountry"));
    const searchbar = document.getElementById("input-bar");

    if(searchbar.value != null){//remove to fix cannot find properties of null
        //clear value in searchbar after check
        if (searchbar.value.trim().toLowerCase() === storedCountry.trim().toLowerCase()){//the goal is to only roll a new country once the entered value matches the rolled country
            console.log("correct");
            alert("right");
            Clearsearchbar();//make the clear search a function
            resetHidden();//reset the hidden hints
            showConfetti(); // Show confetti when the answer is correct
            changeroll(true);
            setCounter(0);
        }
        else{
            console.log("wrong");
            alert("wrong");
            setCounter(prevCounter => {
                const newCounter = prevCounter + 1;
                //console.log(newCounter);
                RevealHint(newCounter);
                if (counter >= 4) {//if the counter is greater than 4 then the game will reset
                    changeroll(true);
                    resetHidden();//reset the hidden hints
                    return 0; // Reset the counter
                }
            return newCounter;
            });
            Clearsearchbar();
        }
    }
}

function Clearsearchbar(){
    handleInputChange({ target: { value: '' } }); // Clear the input field
}

const filterednames = countries.filter(item => item.toLowerCase().includes(inputValue.toLowerCase())).sort();
const handleSelectItem = (item) => {
    setSelectedItem(item);
    handleInputChange({ target: { value: item } });// this changes the values entered in the searchbar
};

// add another on click event in order to refresh the page on press
return(

   
    <div className="search-bar">
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
                    <li key={index}  onClick={() => handleSelectItem(item)} > 
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