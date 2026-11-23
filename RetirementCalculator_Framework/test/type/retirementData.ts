export interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  spouseIncome?: number;
  currentSavings: number;
  annualContributionPercent: number;
  contributionIncreasePercent: number;
  socialSecurity: 'Yes' | 'No';
  socialSecurityToggleOptions: Array<'Yes' | 'No'>;
  maritalStatus: 'Single' | 'Married';
  socialSecurityOverride: number;
}

//The interface describes the shape of the data. It doesn’t contain the actual values.