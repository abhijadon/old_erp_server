const validateCourseSpecializationMiddleware = (req, res, next) => {
  console.log('Received Request Payload:', req.body);

  // Define your fixed courses and corresponding specializations
  const fixedCourses = {
    '10th': [''],
    '12th': [''],
    BA: [
      'General',
      'Education',
      'English',
      'Journalism & Mass Communication',
      'Economics',
      'History',
      'Political Science',
      'Sociology',
      'Journalism & Mass Communication',
      'Public Administration',
      'Psychology',
      'Hindi',
      'Mathematics',
      'Geography',
    ],
    BBA: [
      'General',
      'Education',
      'Marketing',
      'Human Resource Management',
      'Finance',
      'International Business Management',
      'Operations',
      'Engineering & Project Management',
      'IT & Systems Management',
      'Data Analytics',
      'Project Management & Operations',
      'Digital Marketing',
    ],
    BCA: ['General', 'Cloud and Security', 'Data Analytics'],
    BCOM: [
      'General',
      'Finance',
      'Tax & Accounting',
      'Accounting & Finance',
      'Corporate Accounting (Benchmarked to CA-Ind: Foundation, Intermediate and Final Syllabus)',
      'International Finance & Accounting',
    ],
    BSW: ['General'],
    BLIS: ['General'],
    BSC: [
      'General',
      'IT',
      'CS',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Microbiology',
      'Bio-Technology',
      'Zoology',
      'Animation & Multimedia',
      'Interior Designing',
      'Fashion Technology',
      'Hotel Management',
      'Medical Laboratory Technology',
      'Operation Theater Technology',
      'Radiology & Imaging Technology',
    ],
    MA: [
      'Economics',
      'Buddhist Studies',
      'Home Science',
      'Public Administration',
      'Psychology',
      'English',
      'Hindi',
      'Mathematics',
      'Geography',
      'History',
      'Political Science',
      'Sociology',
      'Education',
      'Journalism & Mass Communication',
    ],

    MCA: [
      'General',
      'Computer Science & IT',
      'Cyber Security',
      'Data Analytics',
      'Data Science ',
      'Artificial Intelligence',
    ],

    MCOM: ['General', 'Finance & Systems', 'Accounting & Finance', 'International Finance'],
    MSW: ['General'],

    MBA: [
      'General',
      'Finance',
      'International Business',
      'Marketing Management',
      'Operation and Production Management',
      'Project Management',
      'Hotel Management',
      'Tourism & Hospitality Management',
      'Supply Chain Management',
      'Hospital Management',
      'Financial Planning & Analysis',
      'Health Care Management',
      'Business Analytics & Intelligence',
      'Branding & Advertising ',
      'Project Leadership Management',
      ,
      'Banking Management',
      'E-commerce Marketing & Management',
      'Mass Communication',
      'Digital Marketing',
      'Risk Management',
      'Business Leadership',
      'Strategic Management',
      'Enterpreneurship',
      'Media & Entertainment Management',
      'Foreign Trade & Global Business Management',
      'Investment Banking & Wealth Management ',
      'Analytics & Data Science',
      'Operations Management',
      'Banking, Financial Services & Insurance',
      'Retail Management',
      'IT & FinTech',
      'Business Analytics',
      'General Management',
      'Systems & Operations Management',
      'Logistics & Supply Chain Management',
      'Finance & Marketing',
      'Information Technology Management',
      'Marketing & Human Resource Management',
      'Healthcare & Hospital Management ',
      'Entrepreneurship & Leadership',
      'Human Resource Management & Finance',
      'International Finance(Syllabus Integrated & Accredited by ACCA, UK)',
      'Business Intelligence & Analytics(Accredited by IoA, UK)',
      'Human Resource',
      'Finance & Human Resource',
      'Digital Business',
      'Opreations',
      'Infrastructure Management',
      'Oil & Gas Management',
      'Power Management ',
      'International Business Management',

      'Fintech Management',
      'Artificial Intelligence & Machine Learning ',

      'Logistics, Materials & Supply Chain Management',

      'Block Chain Management',
      'Agribusiness Management',
      'Hospital Administration & Healthcare Management',
    ],

    MSC: [
      'General',
      'Chemistry',
      'Phycics',
      'Mathematics',
      'Information Technology',
      'Computer Science',
      'Bio-Technology',
      'Zoology',
      'IT',
      'CS',
      'Data science',
      'Animation & Multimedia',
      'Interior Designing',
      ,
      'Fashion Technology',
      'Medical Laboratory Technology',
      ,
      'Optometry',
      'Radiology & Imaging Technology',
    ],

    MLIS: ['General'],
  };

  const { education, customfields } = req.body;
  const course = education?.course || customfields?.enter_specialization;
  let specialization = customfields?.enter_specialization;

  // Check if course is undefined or null
  if (!course) {
    return res.status(400).json({ error: 'Course is required' });
  }

  // Exclude uppercase check for '10th' and '12th'
  if (!(course === '10th' || course === '12th') && course !== course.toUpperCase()) {
    return res.status(400).json({ error: 'Course should be in uppercase' });
  }

  // Check if the course is in the fixedCourses list
  if (!fixedCourses[course]) {
    return res.status(400).json({ error: 'Invalid course' });
  }

  // If specialization is not valid, set it to the default ("General")
  if (!fixedCourses[course].includes(specialization)) {
    specialization = 'General';
  }

  // Update the specialization in the request body
  req.body.customfields.enter_specialization = specialization;

  // Continue to the next middleware or route handler
  next();
};

module.exports = validateCourseSpecializationMiddleware;
