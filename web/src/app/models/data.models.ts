// Modelos de dados compartilhados
export interface Company {
  id: string;
  name: string;
  document: string;
  industry: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyId: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Machine {
  id: string;
  companyId: string;
  name: string;
  model: string;
  serialNumber: string;
  equipmentType: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'IDLE' | 'INACTIVE';
  location?: string;
  operatingHours: number;
  manufactureDate?: Date;
  installationDate?: Date;
  lastMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}
