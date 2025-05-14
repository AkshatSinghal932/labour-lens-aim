
"use server";

import type { Report, ReportType as TReportType } from '@/types'; // Renamed ReportType to avoid conflict
import { reportTypes } from '@/types'; // Import reportTypes
import { z } from 'zod';
import { db, storage } from '@/lib/firebase'; 
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const reportSchema = z.object({
  dateOfIncidence: z.string().datetime(), // Expect ISO string from form
  location: z.string().min(1),
  city: z.string().min(1),
  typeOfIncidence: z.enum(reportTypes as [string, ...string[]]), // Use imported reportTypes
  description: z.string().min(10),
  anonymousUserId: z.string().uuid(),
});

// Helper function moved from form for server action context
const fileToDataURI = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
};


export async function submitReportAction(formData: FormData) {
  try {
    if (!db || !storage) {
        console.error("Firebase not initialized properly.");
        return { success: false, error: "Server configuration error. Firebase not available." };
    }
    const rawData = {
      dateOfIncidence: formData.get('dateOfIncidence') as string,
      location: formData.get('location') as string,
      city: formData.get('city') as string,
      typeOfIncidence: formData.get('typeOfIncidence') as TReportType,
      description: formData.get('description') as string,
      anonymousUserId: formData.get('anonymousUserId') as string,
    };
    const mediaProofFile = formData.get('mediaProof') as File | null;


    const validation = reportSchema.safeParse(rawData);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.flatten().fieldErrors);
      return { success: false, error: "Invalid form data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
    }

    const validatedData = validation.data;
    
    // Placeholder for dispatching logic - This part remains conceptual
    console.log(`[DISPATCH ACTION REQUIRED] Report for city: ${validatedData.city}, type: ${validatedData.typeOfIncidence}. Send to relevant authorities and media outlets.`);

    // Handle Media File Upload to Firebase Storage
    let mediaProofUrl: string | undefined = undefined;
    let mediaProofDetails: Report['mediaProof'] | undefined = undefined;

    if (mediaProofFile && mediaProofFile.size > 0) {
      try {
        const storageRef = ref(storage, `reports_media/${Date.now()}_${mediaProofFile.name}`);
        await uploadBytes(storageRef, mediaProofFile);
        mediaProofUrl = await getDownloadURL(storageRef);
        mediaProofDetails = { name: mediaProofFile.name, type: mediaProofFile.type };
        console.log("Media uploaded successfully:", mediaProofUrl);
      } catch (uploadError) {
        console.error("Error uploading media file:", uploadError);
        // Decide if this is a critical error or if the report can proceed without media
        // For now, let it proceed but log the error.
      }
    }
    
    // Store report in Firebase Firestore
    const reportToStore: Omit<Report, 'id' | 'submittedAt'> & { submittedAt: Timestamp } = {
      ...validatedData,
      submittedAt: serverTimestamp() as Timestamp, // Firestore server timestamp
      status: 'Pending',
      ...(mediaProofUrl && { mediaProofUrl }), // Add URL if available
      ...(mediaProofDetails && { mediaProof: mediaProofDetails }), // Add name and type
    };
    
    const docRef = await addDoc(collection(db, "reports"), reportToStore);
    const reportId = docRef.id;

    console.log("Report submitted to Firestore:", { reportId, ...reportToStore });

    return { 
        success: true, 
        reportId,
    };

  } catch (error) {
    console.error("Error submitting report:", error);
    // Check if error is an instance of Error and has a message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
