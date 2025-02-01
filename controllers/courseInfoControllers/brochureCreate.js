const { ref, deleteObject } = require('firebase/storage');
const { courseInfo } = require('@/models/courseInfo');
const { storage } = require('@/firebase/brochureFirebase'); // Ensure correct path to storage

// Upload brochure
exports.uploadBrochure = async (req, res) => {
  try {
    const { university, course, electives } = req.body;
    const brochures = req.imageUrls && req.imageUrls.brochure ? req.imageUrls.brochure : [];
    const sampleMarksheets = req.imageUrls && req.imageUrls.sampleMarksheet ? req.imageUrls.sampleMarksheet : [];
    const sampleDegrees = req.imageUrls && req.imageUrls.sampleDegree ? req.imageUrls.sampleDegree : [];

    // Construct the query based on provided filters
    let query = {};
    if (university) query.university = university;
    if (course) query.course = course;
    if (electives) query.electives = electives;

    // Find all documents matching the query
    const courses = await courseInfo.find(query);

    // Update brochure URLs for all matching documents
    const updatedCourses = await Promise.all(courses.map(async (courseDoc) => {
      brochures.forEach((brochure) => {
        courseDoc.brochure.push({
          downloadURL: brochure.downloadURL,
          university,
          course: courseDoc.course,
          electives,
        });
      });
      sampleMarksheets.forEach((sampleMarksheet) => {
        courseDoc.sampleMarksheets.push({
          downloadURL: sampleMarksheet.downloadURL,
          university,
        });
      });
      sampleDegrees.forEach((sampleDegree) => {
        courseDoc.sampleDegrees.push({
          downloadURL: sampleDegree.downloadURL,
          university,
        });
      });
      return await courseDoc.save();
    }));

    console.log('Updated courses:', updatedCourses); // Debugging statement
    res.status(200).json({
      success: true,
      result: updatedCourses,
      message: 'Brochure has been uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading brochures:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch brochures by university, course, and electives with filtering and sorting
exports.fetchBrochures = async (req, res) => {
  try {
    const { university, course, electives, sortBy, sortOrder } = req.query;

    // Construct the filter based on provided query parameters
    let filter = {};
    if (university) filter['brochure.university'] = university;
    if (course) filter['brochure.course'] = course;
    if (electives) filter['brochure.electives'] = electives;

    // Construct the sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Find and sort courses based on the filter and sort options
    const courses = await courseInfo.find(filter).sort(sortOptions);

    // Extract brochures, marksheets, and degrees from the fetched courses
    let brochures = [];
    let sampleMarksheets = [];
    let sampleDegrees = [];
    courses.forEach(course => {
      brochures = brochures.concat(course.brochure.map(brochure => ({
        university: brochure.university,
        course: brochure.course,
        electives: brochure.electives,
        downloadURL: brochure.downloadURL,
      })));
      sampleMarksheets = sampleMarksheets.concat(course.sampleMarksheets.map(sampleMarksheet => ({
        university: sampleMarksheet.university,
        downloadURL: sampleMarksheet.downloadURL,
      })));
      sampleDegrees = sampleDegrees.concat(course.sampleDegrees.map(sampleDegree => ({
        university: sampleDegree.university,
        downloadURL: sampleDegree.downloadURL,
      })));
    });

    const count = brochures.length; // Get the count of brochures

    res.json({ count, brochures, sampleMarksheets, sampleDegrees }); // Include the count in the response
  } catch (error) {
    console.error('Error fetching brochures:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBrochureFromDatabase = async (req, res) => {
  try {
    const { fileUrl, university, course, electives } = req.body;

    if (!fileUrl || !university || !course) {
      return res.status(400).json({ success: false, message: 'File URL, university, and course are required' });
    }

    // Construct the query to find the document
    const query = {
      university,
      course,
      'brochure.downloadURL': fileUrl
    };

    // Update the document to remove the specific brochure entry
    const update = {
      $pull: {
        brochure: { downloadURL: fileUrl }
      }
    };

    const updatedCourse = await courseInfo.findOneAndUpdate(query, update, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      result: updatedCourse,
      message: 'File entry has been deleted from the database successfully',
    });
  } catch (error) {
    console.error('Error deleting file entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
