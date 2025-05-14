
"use client";

import { useEffect, useState } from 'react';
import type { Achievement as AchievementType } from '@/types';
import AchievementCard from '@/components/AchievementCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; // Corrected import for query
import { Award } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoadingAchievements(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setAchievements([]);
          setIsLoadingAchievements(false);
          return;
        }
        // Assuming achievements might be ordered by a 'title' field
        // Adjust if you have a date field or prefer another order
        const achievementsQuery = query(collection(db, 'achievements'), orderBy('title')); 
        const querySnapshot = await getDocs(achievementsQuery);
        const fetchedAchievements = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        } as AchievementType));
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        // Optionally, set an error state here to display to the user
        setAchievements([]); // Clear achievements on error
      } finally {
        setIsLoadingAchievements(false);
      }
    };
    
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      fetchAchievements();
    } else {
      setIsLoadingAchievements(false);
      setAchievements([]); // Ensure achievements are empty if Firebase is not configured
      console.warn("Firebase Project ID not set. Skipping data fetching for achievements page.");
    }

  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">{t('achievementsPageTitle')}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{t('achievementsTitle')}</p>
      </header>

      <section>
        {isLoadingAchievements ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md bg-card">
               <Skeleton className="h-40 w-full bg-muted" />
               <Skeleton className="h-6 w-3/4 mt-2 bg-muted" />
               <Skeleton className="h-4 w-full bg-muted" />
               <Skeleton className="h-4 w-2/3 bg-muted" />
             </div>
           ))}
         </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12 text-xl">{t('noAchievements')}</p>
        )}
      </section>
    </div>
  );
}
