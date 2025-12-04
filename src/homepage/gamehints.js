import React from "react";
import "./gamehints.css";


function GameHints({roll, country, continent, capital, language, flag}){
    let langs = [];
    for (var key in language) {
        langs.push(language[key]);
    }

    let capitals = [];
    for (var key2 in capital){
        capitals.push(capital[key2])
    }


return(
<div id="center">
    <div  className ="hintBox1" id="hintBox1">
    <p>
        Continent: {continent}
    </p>  
    </div>
    <div className ="hintBox2" id="hintBox2">
        <p>
          Capital: {capitals.join(", ")}
        </p>  
    </div>
    <div className ="hintBox3" id="hintBox3">
        <p>
            Language(s): {langs.join(", ")}
        </p>  
    </div>
    <div className ="hintBox4" id="hintBox4">
        <img src={flag} alt="Country flag"/>
    </div>
</div>

);

}


export default GameHints;
