// Serviço de Máquinas
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Machine {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  equipmentType: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'IDLE' | 'INACTIVE';
  location: string;
  operatingHours: number;
  lastMaintenance: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineStats {
  total: number;
  operational: number;
  maintenance: number;
  idle: number;
  inactive: number;
  averageOperatingHours: number;
}

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/machines';

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  getMachineById(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  getMachinesByCompany(companyId: string): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.apiUrl}/company/${companyId}`);
  }

  getStatistics(): Observable<MachineStats> {
    return this.http.get<MachineStats>(`${this.apiUrl}/statistics`);
  }

  createMachine(machine: Partial<Machine>): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine);
  }

  updateMachine(id: string, machine: Partial<Machine>): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/${id}`, machine);
  }

  deleteMachine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
