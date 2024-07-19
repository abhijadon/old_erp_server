const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const multer = require('multer');

const firebaseConfig = {
  apiKey: "AIzaSyDWswHF0Oukc6LNXllkwmx2PWg3dKn62-8",
  authDomain: "erp-sode.firebaseapp.com",
  projectId: "erp-sode",
  storageBucket: "erp-sode.appspot.com",
  messagingSenderId: "521894701394",
  appId: "1:521894701394:web:b51774c5764babec77328b",
  measurementId: "G-VKSBE1PNPK"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Middleware function to handle Firebase Storage upload
const firebaseStorageUpload = () => {
  // Configure multer for file upload
  const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: {
      fileSize: 100 * 1024 * 1024 // Increase file size limit to 100 MB
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  });

  // Accept files with different field names
 return upload.fields([
  { name: 'feeDocument', maxCount: 100 }, 
  { name: 'studentDocument', maxCount: 100 }
]);
};


// Middleware function to save image URLs with original names
const saveImageUrls = async (req, res, next) => {
  try {
    req.imageUrls = {}; // Object to store image URLs for different document types

    // Check if files were uploaded
    if (req.files) {
      // Iterate over each uploaded file
      for (const fieldName of Object.keys(req.files)) {
        const files = req.files[fieldName];
        req.imageUrls[fieldName] = []; // Initialize array for current field

        // Iterate over each file in the current field
        for (const file of files) {
          // Use the original filename for each image
          const fileName = file.originalname;
          
          // Reference to storage location with the original filename within the student's folder
          const fileRef = ref(storage, 'images/' + req.body.lead_id + '/' + fileName); 
          
          // Upload file bytes to storage
          await uploadBytes(fileRef, file.buffer);
          // Get download URL for the uploaded file
          const downloadURL = await getDownloadURL(fileRef);
          // Add the download URL to the appropriate property of the request object
          req.imageUrls[fieldName].push({ originalFileName: fileName, downloadURL: downloadURL });
        }
      }
    } else {
      // If no files were uploaded, initialize empty URLs for each document type
      req.imageUrls.feeDocument = [];
      req.imageUrls.studentDocument = [];
    }
    next(); // Move to the next middleware
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { firebaseStorageUpload, saveImageUrls };