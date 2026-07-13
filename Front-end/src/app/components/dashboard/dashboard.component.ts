import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { MachinesService, MachineStats } from '../../services/machines.service';

// CRUD Components
import { MachinesCrud } from './machines-crud/machines-crud';
import { UsersCrud } from './users-crud/users-crud';
import { CompaniesCrud } from './companies-crud/companies-crud';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MachinesCrud, UsersCrud, CompaniesCrud],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private machinesService = inject(MachinesService);

  currentUser: User | null = null;
  stats: MachineStats | null = null;
  operationRate = 0;
  isLoadingStats = true;
  statsError = '';

  activeTab: 'maquinas' | 'usuarios' | 'empresas' = 'maquinas';

  setTab(tab: 'maquinas' | 'usuarios' | 'empresas'): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.machinesService.getStatistics().subscribe({
      next: (stats: MachineStats) => {
        this.stats = stats;
        this.operationRate =
          stats.total > 0 ? Math.round((stats.operational / stats.total) * 100) : 0;
        this.isLoadingStats = false;
      },
      error: () => {
        this.statsError = 'Não foi possível carregar os indicadores. Tente atualizar a página.';
        this.isLoadingStats = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
