
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { mockReports as rawMockReports, mockAchievements as rawMockAchievements } from '@/data/mock';
import type { Report, Achievement } from '@/types';

// Helper to convert mock achievement icon component to string name
const getIconName = (iconComponent: React.ElementType | undefined): keyof typeof import('lucide-react') | undefined => {
  if (!iconComponent) return undefined;
  // This is a heuristic. In a real app, you might have a map or store the name directly in mock data.
  const name = iconComponent.displayName || iconComponent.name;
  if (name && ['Award', 'ShieldCheck', 'Users', 'TrendingUp'].includes(name)) {
    return name as keyof typeof import('lucide-react');
  }
  return undefined;
};


export const seedInitialData = async () => {
  console.log("Attempting to seed initial data...");

  try {
    // Seed Reports
    const reportsCollectionRef = collection(db, 'reports');
    const reportsSnapshot = await getDocs(reportsCollectionRef);
    if (reportsSnapshot.empty) {
      const batch = writeBatch(db);
      rawMockReports.forEach((mockReportItem) => {
        const docRef = doc(reportsCollectionRef, mockReportItem.id); // Use mock ID

        // Destructure to handle potentially undefined optional fields
        const {
          id, // Exclude id from data being set, as it's used for docRef
          submittedAt,
          dateOfIncidence,
          mediaProof,
          mediaProofUrl,
          ...otherData
        } = mockReportItem;

        const reportDataForFirestore: any = {
          ...otherData, // Spread the rest of the report data
          dateOfIncidence: dateOfIncidence, // Already a string
          submittedAt: Timestamp.fromDate(new Date(submittedAt)), // Convert to Firestore Timestamp
        };

        // Conditionally add optional fields only if they are not undefined
        if (mediaProof !== undefined) {
          reportDataForFirestore.mediaProof = mediaProof;
        } else {
          // Ensure field is not set if undefined
          delete reportDataForFirestore.mediaProof;
        }
        
        if (mediaProofUrl !== undefined) {
          reportDataForFirestore.mediaProofUrl = mediaProofUrl;
        } else {
          delete reportDataForFirestore.mediaProofUrl;
        }


        batch.set(docRef, reportDataForFirestore);
      });
      await batch.commit();
      console.log('Mock reports seeded successfully.');
    } else {
      console.log('Reports collection already contains data. Skipping seed.');
    }

    // Seed Achievements
    const achievementsCollectionRef = collection(db, 'achievements');
    const achievementsSnapshot = await getDocs(achievementsCollectionRef);
    if (achievementsSnapshot.empty) {
      const batch = writeBatch(db);
      rawMockAchievements.forEach((achievement) => {
        const docRef = doc(achievementsCollectionRef, achievement.id); // Use mock ID
        // Firestore cannot store React components, so iconName is used
        const { icon, ...restOfAchievement } = achievement; 
        const achievementDataForFirestore: Omit<Achievement, 'icon'> & { iconName?: string } = {
          ...restOfAchievement,
          iconName: achievement.iconName || getIconName(icon), // Use existing iconName or derive it
        };
        batch.set(docRef, achievementDataForFirestore);
      });
      await batch.commit();
      console.log('Mock achievements seeded successfully.');
    } else {
      console.log('Achievements collection already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

