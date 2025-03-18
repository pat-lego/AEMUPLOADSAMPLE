const fs = require('fs'); // Required to get actual file sizes
const DirectBinary = require('@adobe/aem-upload');

const AEM_USERNAME = 'admin';
const AEM_PASSWORD = 'admin';
const AEM_HOST = 'http://localhost:4502';

// URL of the folder in AEM DAM
const targetUrl = `${AEM_HOST}/content/dam/test1234`;

// Correct file paths (Ensure proper escaping for Windows paths)
const filePaths = [
    "C:\\Users\\vramireddy\\Documents\\AEMUPLOAD\\DALL·E 2025-03-14 22.56.34.webp",
    "C:\\Users\\vramireddy\\Pictures\\Screenshots\\Screenshot 2024-10-21 141218.png"
];

// Dynamically get file sizes
const uploadFiles = filePaths.map(filePath => ({
    fileName: filePath.split(/[\\/]/).pop(), // Extract filename from path
    fileSize: fs.statSync(filePath).size, // Get actual file size
    filePath: filePath
}));

// Encode authentication credentials
const authHeader = 'Basic ' + Buffer.from(`${AEM_USERNAME}:${AEM_PASSWORD}`).toString('base64');

// Create an instance of DirectBinaryUpload with authentication headers
const upload = new DirectBinary.DirectBinaryUpload({
    headers: { Authorization: authHeader }
});

// Configure upload options with replace enabled
const options = new DirectBinary.DirectBinaryUploadOptions()
    .withUrl(targetUrl)
    .withUploadFiles(uploadFiles)

// Upload the files
upload.uploadFiles(options)
    .then(result => {
        console.log("Upload Successful:", result);
    })
    .catch(err => {
        console.error("Upload Failed:", err);
    });
