const fs = require('fs'); // Required to get actual file sizes
const DirectBinary = require('@adobe/aem-upload');

const AEM_USERNAME = 'pat';
const AEM_PASSWORD = 'pat';
const AEM_HOST = 'https://author-p151259-e1559157.adobeaemcloud.com';

// URL of the folder in AEM DAM
const targetUrl = `${AEM_HOST}/content/dam/test2-patwashere-1`;

const credentials = Buffer.from(`${AEM_USERNAME}:${AEM_PASSWORD}`).toString('base64')

// Correct file paths (Ensure proper escaping for Windows paths)
const filePaths = [
    "/Users/patriquelegault/Documents/samples/birdy1.jpeg",
    "/Users/patriquelegault/Documents/samples/bird2.jpg",
    "/Users/patriquelegault/Documents/samples/birdy3.jpeg"
];

// Dynamically get file sizes
const uploadFiles = filePaths.map(filePath => ({
    fileName: filePath.split(/[\\/]/).pop(), // Extract filename from path
    fileSize: fs.statSync(filePath).size, // Get actual file size
    filePath: filePath
}));

// Encode authentication credentials
const authHeader = `Basic ${credentials}`;

// Create an instance of DirectBinaryUpload with authentication headers
const upload = new DirectBinary.DirectBinaryUpload({
    headers: { Authorization: authHeader }
});

// Configure upload options with replace enabled
const options = new DirectBinary.DirectBinaryUploadOptions()
    .withUrl(targetUrl)
    .withUploadFiles(uploadFiles)
    .withHttpOptions({
        headers: {
            Authorization: authHeader
        }
    })

upload.on('foldercreated', (folderName, targetParent, targetFolder) => {
    console.log(`foldercreated was called ${folderName}, ${targetParent}, ${targetFolder}`);
});

upload.on('fileend', data => {
    const { fileName } = data;

    console.log(`fileend with ${fileName}`);
});

upload.on('filestart', data => {
    const { fileName } = data;

    console.log(`filestart with ${fileName}`);
});
// Upload the files
upload.uploadFiles(options)
    .then(result => {
        console.log("Upload Successful:", JSON.stringify(result, null, 2));
    })
    .catch(err => {
        console.error("Upload Failed:", JSON.stringify(err, null, 2));
    });
