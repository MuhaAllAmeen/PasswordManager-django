import os
from cryptography.fernet import Fernet

key_path = 'key.key'

# Check if the key file exists
if not os.path.exists(key_path):
    # Generate a new key if the file does not exist
    key = Fernet.generate_key()
    # Write the key to the file
    with open(key_path, 'wb') as key_file:
        key_file.write(key)
else:
    # Load the key from the file if it exists
    with open(key_path, 'rb') as key_file:
        key = key_file.read()

f = Fernet(key)

def crypto(password):   
    bpassword = password.encode()  # Convert password to bytes
    token = f.encrypt(bpassword)  # Encrypt the password
    return token

def decrypt(token):
    decryptedPass = f.decrypt(token.tobytes())
    return decryptedPass.decode('utf-8')  # Convert decrypted bytes back to string
