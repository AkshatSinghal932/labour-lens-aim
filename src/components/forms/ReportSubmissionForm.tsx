
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
// Correctly import date-fns locales for client components
import { hi } from 'date-fns/locale/hi';
import { enUS } from 'date-fns/locale/en-US';
import { useLanguage } from "@/contexts/LanguageContext";
import type { ReportType as TReportType } from "@/types"; // Renamed to TReportType
import { reportTypes } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitReportAction } from "@/app/submit-report/actions";
import { useAnonymousId } from "@/hooks/useAnonymousId";

export default function ReportSubmissionForm() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const anonymousId = useAnonymousId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dateFnsLocale, setDateFnsLocale] = useState(enUS);

  useEffect(() => {
    setDateFnsLocale(language === 'hi' ? hi : enUS);
  }, [language]);


  const formSchema = z.object({
    dateOfIncidence: z.date({
      required_error: t('fieldRequired'),
    }),
    location: z.string().min(1, t('fieldRequired')),
    city: z.string().min(1, t('fieldRequired')),
    typeOfIncidence: z.enum(reportTypes as [string, ...string[]], { // Cast to satisfy z.enum
      required_error: t('fieldRequired'),
    }),
    description: z.string().min(10, t('fieldRequired')),
    mediaProof: z.instanceof(File).optional().nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      city: "",
      description: "",
      mediaProof: null,
      // dateOfIncidence will be undefined initially
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!anonymousId) {
      toast({ title: t('reportSubmissionError'), description: "Anonymous ID not available.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('dateOfIncidence', values.dateOfIncidence.toISOString());
    formData.append('location', values.location);
    formData.append('city', values.city);
    formData.append('typeOfIncidence', values.typeOfIncidence);
    formData.append('description', values.description);
    formData.append('anonymousUserId', anonymousId);
    if (values.mediaProof) {
      formData.append('mediaProof', values.mediaProof);
    }
    
    try {
      const result = await submitReportAction(formData);
      if (result.success) {
        toast({
          title: t('reportSubmittedSuccess'),
          description: `${t('reportId')}: ${result.reportId}`,
        });
        form.reset();
        setFilePreview(null);
        setFileName(null);
      } else {
        toast({ title: t('reportSubmissionError'), description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('reportSubmissionError'), description: String(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("mediaProof", file);
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); // No preview for non-image files
      }
    } else {
      form.setValue("mediaProof", null);
      setFilePreview(null);
      setFileName(null);
    }
  };

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
    // Ensure the key exists in keyMap before trying to access it
    const translationKey = keyMap[typeKey as keyof typeof keyMap];
    return translationKey ? t(translationKey as keyof import('@/types').Translations) : typeKey;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <FormField
          control={form.control}
          name="dateOfIncidence"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('dateOfIncidenceLabel')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: dateFnsLocale })
                      ) : (
                        <span>{t('selectDate')}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={dateFnsLocale}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('locationLabel')}</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Near City Mall, Sector 15" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('cityLabel')}</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Springfield, Metropolis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="typeOfIncidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('typeOfIncidenceLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectTypePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTranslatedReportType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('descriptionLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the incident in detail..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="mediaProof"
            render={({ field }) => ( // field is not directly used for input value, but for setValue
            <FormItem>
                <FormLabel>{t('mediaProofLabel')}</FormLabel>
                <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleFileChange} 
                    />
                </FormControl>
                {fileName && <FormDescription>Selected file: {fileName}</FormDescription>}
                {filePreview && (
                    <div className="mt-2">
                    <img src={filePreview} alt="Selected media preview" className="max-h-48 rounded-md border" data-ai-hint="evidence preview" />
                    </div>
                )}
                <FormMessage />
            </FormItem>
            )}
        />


        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('submitButton')}
        </Button>
      </form>
    </Form>
  );
}
