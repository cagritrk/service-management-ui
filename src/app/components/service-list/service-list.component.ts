import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceSummary } from '../../models/service-summary.model';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  private apiService = inject(ApiService);

  services = signal<ServiceSummary[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.error.set(null);
    this.apiService.getAllServiceSummaries().subscribe({
      next: (data) => {
        this.services.set(data);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching services:', err);
        this.error.set(`Failed to load services. Status: ${err.status} - ${err.message}`);
      }
    });
  }

  deleteService(id: string | undefined, event: Event): void {
    event.stopPropagation();
    if (!id) return;

    if (confirm(`Are you sure you want to delete service ${id}?`)) {
      this.error.set(null);
      this.apiService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (err: HttpErrorResponse) => {
          console.error(`Error deleting service ${id}:`, err);
          this.error.set(`Failed to delete service ${id}. Status: ${err.status} - ${err.message}`);
        }
      });
    }
  }
}
