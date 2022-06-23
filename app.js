const express = require('express');
const fs = require("fs");
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))// middleware for serving static files images, CSS files, and JavaScript files

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended:true})); // this middleware allows us to parse the "req.body"

//The get method takes you to the page that has the form. 
app.get('/', (req, res) => {
    name1 ="";
    name2="";
    let message = false;
    return res.render('home',{name1,name2,message});
});

//This method runs when the submit button is pressed on the frontend form.
app.post('/', (req, res) => {
    try{
        let name1 = req.body.name1;
        let name2 = req.body.name2;
        //Check if a number was sent
        if(isNaN(name1*1) && isNaN(name2*1)){
            percentage = checkCharactorOccurence(name1,name2);
            let message =false;
            return res.render('home',{percentage,name1,name2,message});
        }else{
            name1 ="";
            name2="";
            let message = false;
            console.log("The name should be a string");
            return res.render('home',{percentage,name1,name2, message});
        }
    }catch(err){
        console.log("An Error has occurred");
    }
   
});

app.get('/reader', (req, res) => {
    let errorOccurred = false
    let message = false;
    try {
        fs.readFile(`${__dirname}/data.csv`, "utf-8", (err, data) => {
            if (err){
                console.log("An Error has occurred:", err);
                let message = false;
                return res.render('home',{message});
            }
            else{
                let arr1 = [];
                let arr2 = [];
                let fi = data.toString().split("\r\n");
                for(i in fi) {
                    if(fi[i].toLowerCase().includes(", f")){
                        
                        arr1.push(fi[i]);
                    }
                    if(fi[i].toLowerCase().includes(", m")){
                        arr2.push(fi[i]);
                    }
                }
    
                const outputArray =[];
                //Create sets to 
                const set1 = new Set(arr1);
                const set2 = new Set(arr2);

                //check for every entry in the first set against every entry in the second set.
                for(let i = 0; i < [...set1].length; i++){
                    for(let j = 0; j < [...set2].length; j++){
                        let outPutResults = checkCharactorOccurence([...set1][i], [...set2][j]);
                        outputArray.push(`${[...set1][i]} matches ${[...set2][j]} ${outPutResults}`);
                  }
                }
                fs.writeFile("output.txt", outputArray.join("\n"), "utf-8", (err) => {
                    if (err){
                        console.log("An Error has occurred:",err);
                        return res.render('home', {errorOccurred});
                    }
                    else {
                        console.log("Data saved");
                        errorOccurred = true;
                    }
                     
                  });
            } 
          });
        message=true;
        return res.render('home',{message});
        
    } catch (error) {
        console.log("An Error has occurred");
        return res.render('home', {errorOccurred});
    }

});



/**
 * @description
 * This method checks how many character occurrences happened for each character.
 * E.g if name1 is cat and name2 is rat the characters will be counted like so: {c:1,a:2, t:2, r:1}
 * @param name1 - first name entered.
 * @param name2 - Second name entered.
 * @return checkThepercentage(finalArray) - returns a number(percentage);
 */
checkCharactorOccurence = (name1, name2) => {
    try{
        let finalArray = [];
        let frequencyCounter = {};
        //check for any special characters in the sentence.
        finalString = name1.concat(name2).split(" ").join(""); //use split and join method to remove any spaces 
        if(typeof finalString === 'string'){
            const arr1 = [...finalString];
            for(let val of arr1){
                frequencyCounter[val] = (frequencyCounter[val] || 0) + 1
            }
            for(let val in frequencyCounter){
                finalArray.push(frequencyCounter[val]);
            }
            return checkThepercentage(finalArray); // send the array with the values to this method to get a percentage.
        }else{
            console.log("Invalid entry. Please enter a string.");
        }
    }catch(err){
        console.log("An error has occurred please try again.", err);
    }

}

/**
 * @description
 * @param occurrenceArray - This method checks the array and return a percentage value.
 * @return percentage as a number.
 */
checkThepercentage = (occurrenceArray) => {
    let pointer_a = 0;
    let pointer_b = occurrenceArray.length - 1;
    let arrayToOverride = occurrenceArray;
    temp = [];
    let percentage = 0;

    while(pointer_a <= pointer_b){
        if(arrayToOverride.length === 2){
            percentage = ""+arrayToOverride[0] + arrayToOverride[1];
            return percentage * 1;
        }
        if(pointer_a === pointer_b){
            temp.push(arrayToOverride[pointer_a]);
        }else{
            if((arrayToOverride[pointer_a] + arrayToOverride[pointer_b]) > 9){
                let splittedValue = (arrayToOverride[pointer_a] + arrayToOverride[pointer_b]).toString().split("").map(Number);
                temp.push(...splittedValue);
            }else{
                temp.push(arrayToOverride[pointer_a] + arrayToOverride[pointer_b]);
            }
        }
        pointer_a++;
        pointer_b--
    }
    arrayToOverride = temp;
    temp = [];
    
    return checkThepercentage(arrayToOverride);
}

//Listening for connection.
app.listen(port, () => {
    console.log(`SERVER STARTED ON PORT: ${port}`);
});