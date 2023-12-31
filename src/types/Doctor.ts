export default interface Doctor {
    doctorId: string;
    image_url: string;
    name: string;
    address1: string;
    address2: string;
    phone: string;
    state: string;
    focus: string[];
    zip: string;
    city: string;
    specialties: string[]; 
    availabilities: Date[];
}