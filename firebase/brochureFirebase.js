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

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

const firebaseStorageUpload = upload.fields([
  { name: 'brochure', maxCount: 100 },
  { name: 'sampleMarksheet', maxCount: 100 },
  { name: 'sampleDegree', maxCount: 100 }
]);

const saveImageUrls = async (req, res, next) => {
  try {
    req.imageUrls = {};

    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const files = req.files[fieldName];
        req.imageUrls[fieldName] = [];

        for (const file of files) {
          const fileName = file.originalname;
          const fileRef = ref(storage, 'brochures/' + req.body.university + '/' + fileName);

          await uploadBytes(fileRef, file.buffer);
          const downloadURL = await getDownloadURL(fileRef);
          const previewURL = `${req.protocol}://${req.get('host')}/preview/${encodeURIComponent(fileName)}`;
          req.imageUrls[fieldName].push({ originalFileName: fileName, downloadURL: downloadURL, previewURL: previewURL });
        }
      }
    } else {
      req.imageUrls.brochure = [];
    }
    next();
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { firebaseStorageUpload, saveImageUrls };