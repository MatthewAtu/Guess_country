//future improvements:
//make the auto complete more accurate. for example the pitcairn islands doesnt appear when you type it in 
import { useState } from 'react';

export function useInput(initializedvalue){

const [inputValue, setInputValue] = useState(initializedvalue);
    
const handleChange = (event) => {
setInputValue(event.target.value);// changes the value in the searchbar when an item on the list is clicked 
};


return [inputValue, handleChange];
}