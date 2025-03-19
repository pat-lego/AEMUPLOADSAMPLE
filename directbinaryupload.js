const fs = require('fs'); // Required to get actual file sizes
const path = require('path');
const DirectBinary = require('@adobe/aem-upload');

const AEM_USERNAME = 'testadobe';
const AEM_PASSWORD = 'testadobe';
const AEM_HOST = 'https://author-p11102-e1347956.adobeaemcloud.com';

// URL of the folder in AEM DAM
const targetUrl = `${AEM_HOST}/content/dam/sample-1234`;

// Correct file paths (Ensure proper escaping for Windows paths)
const filePaths = [
    `${__dirname}${path.sep}bird123.jpg`
];

// Dynamically get file sizes
const uploadFiles = filePaths.map(filePath => ({
    fileName: filePath.split(/[\\/]/).pop(), // Extract filename from path
    fileSize: fs.statSync(filePath).size, // Get actual file size
    filePath: filePath,
    replace: true
}));

// Encode authentication credentials
const authHeader = 'Basic ' + Buffer.from(`${AEM_USERNAME}:${AEM_PASSWORD}`).toString('base64');

// Create an instance of DirectBinaryUpload with authentication headers
const upload = new DirectBinary.DirectBinaryUpload();

upload.on('fileuploadstart', (event) => {
    console.log('fileuploadstart ' + JSON.stringify(event));
})

upload.on('fileuploadend', (event) => {
    console.log('fileuploadend ' + JSON.stringify(event));
})

upload.on('foldercreated', (event) => {
    console.log('foldercreated ' + JSON.stringify(event));
})

// Configure upload options with replace enabled
const options = new DirectBinary.DirectBinaryUploadOptions()
    .withUrl(targetUrl)
    .withUploadFiles(uploadFiles)
    .withHttpOptions({
        headers: {
            Authorization: authHeader
        }
    })

// Upload the files
upload.uploadFiles(options)
    .then(result => {
        console.log("Upload Successful:", JSON.stringify(result, null, 2));
    })
    .catch(err => {
        console.error("Upload Failed:", JSON.stringify(err, null, 2));
    });
