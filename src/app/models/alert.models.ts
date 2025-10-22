export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

export enum DecisionAction {
  ALLOW = 'ALLOW',
  BLOCK = 'BLOCK',
  MONITOR = 'MONITOR',
  INVESTIGATE = 'INVESTIGATE'
}

export interface CustomerDto {
  customerId: string;
  name: string;
  country: string;
  deviceTrustScore?: number;
  hasFraudHistory?: boolean;
}

export interface CustomerSummaryDto {
  customerId: string;
  name: string;
  country: string;
}

export interface TransactionDto {
  transactionId: string;
  amount: number;
  currency: string;
  destinationCountry: string;
  timestamp: string;
}

export interface TransactionSummaryDto {
  transactionId: string;
  amount: number;
  currency: string;
}

export interface DecisionDto {
  action: DecisionAction;
  reasoning: string;
}

export interface AlertDto {
  alertId?: string;
  severity: AlertSeverity;
  status?: AlertStatus;
  riskScore: number;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string;
  customer: CustomerDto;
  transaction: TransactionDto;
  riskFactors?: string[];
  decision: DecisionDto;
  notes?: string[];
}

export interface AlertSummaryDto {
  alertId?: string;
  severity?: AlertSeverity;
  status?: AlertStatus;
  riskScore?: number;
  createdAt?: string;
  updatedAt?: string;
  customer?: CustomerSummaryDto;
  transaction?: TransactionSummaryDto;
}

export interface PagedResponseAlertSummaryDto {
  alerts?: AlertSummaryDto[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface AlertUpdateRequest {
  status: AlertStatus;
  assignedTo?: string;
  notes?: string;
}

export interface BulkUpdateRequest {
  alertIds: string[];
  status: AlertStatus;
  assignedTo?: string;
}

export interface NoteRequest {
  note: string;
}

export interface NoteResponse {
  notes?: string[];
}

export interface RiskProfileDto {
  currentRiskLevel?: string;
  hasFraudHistory?: boolean;
  deviceTrustScore?: number;
}

export interface CustomerAlertHistoryDto {
  customerId?: string;
  customerName?: string;
  alerts?: AlertSummaryDto[];
  totalAlerts?: number;
  riskProfile?: RiskProfileDto;
}

export interface RiskFactorCountDto {
  factor?: string;
  count?: number;
}

export interface AlertStatisticsDto {
  total?: number;
  bySeverity?: { [key: string]: number };
  byStatus?: { [key: string]: number };
  averageRiskScore?: number;
  topRiskFactors?: RiskFactorCountDto[];
}