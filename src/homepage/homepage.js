import './homepage.css';
import img from "../assets/world_map.svg"
import { useEffect } from 'react';


function Homepage({lastguesses}){
    const makeSVG = () => {
        fetch(img)
            .then(response => response.text())
            .then(svgText => {
                document.getElementById("Map-container").innerHTML = svgText;
                // console.log(svgText);

            }).catch((error) => console.error("Error fetching SVG:", error));
    }
    makeSVG();

    useEffect(() => {
        // Remove highlight from all countries
        document.querySelectorAll('path.Highlighted').forEach(el => {
            el.classList.remove('Highlighted');
        });
        // Check if the last guess is correct
        if (lastguesses && Array.isArray(lastguesses)) {
            // If correct, redirect to the game hints page
            for (let guess of lastguesses) {
              const highlightedGuess = document.querySelector(`path[name="${guess}"]`);
                if (highlightedGuess) {
                    highlightedGuess.classList.add("Highlighted");
                    console.log(highlightedGuess);
                }
                }
            }
        } , [lastguesses]);
    

 return(
    <div>
        <title>Guess the country</title>
        <h1>Guess the Country</h1>
        <div id='Map-container'>
            
        </div>
        
        <h3>use the hints below to guess the country</h3>
    </div> 
 );
}


export default Homepage;
