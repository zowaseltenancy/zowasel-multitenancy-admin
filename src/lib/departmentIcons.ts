import {
  Building2,
  Code2,
  Wallet,
  TrendingUp,
  Trees,
  ShieldCheck,
  Briefcase,
  Globe,
  Truck,
  Boxes,
  LucideIcon,
} from 'lucide-react';

/**
 * Returns a specialized Lucide Icon corresponding to the department's operational domain.
 */
export function getDepartmentIcon(name?: string): LucideIcon {
  if (!name) return Building2;
  const n = name.toLowerCase().trim();

  // Field, Agronomy, Agricultural Operations
  if (
    n.includes('field') ||
    n.includes('agronom') ||
    n.includes('farm') ||
    n.includes('crop') ||
    n.includes('agriculture') ||
    n.includes('extension')
  ) {
    return Trees;
  }

  // Technology, Engineering, Software, IT
  if (
    n.includes('tech') ||
    n.includes('software') ||
    n.includes('engineer') ||
    n.includes('developer') ||
    n.includes('devops') ||
    n.includes('system') ||
    n.includes('infrastructure') ||
    n.includes('it')
  ) {
    return Code2;
  }

  // Finance, Accounting, Commerce, Billing, Payments
  if (
    n.includes('finance') ||
    n.includes('account') ||
    n.includes('commerce') ||
    n.includes('billing') ||
    n.includes('wallet') ||
    n.includes('payment') ||
    n.includes('treasury')
  ) {
    return Wallet;
  }

  // Sales, Marketing, Growth, Commercial
  if (
    n.includes('sale') ||
    n.includes('market') ||
    n.includes('growth') ||
    n.includes('commercial') ||
    n.includes('partnership') ||
    n.includes('business development')
  ) {
    return TrendingUp;
  }

  // Compliance, Legal, Audit, Risk
  if (
    n.includes('compliance') ||
    n.includes('legal') ||
    n.includes('audit') ||
    n.includes('risk') ||
    n.includes('regulatory')
  ) {
    return ShieldCheck;
  }

  // Executive, Management, Administration
  if (
    n.includes('executive') ||
    n.includes('leadership') ||
    n.includes('management') ||
    n.includes('director') ||
    n.includes('admin')
  ) {
    return Briefcase;
  }

  // Regional Operations, International, Global
  if (
    n.includes('regional') ||
    n.includes('global') ||
    n.includes('international') ||
    n.includes('territory')
  ) {
    return Globe;
  }

  // Logistics, Supply Chain, Warehousing, Distribution
  if (
    n.includes('logistic') ||
    n.includes('supply') ||
    n.includes('warehouse') ||
    n.includes('haulage') ||
    n.includes('transport') ||
    n.includes('distribution')
  ) {
    return Truck;
  }

  // Programs, Projects, Product Operations
  if (
    n.includes('program') ||
    n.includes('project') ||
    n.includes('operation') ||
    n.includes('product')
  ) {
    return Boxes;
  }

  return Building2;
}
