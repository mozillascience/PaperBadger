# ORCID auth instructions

#### Steps to obtain ORCID AUTH SECRET VARIABLES
Go to `https://orcid.org/developer-tools` and create new Application. While creating new application in Redirect URI field you have to fill `http://localhost:5000/orcid_auth_callback`. It will generate Client ID and Client Secret, using those values set your environment variable in default.env

#### Steps to obtain ORCID
Run `npm start` and then open up `http://localhost:5000/request-orcid-user-auth`, this will redirect orcid website where you have to sign in, after that you would be redirected back.

Then open up `http://localhost:5000/user`, this will return a json object with your orcid.

#### Adding user as a publisher

Run `npm start`, and open up mongo shell in your terminal. It would connect you with the test database. Then follow these steps.

```js
db.users.insert({"name":"Your name", "orcid":"Your ORCID", "role":"publisher"})
```
