import { useState } from 'react';

export function useInput(initializedvalue){

const [inputValue, setInputValue] = useState(initializedvalue);
    
const handleChange = (event) => {
setInputValue(event.target.value);// changes the value in the searchbar when an item on the list is clicked 
};




return [inputValue, handleChange];
}