// import { createClient } from '@supabase/supabase-js'
// import { Axios } from 'axios';
// import Cookies from 'js-cookie';


export async function getCsrfToken(){
  const axios = require('axios')
  let token;
  const response = await axios.get('https://127.0.0.1:8000/get-csrf-token',{withCredentials:true}).then((response)=>{
    console.log(response.data.csrfToken)
    token = response.data.csrfToken
  })
  return token
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

export async function axiosaddCredentialsToDatabase(email,password,url,csrftoken){
  // const token = Cookies.get('csrftoken')  || getCookie('csrftoken')
  console.log('csrf cookie',token)
  const axios = require('axios')
  axios.post('https://127.0.0.1:8000/add',{
    "website":url,
    "username":email,
    "password":password},{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrftoken ,
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials:true
  }).then((response)=>{
    console.log(response)
  })
}
const getRandomInt = (max) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
};

export async function main(){
    const supabase = createClient('https://asqxzmqideavkbnwwnkv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXh6bXFpZGVhdmtibnd3bmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4OTc4NjYsImV4cCI6MjAzNDQ3Mzg2Nn0.BG57m0LenxrraDZv-S_5BzR1M6GVtySBoeZCaZmRoRs')
    let data = await supabase
  .from('password_manager_app_credentials')
  .select()
  let encoder = new TextEncoder();
  await supabase
  .from('password_manager_app_credentials')
  .insert({ email: 'newuser', password: encoder.encode('hello') })
        console.log(data.data[0],encoder.encode('hello'))
}

const getRandomCharFromString = (str) => str.charAt(getRandomInt(str.length));
export const generatePassword = (length = 8, numbers, special_characters) => {
    let pwd = "";
    const Allowed = {
      Uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
      Lowers: "qwertyuiopasdfghjklzxcvbnm",
    }
    pwd += getRandomCharFromString(Allowed.Uppers);  // pwd will have at least one upper
    pwd += getRandomCharFromString(Allowed.Lowers);
    if (numbers){
      Allowed.Numbers = "1234567890"
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