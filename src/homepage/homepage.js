import Map from '../assets/map.png';
import './homepage.css';



function homepage(){
   
 return(
<div>
    <title>Guess the country</title>
    <h1>Guess the Country</h1>
    <img src={Map} />
    
    <h3>use the hints below to guess the country</h3>
</div>

 );
}


export default homepage;
