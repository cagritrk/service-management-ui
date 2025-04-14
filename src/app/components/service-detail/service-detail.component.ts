import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Service } from '../../models/service.model';
import { Resource } from '../../models/resource.model';
import { Owner } from '../../models/owner.model';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-service-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  serviceForm!: FormGroup;
  isNew = signal(false);
  serviceId = signal<string | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id === 'new') {
          this.isNew.set(true);
          this.serviceId.set(null);
          this.isLoading.set(false);
          return of(null);
        } else if (id) {
          this.isNew.set(false);
          this.serviceId.set(id);
          return this.apiService.getServiceById(id);
        } else {
          this.error.set('Invalid route: No service ID provided.');
          this.isLoading.set(false);
          return of(null);
        }
      })
    ).subscribe({
      next: (service) => {
        if (service !== null || this.isNew()) {
          this.initializeForm(service);
        }

        if (!this.isNew()) {
            this.isLoading.set(false);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching service:', err);
        this.error.set(`Failed to load service details. Status: ${err.status} - ${err.message}`);
        this.isLoading.set(false);
      }
    });
  }

  initializeForm(service: Service | null): void {
    this.serviceForm = this.fb.group({
      resources: this.fb.array(service?.resources.map(res => this.createResourceGroup(res)) ?? [])
    });
  }

  createResourceGroup(resource: Resource | null = null): FormGroup {
    return this.fb.group({
      id: [resource?.id ?? null],
      owners: this.fb.array(resource?.owners.map(owner => this.createOwnerGroup(owner)) ?? [], Validators.required)
    });
  }

  createOwnerGroup(owner: Owner | null = null): FormGroup {
    return this.fb.group({
      id: [owner?.id ?? null],
      name: [owner?.name ?? '', Validators.required],
      accountNumber: [owner?.accountNumber ?? '', Validators.required],
      level: [owner?.level ?? 0, [Validators.required, Validators.min(0)]]
    });
  }

  get resources(): FormArray {
    return this.serviceForm.get('resources') as FormArray;
  }

  owners(resourceIndex: number): FormArray {
    return this.resources.at(resourceIndex).get('owners') as FormArray;
  }

  addResource(): void {
    this.resources.push(this.createResourceGroup());
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  addOwner(resourceIndex: number): void {
    this.owners(resourceIndex).push(this.createOwnerGroup());
  }

  removeOwner(resourceIndex: number, ownerIndex: number): void {
    this.owners(resourceIndex).removeAt(ownerIndex);
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      this.error.set('Please fill in all required fields correctly.');
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    const serviceData: Service = this.serviceForm.value;

    const saveObservable = this.isNew()
      ? this.apiService.createService(serviceData)
      : this.apiService.updateService(this.serviceId()!, { ...serviceData, id: this.serviceId()! });

    saveObservable.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/services']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error saving service:', err);
        this.error.set(`Failed to save service. Status: ${err.status} - ${err.message}`);
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/services']);
  }
}
