export interface KPICard {
  label: string;
  value: string;
  sub: string;
  variant: 'default' | 'alert' | 'warning' | 'good';
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  severity: 'critical' | 'warning' | 'info';
  actions: string[];
}

export interface BOMRow {
  category: string;
  material: string;
  rmWeight: string;
  contractCost: string;
  replacementCost: string;
  pricingGap: number;
  requiredHike: string;
}

export interface SupplierGeo {
  country: string;
  percentage: number;
  wageInflation: string;
  fxDelta: string;
  geopolitical: 'Low' | 'Medium' | 'High';
  risk: 'Low' | 'Medium' | 'Critical';
}

export interface Invoice {
  id: string;
  supplier: string;
  poRef: string;
  amount: string;
  dueDate: string;
  status: 'Pending' | 'Overdue' | 'On Hold' | 'Approved' | 'Processing';
  scf: 'Eligible' | 'Active' | 'N/A';
}

export interface SCFRow {
  supplier: string;
  amount: number;
  amountLabel: string;
}

export interface MarginTrend {
  month: string;
  margin: number;
  target: number;
}

export interface PricingGap {
  category: string;
  gap: number;
}

export interface CreditTrend {
  month: string;
  used: number;
  limit: number;
}
