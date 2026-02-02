/* eslint-disable */
import "./searchbar.css";
import Swal from "sweetalert2";
import ReactDOM from 'react-dom/client';
import Fuse from "fuse.js";
import Divider from '@mui/material/Divider';
import { useInput } from "./AutocompleteComponent";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import globeimg from "../assets/cartoon_globe.jpg"
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'


function HeaderSearchbar({countries}){
    const [inputValue, handleInputChange] = useInput('');
    const [selectedItem, setSelectedItem] = useState('');

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
        return matches.filter(result => result.score < 0.2).map(result => result.item).slice(0, 5);
        }

        const filterednames = filteritems(inputValue); //update using fuse.js   

        const handleSelectItem = (item) => {
            setSelectedItem(item);
            handleInputChange({ target: { value: item } });// this changes the values entered in the searchbar
        };
        

    return(
        <div className="header-search-bar">
            <div id ="autocomplete-wrapper" className="autocomplete-wrapper">  
                <input type="text" id="input-bar-header" placeholder="Country, territory..."  value={inputValue} onChange={handleInputChange} />
                {inputValue && (
                    <ul className="autocomplete-list" id="autocomplete-list-header">
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


function PageHeader({countrylist}){//add an instruction popup

    let countries = countrylist;
    const url =  window.location.host;

    function validCountry(value){//if the country is in the list then return true
        for(const country of countrylist){
            if (country.toLowerCase() === value.toLowerCase()){
                return true;
            }
        }
        return false;
    }
    function findIndex(value){//if the country is in the list then return true
        const v = String(value).trim().toLowerCase();
        for(let i = 0; i < countries.length; i++){
            const item = String(countries[i]).toLowerCase();
            if (item === v){
                return i;
            }
        }
        return -1;
    }

    function copyTextToClipboard(text){
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Copyed to clipboard!",
                text: `${text}`,
                showConfirmButton: false,
                timer: 2000
            });
            console.log('Async: Copying to clipboard was successful!');
        }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });

    }

    const handleclick = (word) => {
        switch(word){
            case "custom":
                Swal.fire({
                title: "Create custom game",
                text: `clicked ${word}`,
                html: `<div id="react-autocomplete-container"></div>`,
                didOpen: () => {
                    const popup = Swal.getPopup();
                    const root = ReactDOM.createRoot(
                        document.getElementById("react-autocomplete-container")
                    );
                    root.render(<HeaderSearchbar countries={countries}/>);
                    popup.style.height = "300px";    // fixed height
                },
                confirmButtonText:"Create game",
                confirmButtonColor: "#000000",
                preConfirm: () => {
                    const Value = document.getElementById("input-bar-header").value;
                    if (validCountry(Value)) {
                        const customURL = url.concat(`/?mode=custom&value=${findIndex(Value)}`);
                        copyTextToClipboard(customURL);
                        return Swal.showValidationMessage(`
                            ${customURL}
                        `);
                   }else{
                        return Swal.showValidationMessage(`
                            Enter valid country!
            `          );
                   }
                }
            });
            break;
            case "daily":         
            window.location.href = `${window.location.origin}/?mode=daily`;
            break;
            case "infinite":
            window.location.href = `${window.location.origin}/?mode=infinite`;
            break;
             case "instructions":
                Swal.fire({
                title: "instructions",
                icon: "info",
                html: `Use up to 4 hints to guess the mystery country!<br><br>
                       All the hints are Hidden at first, <br> Try guessing your home country to reveal your first hint<br><br>
                       hints are revealed in this order:<br>
                       1. Continent<br>
                       2. Language<br>
                       3. Capital<br>
                       4. Flag<br><br>
                       After all four hints are revealed you have one more shot to get it right!`,
                allowOutsideClick: false,
                confirmButtonColor: "#000000"
            });
            break;
            default:
                alert("error");
        }        
    }

    const isMobile = useMediaQuery("(max-width:800px)");
    
    return(
        <div>
            <title>Guess the country</title>
            <h1 id="header-title">
            <img src={globeimg} id="globeimg"/>
            Nationle
            </h1>

            {isMobile && (
                <Accordion id="modesdropdown"
                    disableGutters
                    elevation={0}
                    sx={{
                        margin: 0,
                        
                        backgroundColor: "transparent",
                        boxShadow: "none",             
                        border: "none",                  
                    }}
                >
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faBars}/>}
                           sx={{
                                backgroundColor: "transparent",
                                boxShadow: "none",  
                                width: "53%",   
                                padding: 0,
                                "& .MuiAccordionSummary-content": {
                                    margin: 0,
                                    justifyContent: "center",     // center the icon
                                },
                                "&:hover": {
                                    backgroundColor: "transparent" // remove hover background
                                }
                            }}
                    >
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography component="div">
                            <div style={{ cursor: "pointer", marginRight: "4px" }} id="Homepage-header">
                                <p onClick={() => handleclick("custom")} className="header-item"><b>Custom</b></p><br></br>
                                <p onClick={() => handleclick("daily")} className="header-item"><b>Daily</b></p><br></br>
                                <p onClick={() => handleclick("infinite")} className="header-item"><b>Infinite</b></p><br></br>
                                <p onClick={() => handleclick("instructions")} className="header-item"><b>Instructions</b></p>
                                <Divider></Divider>
                            </div>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            )}
            {!isMobile && (
                <div style={{ cursor: "pointer", marginRight: "4px" }} id="Homepage-header">
                    <p onClick={() => handleclick("custom")} className="header-item"><b>Custom</b></p>
                    <p onClick={() => handleclick("daily")} className="header-item"><b>Daily</b></p>
                    <p onClick={() => handleclick("infinite")} className="header-item"><b>Infinite</b></p>
                    <p onClick={() => handleclick("instructions")} className="header-item"><b>Instructions</b></p>
                    <Divider></Divider>
                </div>
            )}
            
        </div>
    );
}

export default PageHeader;