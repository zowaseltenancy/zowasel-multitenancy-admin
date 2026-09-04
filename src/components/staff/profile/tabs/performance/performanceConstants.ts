import { StaffPerformance } from '@/types/staff';

export const defaultPerformance: StaffPerformance = {
  overallScore: 4.8,
  status: 'Exceeds Expectations',
  goals: [
    {
      id: 'g1',
      title: 'Cluster Farmer Biometric Onboarding (Q3)',
      target: '500 Verified Farmers in Ogun & Oyo State',
      progress: 88,
      status: 'in-progress',
    },
    {
      id: 'g2',
      title: 'CropPilot Data Integrity & Yield Audit',
      target: '100% ground check compliance on 45 grain warehouses',
      progress: 100,
      status: 'achieved',
    },
    {
      id: 'g3',
      title: 'Digital Agronomy Workshop Facilitation',
      target: 'Train 10 Lead Farmers on Weather-Indexed Farming',
      progress: 60,
      status: 'in-progress',
    },
  ],
  kpis: [
    {
      id: 'k1',
      name: 'Farmer Onboarding Accuracy',
      target: '95%',
      current: '98.4%',
      achievementRate: 103,
    },
    {
      id: 'k2',
      name: 'Field Audit Turnaround Time',
      target: '< 48 Hours',
      current: '26 Hours',
      achievementRate: 115,
    },
    {
      id: 'k3',
      name: 'Stakeholder Satisfaction Score',
      target: '4.5 / 5.0',
      current: '4.9 / 5.0',
      achievementRate: 108,
    },
  ],
  reviews: [
    {
      id: 'r1',
      period: 'Q2 2024 Performance Evaluation',
      reviewer: 'Dr. Chuka Eze (VP of Agronomy & Field Operations)',
      date: 'Jun 28, 2024',
      rating: 4.9,
      feedback:
        'John has shown exceptional leadership across the South-West grain corridor. His proactive engagement with cooperative leaders significantly accelerated CropPilot farmer verification while maintaining pristine data accuracy.',
    },
    {
      id: 'r2',
      period: 'Q1 2024 Quarterly Appraisal',
      reviewer: 'Amina Bello (Operations Director)',
      date: 'Mar 30, 2024',
      rating: 4.7,
      feedback:
        'Consistently meets and exceeds field operations benchmarks. Commendable adherence to safety protocols and outstanding reporting quality.',
    },
  ],
};