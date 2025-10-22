import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

import { AlertService } from '../../services/alert.service';
import { 
  AlertDto, 
  AlertUpdateRequest, 
  NoteRequest, 
  NoteResponse,
  AlertStatus,
  AlertSeverity,
  DecisionAction 
} from '../../models/alert.models';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatListModule
  ],
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.scss']
})
export class AlertDetailComponent implements OnInit {
  alertId: string = '';
  alert: AlertDto | null = null;
  notes: string[] = [];
  
  // Edit mode
  isEditMode = false;
  editableAlert: Partial<AlertUpdateRequest> = {};
  newNote = '';
  
  // Enum values for dropdowns
  alertStatuses = Object.values(AlertStatus);
  alertSeverities = Object.values(AlertSeverity);
  decisionActions = Object.values(DecisionAction);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.alertId = params['id'];
      if (this.alertId) {
        this.loadAlert();
        this.loadNotes();
      }
    });

    // Check if we're in edit mode
    this.isEditMode = this.route.snapshot.url.some(segment => segment.path === 'edit');
  }

  loadAlert(): void {
    this.alertService.getAlertById(this.alertId).subscribe({
      next: (alert) => {
        this.alert = alert;
        this.initializeEditableAlert();
      },
      error: (error) => {
        console.error('Error loading alert:', error);
        // Mock data for demonstration
        this.alert = {
          alertId: this.alertId,
          severity: AlertSeverity.HIGH,
          status: AlertStatus.OPEN,
          riskScore: 8.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedTo: 'john.doe@company.com',
          customer: {
            customerId: 'C000001',
            name: 'John Doe',
            country: 'United States',
            deviceTrustScore: 0.75,
            hasFraudHistory: false
          },
          transaction: {
            transactionId: 'TX001',
            amount: 15000,
            currency: 'USD',
            destinationCountry: 'Switzerland',
            timestamp: new Date().toISOString()
          },
          riskFactors: [
            'Unusual transaction amount',
            'New destination country',
            'High-risk merchant category'
          ],
          decision: {
            action: DecisionAction.INVESTIGATE,
            reasoning: 'High amount transaction to unusual destination requires investigation'
          },
          notes: []
        };
        this.initializeEditableAlert();
      }
    });
  }

  loadNotes(): void {
    this.alertService.getNotes(this.alertId).subscribe({
      next: (response: NoteResponse) => {
        this.notes = response.notes || [];
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.notes = [
          'Initial alert created from ML model detection',
          'Customer contacted for verification',
          'Transaction temporarily blocked pending review'
        ];
      }
    });
  }

  initializeEditableAlert(): void {
    if (this.alert) {
      this.editableAlert = {
        status: this.alert.status,
        assignedTo: this.alert.assignedTo,
        notes: ''
      };
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.initializeEditableAlert();
    }
  }

  saveAlert(): void {
    if (!this.alert || !this.editableAlert.status) {
      return;
    }

    const updateRequest: AlertUpdateRequest = {
      status: this.editableAlert.status,
      assignedTo: this.editableAlert.assignedTo,
      notes: this.editableAlert.notes
    };

    this.alertService.updateAlert(this.alertId, updateRequest).subscribe({
      next: (updatedAlert) => {
        this.alert = updatedAlert;
        this.isEditMode = false;
        if (this.editableAlert.notes) {
          this.loadNotes(); // Reload notes if a new note was added
        }
      },
      error: (error) => {
        console.error('Error updating alert:', error);
      }
    });
  }

  addNote(): void {
    if (!this.newNote.trim()) {
      return;
    }

    const noteRequest: NoteRequest = {
      note: this.newNote.trim()
    };

    this.alertService.addNote(this.alertId, noteRequest).subscribe({
      next: () => {
        this.newNote = '';
        this.loadNotes();
      },
      error: (error) => {
        console.error('Error adding note:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/alerts']);
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

  getDecisionColor(action?: DecisionAction): string {
    switch (action) {
      case DecisionAction.BLOCK: return '#f44336';
      case DecisionAction.INVESTIGATE: return '#ff9800';
      case DecisionAction.MONITOR: return '#ff5722';
      case DecisionAction.ALLOW: return '#4caf50';
      default: return '#757575';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  formatCurrency(amount?: number, currency?: string): string {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }
}