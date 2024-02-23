const DataRecord = require('@/models/Application');  // Assuming you have a DataRecord model
const UserAction = require('@/models/UserAction');  // Assuming you have a UserAction model

const submitData = async (req, res) => {
    try {
        const { newData } = req.body;

        const newDataRecord = new DataRecord({
            userId: req.user._id,
            data: newData,
        });

        await newDataRecord.save();

        // Log the action
        const userAction = new UserAction({
            userId: req.user._id,
            action: 'Submit Data',
        });
        await userAction.save();

        res.json({ success: true, message: 'Data submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    submitData,
};
