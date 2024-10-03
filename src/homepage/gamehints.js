//https://restcountries.com/v3.1/all
//https://restcountries.com/v3.1/currency/cop
import './gamehints.css';
import './searchbar.css';
import { useState, useRef, useMemo } from 'react';
import SearchbarComponent from './searchbar';
import handleClick from './searchbar';
import { GenGameHint } from './genGameHint';


var roll = getRandomInt(249);
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


function RerollHint(hint){//create a function to handle the input from handle click then use useMemo to try and preserve the data between the renders


}


    
function GameHints(){
    
    //const [randomcontinent2, setrandomcontinent] = useState('');
    //const flag = useMemo(() => genFlag(roll),[randomflag])
    let genC =  GenGameHint(1);
    let gencap = GenGameHint(2);
    //let genCurr = GenGameHint(3);
    let genf =  GenGameHint(4);
    
    
   
    //console.log(genf);

return(
<body id="center">
    <div  className ="hintBox1">
    <p>
        continent: {genC}
    </p>  
    </div>
    <div className ="hintBox2">
        <p>
          capital: {gencap}
        </p>  
    </div>
    <div className ="hintBox3">
        <p>
            currency: 
        </p>  
    </div>
    <div className ="hintBox4">
        <img src={genf} />
    </div>
</body>

);

}

    // const genFlag = (roll) => {
    //      const outfactflag = [Ifact];
    //      var randomcountryflag = outfactflag[0][roll];
    //      setrandomflag(randomcountryflag);
    //     }

export default GameHints;
