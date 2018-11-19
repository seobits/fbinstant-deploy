# Deployer for facebook instant games

 NPM package to help automate the deployment of facebook instant games.
 
 The deploy() function returns a promise that will resolve if the package has been delivered to the facebook endpoint.

#installation

<code>npm install --save-dev fbinstant-deploy</code>

# Usage

```javascript
require("fbinstant-deploy").deploy(directory, access_token, app_id, comment);
```

# Example

```javascript
const fbinstantDeploy = require("fbinstant-deploy");
fbinstantDeploy.deploy("/some/dir/to/zip/", "access_token", "app_id", "some comment here").then(()=>{
    console.log("Deployment successful!");
});
```