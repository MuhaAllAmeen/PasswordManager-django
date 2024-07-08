const search_form = document.getElementById('search-form')
const results_container = document.querySelector('.results-container')
search_form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchValue = document.querySelector('#search').value;

    // Fetch the CSRF token from the Django server
    const csrfResponse = await fetch('http://localhost:8000/get-csrf-token');
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;
    console.log(csrfToken)
    fetch('https://127.0.0.1:8000/vault', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: new URLSearchParams({
            'search': searchValue,
        }),
    })
    .then(response => response.text())
    .then(data => {
        let details;
        try {
            details = JSON.parse(data)
        } catch (error) {
            console.log(error)
            results_container.innerHTML = `<h2>You have not logged in<br>Please go to Vault and Log in</h2>`
            return;
        }
        console.log(details)
        let website_credentials = Object.values(details)[0]
        if (website_credentials == "no data"){
            results_container.innerHTML = `<h2>No Credentials Found </h2>`
            return;
        }
        let website = Object.keys(website_credentials)[0]
        let credentials = Object.values(website_credentials)[0]
        results_container.innerHTML = `<h2>${website} </h2>`
        credentials.forEach(credential => {
            let credentials_container = document.createElement('div')
            credentials_container.className = 'credentials-container'
            credentials_container.innerHTML = `<p>Email/Username: ${credential.email} Password: ${credential.password}</p>`
            results_container.appendChild(credentials_container)
        });
    })
    .catch(error => {
        results_container.innerHTML = `<h2>No Credentials Found </h2>`
        console.error('Error:', error);
    });
})

