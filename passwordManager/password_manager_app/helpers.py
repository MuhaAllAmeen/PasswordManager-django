from . import cryptography


def getCredentialsAsSet(user,websites):
    websiteDetails = {}
    for website in websites:
        credentials = website.credentials.all()
        credentialsList = []
        for credential in credentials:
            email = credential.email
            password = cryptography.decrypt(credential.password)
            credentialsList.append({
                "email":email,
                "password":password
            })
        websiteDetails[website.name]= credentialsList
    return websiteDetails