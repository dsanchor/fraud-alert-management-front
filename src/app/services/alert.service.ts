import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AlertDto,
  AlertSummaryDto,
  PagedResponseAlertSummaryDto,
  AlertUpdateRequest,
  BulkUpdateRequest,
  NoteRequest,
  NoteResponse,
  CustomerAlertHistoryDto,
  AlertStatisticsDto,
  AlertSeverity,
  AlertStatus
} from '../models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  getAllAlerts(
    status?: AlertStatus,
    severity?: AlertSeverity,
    customerId?: string,
    assignedTo?: string,
    page: number = 1,
    limit: number = 20
  ): Observable<PagedResponseAlertSummaryDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('subscription-key', this.apiKey);

    if (status) params = params.set('status', status);
    if (severity) params = params.set('severity', severity);
    if (customerId) params = params.set('customerId', customerId);
    if (assignedTo) params = params.set('assignedTo', assignedTo);

    return this.http.get<PagedResponseAlertSummaryDto>(`${this.apiUrl}/alerts`, { params });
  }

  getAlertById(alertId: string): Observable<AlertDto> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.get<AlertDto>(`${this.apiUrl}/alerts/${alertId}`, { params });
  }

  createAlert(alert: AlertDto): Observable<AlertDto> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.post<AlertDto>(`${this.apiUrl}/alerts`, alert, { params });
  }

  updateAlert(alertId: string, updateRequest: AlertUpdateRequest): Observable<AlertDto> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.patch<AlertDto>(`${this.apiUrl}/alerts/${alertId}`, updateRequest, { params });
  }

  bulkUpdateAlerts(bulkUpdate: BulkUpdateRequest): Observable<void> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.patch<void>(`${this.apiUrl}/alerts/bulk`, bulkUpdate, { params });
  }

  getNotes(alertId: string): Observable<NoteResponse> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.get<NoteResponse>(`${this.apiUrl}/alerts/${alertId}/notes`, { params });
  }

  addNote(alertId: string, noteRequest: NoteRequest): Observable<void> {
    const params = new HttpParams().set('subscription-key', this.apiKey);
    return this.http.post<void>(`${this.apiUrl}/alerts/${alertId}/notes`, noteRequest, { params });
  }

  getCustomerAlertHistory(customerId: string, limit: number = 10): Observable<CustomerAlertHistoryDto> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('subscription-key', this.apiKey);
    return this.http.get<CustomerAlertHistoryDto>(`${this.apiUrl}/customers/${customerId}/alerts`, { params });
  }

  getStatistics(startDate?: string, endDate?: string): Observable<AlertStatisticsDto> {
    let params = new HttpParams().set('subscription-key', this.apiKey);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AlertStatisticsDto>(`${this.apiUrl}/alerts/stats`, { params });
  }

  exportAlerts(
    format: string,
    status?: AlertStatus,
    severity?: AlertSeverity,
    startDate?: string,
    endDate?: string
  ): Observable<string> {
    let params = new HttpParams()
      .set('format', format)
      .set('subscription-key', this.apiKey);
    if (status) params = params.set('status', status);
    if (severity) params = params.set('severity', severity);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/alerts/export`, {
      params,
      responseType: 'text'
    });
  }
}