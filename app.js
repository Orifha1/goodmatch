const express = require('express');
const app = express()
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))// middleware for serving static files images, CSS files, and JavaScript files

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended:true})); // this middleware allows us to parse the "req.body"

//The get method takes you to the page that has the form. 
app.get('/', (req, res) => {
    return res.render('home');
});

//This method runs when the submit button is pressed on the frontend form.
app.post('/', (req, res) => {
    try{
        let name1 = req.body.name1;
        let name2 = req.body.name2;
        //Check if a number was sent
        if(typeof (name1*1) === "number" || typeof (name2*1) === "number"){
            console.log("The name should be a string");
            return res.render('home');
        }
        percentage = checkCharactorOccurence(name1,name2);
        console.log("per:", percentage);
        return res.render('home',{percentage,name1,name2});
    }catch(err){
        console.log("An Error has occurred");
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
            console.log("Error");
        }
    }catch(err){
        console.log("An error has occurred please try again.", err);
    }

}

/**
 * @description
 * @param
 * @param
 * @return 
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
    
    return checkThepercentage(arrayToOverride);;
}

//Listening for connection.
app.listen(port, () => {
    console.log(`SERVER STARTED ON PORT: ${port}`);
});