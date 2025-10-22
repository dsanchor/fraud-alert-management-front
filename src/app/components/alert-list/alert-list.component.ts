import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { AlertService } from '../../services/alert.service';
import { 
  AlertSummaryDto, 
  PagedResponseAlertSummaryDto,
  AlertStatus,
  AlertSeverity,
  BulkUpdateRequest 
} from '../../models/alert.models';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {
  alerts: AlertSummaryDto[] = [];
  displayedColumns: string[] = ['select', 'alertId', 'severity', 'status', 'riskScore', 'customer', 'transaction', 'createdAt', 'actions'];
  
  // Pagination
  totalAlerts = 0;
  currentPage = 1;
  pageSize = 20;
  
  // Filters
  selectedStatus?: AlertStatus;
  selectedSeverity?: AlertSeverity;
  customerIdFilter = '';
  assignedToFilter = '';
  
  // Selection
  selection = new SelectionModel<AlertSummaryDto>(true, []);
  
  // Enum values for dropdowns
  alertStatuses = Object.values(AlertStatus);
  alertSeverities = Object.values(AlertSeverity);
  
  // Bulk update
  bulkUpdateStatus?: AlertStatus;
  bulkAssignedTo = '';

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAllAlerts(
      this.selectedStatus,
      this.selectedSeverity,
      this.customerIdFilter || undefined,
      this.assignedToFilter || undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PagedResponseAlertSummaryDto) => {
        this.alerts = response.alerts || [];
        this.totalAlerts = response.total || 0;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        // Mock data for demonstration
        this.alerts = [
          {
            alertId: 'AL001',
            severity: AlertSeverity.HIGH,
            status: AlertStatus.OPEN,
            riskScore: 8.5,
            createdAt: new Date().toISOString(),
            customer: {
              customerId: 'C000001',
              name: 'John Doe',
              country: 'United States'
            },
            transaction: {
              transactionId: 'TX001',
              amount: 15000,
              currency: 'USD'
            }
          },
          {
            alertId: 'AL002',
            severity: AlertSeverity.CRITICAL,
            status: AlertStatus.INVESTIGATING,
            riskScore: 9.2,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            customer: {
              customerId: 'C000002',
              name: 'Jane Smith',
              country: 'Canada'
            },
            transaction: {
              transactionId: 'TX002',
              amount: 25000,
              currency: 'CAD'
            }
          }
        ];
        this.totalAlerts = 2;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAlerts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAlerts();
  }

  clearFilters(): void {
    this.selectedStatus = undefined;
    this.selectedSeverity = undefined;
    this.customerIdFilter = '';
    this.assignedToFilter = '';
    this.onFilterChange();
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.alerts.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.alerts.forEach(row => this.selection.select(row));
  }

  // Bulk update
  bulkUpdate(): void {
    if (this.selection.selected.length === 0 || !this.bulkUpdateStatus) {
      return;
    }

    const alertIds = this.selection.selected
      .map(alert => alert.alertId)
      .filter(id => id !== undefined) as string[];

    const bulkRequest: BulkUpdateRequest = {
      alertIds,
      status: this.bulkUpdateStatus,
      assignedTo: this.bulkAssignedTo || undefined
    };

    this.alertService.bulkUpdateAlerts(bulkRequest).subscribe({
      next: () => {
        this.selection.clear();
        this.loadAlerts();
        this.bulkUpdateStatus = undefined;
        this.bulkAssignedTo = '';
      },
      error: (error) => {
        console.error('Error in bulk update:', error);
      }
    });
  }

  getSeverityColor(severity?: AlertSeverity): string {
    switch (severity) {
      case AlertSeverity.CRITICAL: return '#f44336';
      case AlertSeverity.HIGH: return '#ff9800';
      case AlertSeverity.MEDIUM: return '#ff5722';
      case AlertSeverity.LOW: return '#4caf50';
      default: return '#757575';
    }
  }

  getStatusColor(status?: AlertStatus): string {
    switch (status) {
      case AlertStatus.OPEN: return '#f44336';
      case AlertStatus.INVESTIGATING: return '#ff9800';
      case AlertStatus.RESOLVED: return '#4caf50';
      case AlertStatus.FALSE_POSITIVE: return '#2196f3';
      default: return '#757575';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount?: number, currency?: string): string {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }
}