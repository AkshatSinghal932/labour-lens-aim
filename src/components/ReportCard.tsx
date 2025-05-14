
"use client";

import type { Report } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarDays, Tag, HandCoins, Scale, HardHat, FileText, Building, ShieldAlert, Eye, UserX, AlertOctagon, UsersRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import ReportDetailsModal from '@/components/ReportDetailsModal';

interface ReportCardProps {
  report: Report;
}

const reportTypeIcons: { [key in Report['typeOfIncidence']]: React.ElementType } = {
  'Wage Theft': HandCoins,
  'Safety Violation': ShieldAlert,
  'Unfair Wages': Scale,
  'Unsafe Working Conditions': HardHat,
  'Child Labor': UserX,
  'Harassment': AlertOctagon,
  'Discrimination': UsersRound,
  'Other': FileText,
};

export default function ReportCard({ report }: ReportCardProps) {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ReportIcon = reportTypeIcons[report.typeOfIncidence] || FileText;

  const getTranslatedReportType = (typeKey: Report['typeOfIncidence']) => {
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
  
  const getStatusVariant = (status: Report['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Reviewed': return 'secondary';
      case 'ActionTaken': return 'outline'; 
      default: return 'default';
    }
  };

  const handleViewReportClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg mb-1 flex items-start gap-2"> {/* Changed items-center to items-start for better alignment with multi-line titles */}
              <ReportIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> {/* Added mt-1 for better icon alignment with text */}
              {report.headline ? (
                <span className="flex-1" title={report.headline}>{report.headline}</span> // Removed truncate, added flex-1 to allow text to take space and wrap
              ) : (
                // Fallback if headline is somehow missing after AI generation attempt
                <span className="flex-1">{`${getTranslatedReportType(report.typeOfIncidence)} Report`}</span>
              )}
            </CardTitle>
            <Badge variant={getStatusVariant(report.status)} className="flex-shrink-0">{report.status}</Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {t('submittedAt', 'Submitted')}: {new Date(report.submittedAt).toLocaleDateString(language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{t('date')}: {new Date(report.dateOfIncidence).toLocaleDateString(language)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{t('location')}: {report.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{t('cityLabel')}: {report.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{t('type')}: {getTranslatedReportType(report.typeOfIncidence)}</span>
          </div>
          <p className="text-sm line-clamp-3">{report.description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={handleViewReportClick}>
            <Eye className="mr-2 h-4 w-4" />
            {t('viewReportButton')}
          </Button>
        </CardFooter>
      </Card>
      {isModalOpen && (
        <ReportDetailsModal
          report={report}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
