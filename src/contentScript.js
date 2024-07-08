import { axiosaddCredentialsToDatabase, generatePassword, getCsrfToken } from './utils.js';

(() => {
  // await main()
  const passNames = ['pass','password','Password','Pass','PASSWORD']
  const userNames = ['username','Username','UserName','email','reg_email__','reg_email_','Email',"EMAIL",'USERNAME']
  const submitNames = ['submit','login','signup','register','Login','Register','SignUp', 'Log In', 'Sign Up']
  const formregNames = ['reg','register','Register','Reg','signup','signUp','Signup','SignUp']
  
  chrome.runtime.onMessage.addListener( async function (msg, sender, response) {
    if (msg.action == 'readInputs' && !msg.tabDetails.url.includes('localhost')){
      response({message:'success'})
      await getCsrfToken()
      // console.log(msg)
      var inputFields = document.getElementsByTagName('input');
      var buttons = document.getElementsByTagName('button')
      var forms = document.getElementsByTagName('form');
      var buttonsInsideForm = forms[0].getElementsByTagName('button');
      buttonsInsideForm = Array.from(buttonsInsideForm).filter(button => button.id != 'passwordGenerator')
      let registerForm;
      let loginForm;
      console.log(formregNames.some(name => msg.tabDetails.url.includes(name)))
      for (let i=0; i<forms.length; i++){
        if (formregNames.includes(forms[i].name) ){
          registerForm = forms[i]
        }
      }
      let passwordField;
      let emailField;
      let submitBtn;
      let password;
      let email;
      let url;
      for (let i =0; i< inputFields.length; i++){
        if (inputFields[i].type == 'password'){
          passwordField = inputFields[i]
        }else if(inputFields[i].type == 'email' ||userNames.includes(inputFields[i].name) || userNames.includes(inputFields[i].id)){
          emailField = inputFields[i]
        }else if(inputFields[i].type == 'submit'){
          submitBtn = inputFields[i]
        }
      }
      if (registerForm || formregNames.some(name => msg.tabDetails.url.includes(name))){
        console.log('registerForm',registerForm)
        let div=document.createElement("div"); 
        div.className = 'generatePasswordDiv'
        div.innerHTML  = "<button id='generatePassword' style='border:none; background-color:grey; width: 100%; height: fit-content; padding-top:10px;'>Generated Password</button>"
        passwordField.parentElement.parentElement.appendChild(div)
        let generatePasswordbtn = document.getElementById('generatePassword')
        let p = document.createElement('p')
        let generatedPass = generatePassword(12,true,true)
        p.style.color = 'white'
        p.style.fontSize = '22px'
          p.innerText = generatedPass
          generatePasswordbtn.appendChild(p)
        generatePasswordbtn.addEventListener('click',(e)=>{
          e.preventDefault()
          console.log('click2',passwordField.value)
          passwordField.value = generatedPass;
          passwordField.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('click', passwordField.value);
        })
      }
      if (submitBtn==null){
        for (let i =0; i< buttonsInsideForm.length; i++){
          if (submitNames.includes(buttonsInsideForm[i].innerText)|| submitNames.includes(buttonsInsideForm[i].type) || submitNames.includes(buttonsInsideForm[i].name)){
            console.log('inside',buttonsInsideForm[i])
            buttonsInsideForm[i].addEventListener('click',()=>{
              password = passwordField ? passwordField.value : ''
              email = emailField ? emailField.value : ''
              url = msg.tabDetails.url
              if (password != '' && email != '') {
                console.log(password,email,buttons[i])
                chrome.runtime.sendMessage( 
                  { 
                  action: "post",
                  email:email,
                  password:password,
                  url:url,
                  csrftoken:msg.csrftoken
                }, 
                  function(response) {
                  console.log('Done posting:', response);
                });            
                // axiosaddCredentialsToDatabase(email,password,url,msg.csrftoken)
              }
            })
            submitBtn = buttonsInsideForm[i]
          }
        }
      }
    
      console.log('submit btn',submitBtn,passwordField,emailField)

      // submitBtn.addEventListener('click',async ()=>{
      //   let password = passwordField ? passwordField.value : ''
      //   let email = emailField ? emailField.value : ''
      //   let url = msg.tabDetails.url
        
      //   console.log(password,email)
      //   await addCredentialsToDatabase(email,password,url)
      // })

    }
    
    // response(result)
});
})();
