const {
    FileSystemUploadOptions,
    FileSystemUpload
} = require('@adobe/aem-upload');
const path = require('path');

const AEM_USERNAME = 'testadobe';
const AEM_PASSWORD = 'testadobe';
const AEM_HOST = 'https://author-p11102-e1347956.adobeaemcloud.com';

// URL of the folder in AEM DAM
const targetUrl = `${AEM_HOST}/content/dam/sample-1234`;

// Correct file paths (Ensure proper escaping for Windows paths)
const filePaths = [
    `${__dirname}${path.sep}bird123.jpg`
];

// Encode authentication credentials
const authHeader = 'Basic ' + Buffer.from(`${AEM_USERNAME}:${AEM_PASSWORD}`).toString('base64');


const run = async () => {
    const options = new FileSystemUploadOptions()
        .withUrl(targetUrl)
        .withHttpOptions({
            headers: {
                Authorization: `${authHeader}`
            }
        });

    // upload a single asset and all assets in a given folder
    const fileUpload = new FileSystemUpload();
    fileUpload.upload(options, filePaths);
}

run()