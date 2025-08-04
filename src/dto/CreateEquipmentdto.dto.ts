export interface CreateEquipmentdto {

  title: string;
  description: string;
  category: 'HeavyMachinery' | 'LightMachinery' | 'Tools' | 'Vehicles';
  images: string[]; // Array of image URLs
}
