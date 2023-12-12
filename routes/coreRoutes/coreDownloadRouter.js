const express = require('express');
const path = require('path');
const router = express.Router();
const { hasPermission } = require('@/middlewares/permission');
const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');

router.get('/:directory/:file', function (req, res) {
  const { directory, file } = req.params;
  const filePath = path.join(__dirname, `../../public/download/${directory}/${file}`);

  const options = {
    dotfiles: 'deny',
    headers: {
      'Content-type': 'application/pdf',
      'Content-disposition': `inline; filename="${file}"`,
    },
  };

  res.status(200).sendFile(filePath, options, function (error) {
    if (error) {
      const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
      downloadPdf(req, res, { directory, id });
    }
  });
});

module.exports = router;
