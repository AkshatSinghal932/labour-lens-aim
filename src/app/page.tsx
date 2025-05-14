
"use client";

import { useEffect, useState, useCallback } from 'react';
import type { Report as ReportType, Achievement as AchievementType } from '@/types';
import ReportCard from '@/components/ReportCard';
import AchievementCard from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { generateReportHeadline, type GenerateReportHeadlineInput } from '@/ai/flows/generate-report-headline';

export default function DashboardPage() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const { t } = useLanguage();
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation();

  const fetchAndSetHeadlines = useCallback(async (fetchedReports: ReportType[]) => {
    const reportsWithHeadlines = await Promise.all(
      fetchedReports.map(async (report) => {
        if (report.headline) {
          return report; // Already has a headline
        }
        try {
          const headlineInput: GenerateReportHeadlineInput = {
            description: report.description,
            typeOfIncidence: report.typeOfIncidence,
            location: report.location,
            city: report.city,
          };
          const headlineOutput = await generateReportHeadline(headlineInput);
          
          // Optionally, update Firestore with the generated headline
          // This is good for persistence and reducing future AI calls
          if (db && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            const reportRef = doc(db, 'reports', report.id);
            await updateDoc(reportRef, { headline: headlineOutput.headline });
          }

          return { ...report, headline: headlineOutput.headline };
        } catch (error) {
          console.error(`Error generating headline for report ${report.id}:`, error);
          return { ...report, headline: `${report.typeOfIncidence} in ${report.city}` }; // Fallback headline
        }
      })
    );
    setReports(reportsWithHeadlines);
  }, []);


  useEffect(() => {
    const fetchReports = async () => {
      setIsLoadingReports(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setReports([]);
          setIsLoadingReports(false);
          return;
        }
        const reportsQuery = query(collection(db, 'reports'), orderBy('submittedAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(reportsQuery);
        const fetchedReports = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            submittedAt: (data.submittedAt as Timestamp).toDate().toISOString(),
            dateOfIncidence: data.dateOfIncidence, 
            headline: data.headline || undefined, // Ensure headline is part of the type
          } as ReportType;
        });
        // Set reports first for quick display, then generate headlines
        setReports(fetchedReports); 
        await fetchAndSetHeadlines(fetchedReports);

      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoadingReports(false);
      }
    };

    const fetchAchievements = async () => {
      setIsLoadingAchievements(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setAchievements([]);
          setIsLoadingAchievements(false);
          return;
        }
        const achievementsQuery = query(collection(db, 'achievements'), orderBy('title')); 
        const querySnapshot = await getDocs(achievementsQuery);
        const fetchedAchievements = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        } as AchievementType));
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setIsLoadingAchievements(false);
      }
    };
    
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      fetchReports();
      fetchAchievements();
    } else {
      setIsLoadingReports(false);
      setIsLoadingAchievements(false);
      console.warn("Firebase Project ID not set. Skipping data fetching for dashboard.");
    }

  }, [fetchAndSetHeadlines]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">{t('appName')}</h1>
        <p className="text-lg text-muted-foreground">{t('dashboardTitle')}</p>
      </header>

      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-semibold">{t('nearbyReportsTitle')}</h2>
        </div>
        {locationLoading && <p>{t('loading')} User location...</p>}
        {locationError && <p className="text-destructive">Location permission denied. Displaying recent reports.</p>}
        
        {isLoadingReports && reports.length === 0 ? ( // Show skeletons only if truly loading and no reports yet
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t('noNearbyReports')}</p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-semibold">{t('achievementsTitle')}</h2>
        </div>
        {isLoadingAchievements ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
               <Skeleton className="h-32 w-full" />
               <Skeleton className="h-6 w-3/4 mt-2" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-2/3" />
             </div>
           ))}
         </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No achievements to display.</p>
        )
        }
      </section>
    </div>
  );
}
