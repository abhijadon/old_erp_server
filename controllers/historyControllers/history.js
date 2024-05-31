// const {HistoryModel} = require('@/models/Addonhistory')
// const history = async (req, res) => {
//   try {
//     const query = { removed: false }; // Query for non-removed documents

//     // Promise for results sorted by creation date in descending order and populating user info
//     const resultsPromise = HistoryModel.find(query)
//       .sort({ createdAt: 'desc' }).populate('userId dataId')

//     // Promise for counting total documents matching the query
//     const countPromise = HistoryModel.countDocuments(query);

//     // Wait for both promises to resolve
//     const [results, count] = await Promise.all([resultsPromise, countPromise]);

//     // Check if results are available
//     if (count > 0) {
//       // Formatting results to return the necessary data
//       const formattedResults = results.map(item => ({
//         ...item.toObject(), // Convert Mongoose document to plain JavaScript object
//         date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : null, // Format date
//         time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US') : null, // Format time
//       }));

//       return res.status(200).json({
//         success: true,
//         result: formattedResults,
//         count,
//         message: 'Successfully found all documents',
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         result: [],
//         count: 0,
//         message: 'No data found matching the specified criteria',
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       result: [],
//       message: `An error occurred: ${error.message}`, // Better error message
//       error: error,
//     });
//   }
// };

// module.exports = history;
