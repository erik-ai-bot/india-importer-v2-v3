export interface SourcingKPI {
  label: string;
  current: number;
  target: number;
  unit: string;
  lowerIsBetter?: boolean;
}

export interface OTDTrend {
  month: string;
  otd: number;
}

export interface RegionalHub {
  region: string;
  hub: string;
  otd: number;
  quality: number;
  leadTime: number;
  spendPct: number;
}

export interface VendorRadar {
  quality: number;
  leadTime: number;
  otd: number;
  taScore: number;
  lfScore: number;
  complianceRating: number;
  claimRatio: number;
}

export interface Vendor {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  annualVolumeEur: number;
  spendPct: number;
  categories: string[];
  radar: VendorRadar;
}

export interface AlternativeSupplier {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  matchScore: number;
  spareCap: number;
  otd: number;
  qualityScore: number;
  productDNA: string[];
  yearsExp: number;
  status: 'Shortlisted' | 'Available' | 'Under Review';
  certifications: string[];
}

export interface LeadTimeRow {
  category: string;
  days: number;
  target: number;
  bottleneck: string | null;
}

export interface ValueDistRow {
  category: string;
  valueEur: number;
  pct: number;
}

export interface ProcessMap {
  category: string;
  steps: string[];
  bottleneck: string;
}

export interface POWip {
  id: string;
  supplier: string;
  product: string;
  valueEur: number;
  dueDate: string;
  status: 'On Track' | 'At Risk' | 'Overdue';
  daysOverdue: number;
}

export interface LogisticsMode {
  costPerTeu: number;
  transitDays: number;
  delayImpact: string;
  status: 'Normal' | 'Disrupted';
}

export interface MacroAlert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  region: string;
  title: string;
  description: string;
  action: string;
}
