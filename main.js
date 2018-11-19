const zipFolder = require('zip-folder');
const request = require('request');
const path = require('path');
const fs = require('fs');

function zipProject(dir) {
    const filename = path.posix.basename(dir);
    return new Promise((resolve, reject) => {
        zipFolder(dir, filename + ".zip", function (e) {
            if (e) {
                console.log(e);
                reject();
            } else {
                resolve();
            }
        })
    })
}

function deploytoFacebook(accestoken, appid, file, comment = "") {
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
        }
        const parsedBody = JSON.parse(body);
        if (parsedBody.success) {
            console.log("File deployed to Facebook!");
        } else {
            console.error("Can't upload to Facebook: ", parsedBody.error.message + ` -- Code(${parsedBody.error.code})`);
        }
    })
}

function deploy(directory, accesstoken, appid, comment) {
    if (directory || accesstoken || appid) {
        directory = path.resolve(directory);
        console.log(`Compressing directory: ${directory}...`);
        return zipProject(directory).then(() => {
            console.log(`Project has been zipped under ${directory}.zip`);
            console.log(`Deploying to facebook...`);
            console.log(`AccessToken: ${accesstoken}`);
            console.log(`AppId: ${appid}`);
            deploytoFacebook(accesstoken, appid, `${directory}.zip`, comment);
        }).catch((e) => {
            console.log(e);
        });
    } else {
        if (!directory) {
            console.error("directory is missing")
        };
        if (!accesstoken) {
            console.error("accesstoken is missing")
        };
        if (!appid) {
            console.error("appid is missing")
        };
    }

}

exports.deploy = deploy;