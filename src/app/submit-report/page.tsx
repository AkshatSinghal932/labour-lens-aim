"use client";

import ReportSubmissionForm from '@/components/forms/ReportSubmissionForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SubmitReportPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">{t('submitReportTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t('submitReportDescription')}</p>
      </header>
      <ReportSubmissionForm />
    </div>
  );
}
