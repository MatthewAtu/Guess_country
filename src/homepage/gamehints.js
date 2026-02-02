import React from "react";
import { useState } from "react";
import "./gamehints.css";


function GameHints({customData, infiniteData, dailyData}){
    
    const params = new URLSearchParams(window.location.search);
    const gamemode = params.get("mode");

    const gameData = (gamemode) => {
        switch (gamemode){
            case "infinite":
                return infiniteData;
            case "custom":
                return customData;
            default:
                return dailyData
        }
    }

    const formatCapital = (capitals) => {
        if(capitals){
            return capitals.replace(/,/g, ", ");
        }
        return capitals;
    }

    const formattedCapitals = formatCapital(gameData(gamemode).capital);

return(
<div id="center">
    <div  className="hintBox" id="hintBox1">
    <p>
        <b>Continent:</b> {gameData(gamemode).continent}
    </p>  
    </div>
    <div className = "hintBox" id="hintBox2">
         <p>
            <b>Language(s):</b> {gameData(gamemode).language}
        </p>
    </div>
    <div className= "hintBox" id="hintBox3">
        <p>
            <b>Capital(s):</b> {formattedCapitals}
        </p> 
    </div>
    <div className= "hintBox" id="hintBox4">
        <img src={gameData(gamemode).flag} alt="Country flag" draggable="false"/>
    </div>
</div>

);

}


export default GameHints;
