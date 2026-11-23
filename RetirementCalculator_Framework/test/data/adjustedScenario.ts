import type { DefaultValues } from '../type/defaultValues.ts';

export const adjustedScenario = {
  socialSecurity: 'Yes',
  maritalStatus: 'Married',
  socialSecurityOverride: 4000,

  defaults: {
    additionalIncome: 500,
    retirementYears: 20,
    increaseWithInflation: 'Yes',
    expectedInflationPercent: 3,
    desiredIncomePercent: 75,
    preRetirementReturnPercent: 8,
    postRetirementReturnPercent: 5,
  } satisfies DefaultValues,
} as const;