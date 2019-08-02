const zip = require('bestzip');
const request = require('request');
const path = require('path');
const fs = require('fs');

function zipProject(dir) {
    return new Promise((resolve, reject) => {
        zip({
            source: dir,
            destination: "./" + dir + ".zip"
        }).then(function () {
            console.log(`Project file: ${path.resolve(dir)}.zip`);
            resolve();
        }).catch(reject);
    })
}

function deploytoFacebook(accestoken, appid, file, comment = "") {
    return new Promise((resolve, reject) => {
        const url = `https://graph-video.facebook.com/${appid}/assets`;
        request.post({
            url: url,
            formData: {
                access_token: accestoken,
                type: "BUNDLE",
                comment: comment,
                asset: {
                    value: fs.createReadStream(file),
                    options: {
                        contentType: "application/octet-stream"
                    }
                },
            },
        }, function (err, response, body) {
            if (err) {
                console.log(err);
                reject(err);
            }
            const parsedBody = JSON.parse(body);
            if (parsedBody.success) {
                console.log("File deployed to Facebook!");
                resolve();
            } else {
                console.error("Can't upload to Facebook: ", parsedBody.error.message + ` -- Code(${parsedBody.error.code})`);
                reject();
            }
        })
    });
}

function deploy(directory, accesstoken, appid, comment = "") {
    directory = typeof directory == "string" ? directory : directory.toString();
    accesstoken = typeof accesstoken == "string" ? accesstoken : accesstoken.toString();
    appid = typeof appid == "string" ? appid : appid.toString();
    comment = typeof comment == "string" ? comment : comment.toString();
    return new Promise((resolve, reject) => {
        if (directory || accesstoken || appid) {
            console.log(`Compressing directory: ${path.relative(__dirname, directory)}`);
            return zipProject(directory).then(() => {
                console.log(`Deploying to facebook...`);
                console.log(`\tAccessToken: ${accesstoken.substr(0, 10)}[...]`);
                console.log(`\tAppId: ${appid}`);
                console.log(`\tFile: ${path.resolve(directory)}.zip`);
                deploytoFacebook(accesstoken, appid, `${path.resolve(directory)}.zip`, comment)
                    .then(resolve)
                    .catch(reject);
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        } else {
            let error = "A directory, accesstoken and appid are required";
            console.error(error);
            reject();
        }
    });
}

exports.deploy = deploy;