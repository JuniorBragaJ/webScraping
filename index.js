
const str = "Eu gosto de 192387 segunda terceiro"

let matches = str.match(/\d+/g);

if(matches){
  let numString = JSON.stringify(matches[0]);
  numString = numString.slice(1, -1);
  let numInt = parseInt(numString, 10)
  console.log(numInt)
} else {
  console.log("No number found");
}
