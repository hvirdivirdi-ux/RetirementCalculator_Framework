export interface DefaultValues {
  additionalIncome: number;
  retirementYears: number;
  increaseWithInflation: 'Yes' | 'No';
  expectedInflationPercent?: number;
  desiredIncomePercent: number;
  preRetirementReturnPercent: number;
  postRetirementReturnPercent: number;
}