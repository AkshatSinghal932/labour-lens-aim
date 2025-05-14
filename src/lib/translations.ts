
import type { Translations } from '@/types';

export const translations: Translations = {
  // Header & Nav
  appName: { en: 'Labour Lens', hi: 'लेबर लेंस' },
  navDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  navSubmitReport: { en: 'Submit Report', hi: 'रिपोर्ट जमा करें' },
  navViewReports: { en: 'View Reports', hi: 'रिपोर्ट देखें' },
  navAchievements: { en: 'Achievements', hi: 'उपलब्धियां' }, // Added translation for Achievements
  language: { en: 'Language', hi: 'भाषा' },
  english: { en: 'English', hi: 'अंग्रेज़ी' },
  hindi: { en: 'Hindi', hi: 'हिन्दी' },

  // Dashboard Page
  dashboardTitle: { en: 'Welcome to Labour Lens', hi: 'लेबर लेंस में आपका स्वागत है' },
  nearbyReportsTitle: { en: 'Nearby Recent Reports', hi: 'आस-पास की हालिया रिपोर्टें' },
  achievementsTitle: { en: 'Our Impact & Achievements', hi: 'हमारा प्रभाव और उपलब्धियां' },
  noNearbyReports: { en: 'No recent reports near your location.', hi: 'आपके स्थान के पास कोई हालिया रिपोर्ट नहीं है।' },
  viewReportButton: { en: 'View Full Report', hi: 'पूरी रिपोर्ट देखें' },

  // Submit Report Page
  submitReportTitle: { en: 'Submit a New Report', hi: 'नई रिपोर्ट जमा करें' },
  submitReportDescription: { en: 'Detail labour exploitation, unfair wages, or unsafe working conditions.', hi: 'श्रमिक शोषण, अनुचित मजदूरी, या असुरक्षित कामकाजी परिस्थितियों का विवरण दें।' },
  dateOfIncidenceLabel: { en: 'Date of Incidence', hi: 'घटना की तारीख' },
  locationLabel: { en: 'Location (e.g., Address, Area)', hi: 'स्थान (उदा. पता, क्षेत्र)' },
  cityLabel: { en: 'City', hi: 'शहर' },
  typeOfIncidenceLabel: { en: 'Type of Incidence', hi: 'घटना का प्रकार' },
  selectTypePlaceholder: { en: 'Select type', hi: 'प्रकार चुनें' },
  descriptionLabel: { en: 'Description of Incidence', hi: 'घटना का विवरण' },
  mediaProofLabel: { en: 'Photo/Video Proof', hi: 'फोटो/वीडियो सबूत' },
  submitButton: { en: 'Submit Report', hi: 'रिपोर्ट जमा करें' },
  reportSubmittedSuccess: { en: 'Report submitted successfully!', hi: 'रिपोर्ट सफलतापूर्वक जमा की गई!' },
  reportSubmissionError: { en: 'Failed to submit report. Please try again.', hi: 'रिपोर्ट जमा करने में विफल। कृपया पुनः प्रयास करें।' },
  uploadingProof: { en: 'Uploading proof...', hi: 'सबूत अपलोड हो रहा है...' },
  fieldRequired: { en: 'This field is required', hi: 'यह फ़ील्ड आवश्यक है' },
  selectDate: { en: 'Select date', hi: 'तारीख चुनें' },

  // Report Types
  wageTheft: { en: 'Wage Theft', hi: 'मजदूरी चोरी' },
  safetyViolation: { en: 'Safety Violation', hi: 'सुरक्षा उल्लंघन' },
  unfairWages: { en: 'Unfair Wages', hi: 'अनुचित मजदूरी' },
  unsafeWorkingConditions: { en: 'Unsafe Working Conditions', hi: 'असुरक्षित काम करने की स्थिति' },
  childLabor: { en: 'Child Labor', hi: 'बाल श्रम' },
  harassment: { en: 'Harassment', hi: 'उत्पीड़न' },
  discrimination: { en: 'Discrimination', hi: 'भेदभाव' },
  other: { en: 'Other', hi: 'अन्य' },
  
  // Reports Page
  viewReportsTitle: { en: 'Browse Reports', hi: 'रिपोर्ट ब्राउज़ करें' },
  filterByType: { en: 'Filter by Type', hi: 'प्रकार से फ़िल्टर करें' },
  filterByLocation: { en: 'Filter by Location', hi: 'स्थान से फ़िल्टर करें' },
  allTypes: { en: 'All Types', hi: 'सभी प्रकार' },
  noReportsFound: { en: 'No reports found matching your criteria.', hi: 'आपके मानदंडों से मेल खाने वाली कोई रिपोर्ट नहीं मिली।' },

  // Achievements Page
  achievementsPageTitle: { en: 'Our Achievements', hi: 'हमारी उपलब्धियां' }, // Added for new achievements page
  noAchievements: { en: 'No achievements to display yet.', hi: 'अभी प्रदर्शित करने के लिए कोई उपलब्धि नहीं है।' }, // Added for new achievements page

  // Report Card & Details Modal
  reportId: { en: 'Report ID', hi: 'रिपोर्ट आईडी' },
  date: { en: 'Date', hi: 'तारीख' },
  location: { en: 'Location', hi: 'स्थान' },
  type: { en: 'Type', hi: 'प्रकार' },
  status: { en: 'Status', hi: 'स्थिति' },
  submittedAt: { en: 'Submitted At', hi: 'जमा करने का समय'},
  yes: { en: 'Yes', hi: 'हाँ' },
  no: { en: 'No', hi: 'नहीं' },
  reportDetailsDescription: { en: 'Detailed information about the submitted report.', hi: 'जमा की गई रिपोर्ट के बारे में विस्तृत जानकारी।' },
  closeButton: { en: 'Close', hi: 'बंद करें' },
  viewMediaProof: { en: 'View Media Proof', hi: 'मीडिया सबूत देखें'},
  mediaProofNotAvailableOnline: { en: 'Media proof submitted (Name: {fileName}). Not available for online view or URL missing.', hi: 'मीडिया सबूत जमा किया गया (नाम: {fileName})। ऑनलाइन देखने के लिए उपलब्ध नहीं है या URL गायब है।' },
  noMediaProofSubmitted: { en: 'No media proof was submitted with this report.', hi: 'इस रिपोर्ट के साथ कोई मीडिया सबूत जमा नहीं किया गया।' },


  // General
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
};
