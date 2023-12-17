export default interface PatientPhoto {
    presignedUrl: string;
    mlDiagnosis: string;
    isReviewed: boolean;
    reviewedBy: string;
    correctedDiagnosis: string;
}