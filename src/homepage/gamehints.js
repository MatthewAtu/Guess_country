import React from "react";
import "./gamehints.css";
import SearchbarComponent from "./searchbar";


function GameHints({roll, country, continent, capital, language, flag}){
    let langs = [];
    for (var key in language) {
        langs.push(language[key]);
    }

    let capitals = [];
    for (var key in capital){
        capitals.push(capital[key])
    }


return(
<div id="center">
    <div  className ="hintBox1" id="hintBox1">
    <p>
        continent: {continent}
    </p>  
    </div>
    <div className ="hintBox2" id="hintBox2">
        <p>
          capital: {capitals.join(", ")}
        </p>  
    </div>
    <div className ="hintBox3" id="hintBox3">
        <p>
            Language(s): {langs.join(", ")}
        </p>  
    </div>
    <div className ="hintBox4" id="hintBox4">
        <img src={flag}/>
    </div>
</div>

);

}


export default GameHints;
