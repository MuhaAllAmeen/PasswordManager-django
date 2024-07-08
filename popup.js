// import * as crypto from "crypto";
import { generatePassword } from "./src/utils.js"

var isLogged
const generate_btn = document.getElementById('generate-btn')
const password_box = document.getElementById('password-generator')
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


