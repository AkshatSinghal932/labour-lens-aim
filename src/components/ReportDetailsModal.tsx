
"use client";

import type { Report } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Building, Tag, FileText, Clock, Image as ImageIcon, Link as LinkIcon, AlertTriangle, CheckCircle, Hourglass } from 'lucide-react';
import Image from 'next/image';

interface ReportDetailsModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailsModal({ report, isOpen, onClose }: ReportDetailsModalProps) {
  const { t, language } = useLanguage();

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
  
  const StatusIcon = ({ status }: { status: Report['status'] }) => {
    switch (status) {
      case 'Pending': return <Hourglass className="h-4 w-4 mr-1" />;
      case 'Reviewed': return <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />;
      case 'ActionTaken': return <AlertTriangle className="h-4 w-4 mr-1 text-green-500" />;
      default: return <Hourglass className="h-4 w-4 mr-1" />;
    }
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {report.headline || `${t('reportId')}: ${report.id}`}
          </DialogTitle>
          <DialogDescription>
            {t('reportDetailsDescription', 'Detailed information about the submitted report.')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow min-h-0"> {/* Added min-h-0 here */}
          <div className="space-y-4 p-4"> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1 flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-primary" />{t('dateOfIncidenceLabel')}</h3>
                <p className="text-sm text-muted-foreground">{new Date(report.dateOfIncidence).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 flex items-center"><Clock className="h-5 w-5 mr-2 text-primary" />{t('submittedAt')}</h3>
                <p className="text-sm text-muted-foreground">{new Date(report.submittedAt).toLocaleString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1 flex items-center"><MapPin className="h-5 w-5 mr-2 text-primary" />{t('locationLabel')}</h3>
                <p className="text-sm text-muted-foreground">{report.location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 flex items-center"><Building className="h-5 w-5 mr-2 text-primary" />{t('cityLabel')}</h3>
                <p className="text-sm text-muted-foreground">{report.city}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1 flex items-center"><Tag className="h-5 w-5 mr-2 text-primary" />{t('typeOfIncidenceLabel')}</h3>
                    <p className="text-sm text-muted-foreground">{getTranslatedReportType(report.typeOfIncidence)}</p>
                </div>
                 <div>
                    <h3 className="font-semibold mb-1 flex items-center"><StatusIcon status={report.status} />{t('status')}</h3>
                    <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
                 </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1 flex items-center"><FileText className="h-5 w-5 mr-2 text-primary" />{t('descriptionLabel')}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.description}</p>
            </div>

            {report.mediaProofUrl && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  {report.mediaProof?.type?.startsWith('image/') ? <ImageIcon className="h-5 w-5 mr-2 text-primary" /> : <LinkIcon className="h-5 w-5 mr-2 text-primary" />}
                  {t('mediaProofLabel')}
                </h3>
                {report.mediaProof?.type?.startsWith('image/') ? (
                  <div className="mt-2 relative w-full max-w-md h-64 rounded-md overflow-hidden border">
                    <Image 
                        src={report.mediaProofUrl} 
                        alt={report.mediaProof.name || "Evidence"} 
                        fill
                        style={{objectFit: "contain"}}
                        data-ai-hint="evidence image"
                    />
                  </div>
                ) : (
                  <a href={report.mediaProofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                    {report.mediaProof?.name || t('viewMediaProof', 'View Media Proof')}
                  </a>
                )}
              </div>
            )}
             {!report.mediaProofUrl && report.mediaProof && (
                 <div>
                    <h3 className="font-semibold mb-1 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-primary opacity-50" />{t('mediaProofLabel')}</h3>
                    <p className="text-sm text-muted-foreground">{t('mediaProofNotAvailableOnline', 'Media proof submitted, but not available for online view (or no URL). Name: {fileName}').replace('{fileName}', report.mediaProof.name)}</p>
                 </div>
            )}
            {!report.mediaProofUrl && !report.mediaProof && (
                 <div>
                    <h3 className="font-semibold mb-1 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-primary opacity-50" />{t('mediaProofLabel')}</h3>
                    <p className="text-sm text-muted-foreground">{t('noMediaProofSubmitted', 'No media proof was submitted with this report.')}</p>
                 </div>
            )}
            
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('closeButton', 'Close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
