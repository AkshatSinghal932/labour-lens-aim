
export interface Report {
  id: string; // Firestore document ID
  anonymousUserId: string;
  dateOfIncidence: string; // ISO string date
  location: string;
  city: string;
  typeOfIncidence: ReportType;
  description: string;
  mediaProof?: { // For mock data consistency and form display
    name: string;
    type: string; 
  };
  mediaProofUrl?: string; // URL from Firebase Storage
  submittedAt: string; // ISO string date (converted from Firestore Timestamp)
  status: 'Pending' | 'Reviewed' | 'ActionTaken';
  headline?: string; // AI-generated headline
}

export type ReportType = 
  | 'Wage Theft' 
  | 'Safety Violation' 
  | 'Unfair Wages' 
  | 'Unsafe Working Conditions' 
  | 'Child Labor'
  | 'Harassment'
  | 'Discrimination'
  | 'Other';

export const reportTypes: ReportType[] = [
  'Wage Theft', 
  'Safety Violation', 
  'Unfair Wages', 
  'Unsafe Working Conditions',
  'Child Labor',
  'Harassment',
  'Discrimination',
  'Other'
];

export interface Achievement {
  id: string; // Firestore document ID
  title: string;
  description: string;
  iconName?: keyof typeof import('lucide-react'); // Store icon name for dynamic import
  imageUrl?: string;
}

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export type Language = 'en' | 'hi';
