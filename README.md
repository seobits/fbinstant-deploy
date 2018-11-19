# Deployer for facebook instant games

 An npm package to help automate the deployment of facebook instant games.
 
 The deploy() function returns a promise that will resolve if the package has been delivered to the facebook endpoint.

#installation

<code>npm install --save-dev fbinstant-deploy</code>

# Usage

<code>require("fbinstant-deploy").deploy(directory, access_token, app_id, comment)</code>

# Example

<pre>
    <code>
    const fbinstantDeploy = require("fbinstant-deploy");
    fbinstantDeploy.deploy("/some/dir/to/zip/", "access_token", "app_id", "some comment here").then(()=>{
        console.log("Deployment successful!");
    });
    </code>
</pre>