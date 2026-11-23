import type { RetirementData } from '../type/retirementData.js';

export const standardRetirementData = {
  currentAge: 40,
  retirementAge: 68,
  currentIncome: 100000,
  spouseIncome: 75000,
  currentSavings: 500000,
  annualContributionPercent: 10,
  contributionIncreasePercent: 0.25,
  socialSecurity: 'Yes',
  socialSecurityToggleOptions: ['Yes','No'],
  maritalStatus: 'Single',
  socialSecurityOverride: 0
} satisfies RetirementData;

//satisfies RetirementData tells TypeScript to check that the object has the expected fields and types.