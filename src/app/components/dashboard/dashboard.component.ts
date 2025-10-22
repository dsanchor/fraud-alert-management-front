import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { AlertService } from '../../services/alert.service';
import { AlertStatisticsDto, AlertSummaryDto, PagedResponseAlertSummaryDto, AlertStatus, AlertSeverity } from '../../models/alert.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: AlertStatisticsDto = {};
  recentAlerts: AlertSummaryDto[] = [];
  displayedColumns: string[] = ['customerId', 'transactions', 'amount', 'avgAmount', 'flagged'];

  // Loading states
  isLoadingStatistics = false;
  isLoadingRecentAlerts = false;

  // Error states
  statisticsError: string | null = null;
  recentAlertsError: string | null = null;

  // Filter state
  showOnlyFlagged = false;

  // Pipeline data derived from statistics
  pipelineData: Array<{
    title: string;
    value: string;
    subtitle: string;
    change: string;
    changeType: string;
    route?: string;
    queryParams?: any;
  }> = [];

  // Customer transaction data will be loaded from API
  customerData: Array<{
    customerId: string;
    country: string;
    transactions: number;  // Total transactions (keeping property name for compatibility)
    amount: number;  // Total amount (keeping property name for compatibility)
    avgAmount: number;
    flagged: boolean;
  }> = [];

  allCustomerData: Array<{
    customerId: string;
    country: string;
    transactions: number;
    amount: number;
    avgAmount: number;
    flagged: boolean;
  }> = [];

  constructor(
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentAlerts();
    this.loadCustomerTransactionData();
  }

  loadStatistics(): void {
    this.isLoadingStatistics = true;
    this.statisticsError = null;

    this.alertService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.updatePipelineData(stats);
        this.isLoadingStatistics = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.statisticsError = 'Failed to load statistics. Please try again later.';
        this.isLoadingStatistics = false;
        this.statistics = {};
        this.pipelineData = [];
      }
    });
  }

  loadRecentAlerts(): void {
    this.isLoadingRecentAlerts = true;
    this.recentAlertsError = null;

    this.alertService.getAllAlerts(AlertStatus.OPEN, undefined, undefined, undefined, 1, 10).subscribe({
      next: (response) => {
        this.recentAlerts = response.alerts || [];
        this.isLoadingRecentAlerts = false;
      },
      error: (error) => {
        console.error('Error loading recent alerts:', error);
        this.recentAlertsError = 'Failed to load recent alerts. Please try again later.';
        this.isLoadingRecentAlerts = false;
        this.recentAlerts = [];
      }
    });
  }

  loadCustomerTransactionData(): void {
    // Load customer transaction data from API - this would typically be a separate endpoint
    // For now, we'll use recent alerts to derive some customer data
    this.alertService.getAllAlerts(undefined, undefined, undefined, undefined, 1, 20).subscribe({
      next: (response) => {
        // Transform alert data into customer transaction summary
        const customerMap = new Map();

        response.alerts?.forEach(alert => {
          if (alert.customer && alert.transaction) {
            const customerId = alert.customer.customerId;
            if (!customerMap.has(customerId)) {
              customerMap.set(customerId, {
                customerId: customerId,
                country: alert.customer.country || 'Unknown',
                transactionsh: 0,
                amount: 0,
                avgAmount: 0,
                flagged: false,
                totalAmount: 0,
                transactionCount: 0
              });
            }

            const customer = customerMap.get(customerId);
            customer.transactionCount++;
            customer.totalAmount += alert.transaction.amount || 0;
            customer.transactions = customer.transactionCount;
            customer.amount = customer.totalAmount;
            customer.avgAmount = customer.totalAmount / customer.transactionCount;
            customer.flagged = alert.status === AlertStatus.OPEN || alert.status === AlertStatus.INVESTIGATING;
          }
        });

        this.allCustomerData = Array.from(customerMap.values()).slice(0, 10);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading customer transaction data:', error);
        this.customerData = [];
        this.allCustomerData = [];
      }
    });
  }

  applyFilter(): void {
    if (this.showOnlyFlagged) {
      this.customerData = this.allCustomerData.filter(customer => customer.flagged);
    } else {
      this.customerData = [...this.allCustomerData];
    }
  }

  toggleFilter(filterType: 'all' | 'flagged'): void {
    this.showOnlyFlagged = filterType === 'flagged';
    this.applyFilter();
  }

  updatePipelineData(stats: AlertStatisticsDto): void {
    this.pipelineData = [
      {
        title: 'Total Alerts',
        value: stats.total?.toString() || '0',
        subtitle: 'All alerts in system',
        change: '',
        changeType: 'neutral',
        route: '/alerts'
      },
      {
        title: 'Open Alerts',
        value: stats.byStatus?.['OPEN']?.toString() || '0',
        subtitle: 'Requiring attention',
        change: '',
        changeType: 'negative',
        route: '/alerts',
        queryParams: { status: AlertStatus.OPEN }
      },
      {
        title: 'Critical Alerts',
        value: stats.bySeverity?.['CRITICAL']?.toString() || '0',
        subtitle: 'High priority alerts',
        change: '',
        changeType: 'negative',
        route: '/alerts',
        queryParams: { severity: AlertSeverity.CRITICAL }
      }
    ];
  }

  navigateToPipelineItem(item: any): void {
    if (item.route) {
      this.router.navigate([item.route], { queryParams: item.queryParams || {} });
    }
  }

  getCustomerIcon(country: string): string {
    const countryMap: { [key: string]: string } = {
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪'
    };
    return countryMap[country] || '🌍';
  }

  getCustomerColor(customerId: string): string {
    const colors = ['#9c27b0', '#ff9800', '#4caf50', '#2196f3'];
    const index = customerId.charCodeAt(customerId.length - 1) % colors.length;
    return colors[index];
  }

  navigateToAlertsBySeverity(severity: string): void {
    this.router.navigate(['/alerts'], {
      queryParams: { severity: severity as AlertSeverity }
    });
  }

  navigateToAlertsByStatus(status: string): void {
    this.router.navigate(['/alerts'], {
      queryParams: { status: status as AlertStatus }
    });
  }
}