
"use client";

import { useEffect, useState, useCallback } from 'react';
import ReportCard from '@/components/ReportCard';
import type { Report as ReportType, ReportType as TReportType } from '@/types';
import { reportTypes } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, ListFilter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, where, QueryConstraint, doc, updateDoc } from 'firebase/firestore';
import { generateReportHeadline, type GenerateReportHeadlineInput } from '@/ai/flows/generate-report-headline';


export default function ViewReportsPage() {
  const { t, language } = useLanguage();
  const [allReports, setAllReports] = useState<ReportType[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TReportType | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState(''); // City filter

  const fetchAndSetHeadlinesForAll = useCallback(async (fetchedReports: ReportType[]) => {
    const reportsToUpdateHeadlines = fetchedReports.filter(report => !report.headline);
    if (reportsToUpdateHeadlines.length === 0) {
      setAllReports(fetchedReports);
      setFilteredReports(fetchedReports); // Apply initial filters if any
      return;
    }

    const reportsWithHeadlines = await Promise.all(
      fetchedReports.map(async (report) => {
        if (report.headline) {
          return report;
        }
        try {
          const headlineInput: GenerateReportHeadlineInput = {
            description: report.description,
            typeOfIncidence: report.typeOfIncidence,
            location: report.location,
            city: report.city,
          };
          const headlineOutput = await generateReportHeadline(headlineInput);
          
          if (db && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            const reportRef = doc(db, 'reports', report.id);
            await updateDoc(reportRef, { headline: headlineOutput.headline });
          }
          return { ...report, headline: headlineOutput.headline };
        } catch (error) {
          console.error(`Error generating headline for report ${report.id}:`, error);
          return { ...report, headline: `${report.typeOfIncidence} in ${report.city}` }; 
        }
      })
    );
    setAllReports(reportsWithHeadlines);
    // Re-apply filters after headlines are fetched
    // This ensures that the filtering logic uses the most up-to-date data, including headlines.
    // The useEffect for filtering will handle this.
  }, []);


  useEffect(() => {
    const fetchAllReports = async () => {
      setIsLoading(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setAllReports([]);
          setFilteredReports([]);
          setIsLoading(false);
          return;
        }
        const reportsQuery = query(collection(db, 'reports'), orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(reportsQuery);
        const fetchedReportsInitial = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            submittedAt: (data.submittedAt as Timestamp).toDate().toISOString(),
            dateOfIncidence: data.dateOfIncidence,
            headline: data.headline || undefined,
          } as ReportType;
        });
        // Set initial reports for quick display
        setAllReports(fetchedReportsInitial); 
        setFilteredReports(fetchedReportsInitial); // Display initially before headlines

        await fetchAndSetHeadlinesForAll(fetchedReportsInitial);
        
      } catch (error) {
        console.error("Error fetching all reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      fetchAllReports();
    } else {
      setIsLoading(false);
      console.warn("Firebase Project ID not set. Skipping data fetching for reports page.");
    }
  }, [fetchAndSetHeadlinesForAll]);

  useEffect(() => {
    let reports = [...allReports];

    if (searchTerm) {
      reports = reports.filter(report =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
        report.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.headline && report.headline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      reports = reports.filter(report => report.typeOfIncidence === selectedType);
    }

    if (locationFilter) { 
      reports = reports.filter(report =>
        report.city.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredReports(reports);
  }, [searchTerm, selectedType, locationFilter, allReports]);

  const getTranslatedReportType = (typeKey: TReportType) => {
    const keyMap = {
      'Wage Theft': 'wageTheft',
      'Safety Violation': 'safetyViolation',
      'Unfair Wages': 'unfairWages',
      'Unsafe Working Conditions': 'unsafeWorkingConditions',
      'Child Labor': 'childLabor',
      'Harassment': 'harassment',
      'Discrimination': 'discrimination',
      'Other': 'other',
    } as const;
    const translationKey = keyMap[typeKey as keyof typeof keyMap];
    return translationKey ? t(translationKey as keyof import('@/types').Translations) : typeKey;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">{t('viewReportsTitle')}</h1>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-muted-foreground mb-1">
              <Search className="inline h-4 w-4 mr-1" />
              Search Reports
            </label>
            <Input
              id="searchTerm"
              placeholder="Keyword, ID, location, city, headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-muted-foreground mb-1">
              <Filter className="inline h-4 w-4 mr-1" />
              {t('filterByType')}
            </label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as TReportType | 'all')}>
              <SelectTrigger id="typeFilter">
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{getTranslatedReportType(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-muted-foreground mb-1">
              <ListFilter className="inline h-4 w-4 mr-1" />
              {t('filterByLocation')} (City)
            </label>
            <Input
              id="locationFilter"
              placeholder="Enter city..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading && filteredReports.length === 0 ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-10 w-full mt-2" />
           </div>
         ))}
       </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">{t('noReportsFound')}</p>
      )}
    </div>
  );
}
