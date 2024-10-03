import "./searchbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useInput } from "./AutocompleteComponent";
import { useState } from 'react';
import { setContinent } from './genGameHint'
//import the hints then the set methods 


getcountrydata();
    let countries =[];
    
    async function getcountrydata() {
        const countryres = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        
        const data = await countryres.json();
        
        countries = data.data.map((country) => {
            return country.name;
        });
        
        //console.log(countries);
    }


const handleClick = ()=> { //when the search button is pressed the page is reloaded and the value that is entered is compared to the country that was rolled 
//the goal is to only roll a new country once the entered value matches the rolled country
    
}


function SearchbarComponent(){//take a random country input
    
const [inputValue, handleInputChange] = useInput('');
const [selectedItem, setSelectedItem] = useState('');
// const randomcountry = Randcountry();
//const [rolledcountry, onclickevent] = randcountry('');



const filterednames = countries.filter(item => item.toLowerCase().includes(inputValue.toLowerCase())).sort();
const handleSelectItem = (item) => {
    setSelectedItem(item);
    handleInputChange({ target: { value: item } });// this changes the values entered in the searchbar
};
//console.log(randomcountry);



// add another on click event in order to refresh the page on press
return(

<html>
<head>
</head>
<body> 
   
    <form className="search-bar" onSubmit={onsubmit}>
        
            <div id ="autocomplete-wrapper" className="autocomplete-wrapper">  
                <input type="text" id="input-bar" placeholder="Country, territory..." className="input-bar"  value={inputValue} onChange={handleInputChange}/>
                    <button type="button" className="submitbtn" onClick={handleClick}> <FontAwesomeIcon icon={faMagnifyingGlass}  /> </button>
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
                
        </form>   
    </body>
    
</html>

);




}

export default SearchbarComponent;