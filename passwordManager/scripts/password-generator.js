// import * as crypto from "crypto";

const generate_btn = document.getElementById('generate-btn')
const password_box = document.getElementById('password-box')
const number_checkbox = document.getElementById('numbers-checkbox')
const special_characters_checkbox = document.getElementById('special-characters-checkbox')
var slider = document.getElementById("pass-length");
var output = document.getElementById("slider-output");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}
generate_btn.addEventListener('click',()=>{
    let pass = generatePassword(output.innerHTML,number_checkbox.checked,special_characters_checkbox.checked)
    password_box.value = pass

})



const getRandomInt = (max) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
};

const getRandomCharFromString = (str) => str.charAt(getRandomInt(str.length));
const generatePassword = (length = 8, numbers, special_characters) => {
    let pwd = "";
    const Allowed = {
        Uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
        Lowers: "qwertyuiopasdfghjklzxcvbnm",
    }
    pwd += getRandomCharFromString(Allowed.Uppers);  // pwd will have at least one upper
    pwd += getRandomCharFromString(Allowed.Lowers);
    console.log('hello')
    console.log(numbers,special_characters)
    if (numbers){
        Allowed.Numbers = '1234567890'
        pwd += getRandomCharFromString(Allowed.Numbers);  // pwd will have at least one number
    }  // pwd will have at least one lower
    if(special_characters){
        Allowed.Symbols = "!@#$%^&*"
        pwd += getRandomCharFromString(Allowed.Symbols); // pwd will have at least one symbol
    }
    for (let i = pwd.length; i < length; i++)
        pwd += getRandomCharFromString(Object.values(Allowed).join(''));  // fill the rest of the pwd with random characters
    return pwd
}