// controllers/dataController.js
const { Applications } = require('@/models/appModels/Application');
const xlsx = require('xlsx');
exports.uploadData = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const result = await Applications.insertMany(data);
    res.status(200).json({ message: 'Data uploaded successfully', result });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
