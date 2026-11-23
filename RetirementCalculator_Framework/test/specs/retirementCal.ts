import { expect } from "@wdio/globals";
import allureReporter from "@wdio/allure-reporter";
import LoginPage from "../pageobjects/login.page.js";
import Homepage from "../pageobjects/home.page.js";
import { standardRetirementData } from "../data/retirementData.js";
import { adjustedScenario } from "../data/adjustedScenario.js";
import { fieldValidatonMessages } from "../data/validationMessages.js";

describe("Pre-Retirement calculator:", () => {
  it("Verify user is able to submit the form with only the required fields", async () => {
    allureReporter.addDescription(
      "Fill only the required fields and leave spouse income empty, then click Calculate. The Results section should be displayed.",
      "text",
    );
    
    await LoginPage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.fillPreRetirementCalculatorForm({
      ...standardRetirementData,
      spouseIncome: undefined,
    });
    await Homepage.selectSocialSecurity(standardRetirementData.socialSecurity);
    await Homepage.selectMaritalStatus(standardRetirementData.maritalStatus);
    await Homepage.setSocialSecurityOverride(
      standardRetirementData.socialSecurityOverride,
    );
    await Homepage.calculate();
    await Homepage.resultsTitle.waitForDisplayed();
    expect(await Homepage.resultsTitle.getText()).toBe("Results");
  });

  it("Verify Additional Social Security fields display/hide based on Social Security benefits toggle", async () => {
    allureReporter.addDescription(
      "Select Yes for Social Security benefits and Social Security fields should be displayed. Select No and fields should be hidden",
      "text",
    );
    await LoginPage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.verifySocialSecurityFields(
      standardRetirementData.socialSecurityToggleOptions[0],
    );
    await Homepage.verifySocialSecurityFields(
      standardRetirementData.socialSecurityToggleOptions[1],
    );
  });

  it("Verify user is able to submit the form with all the fields but without default adjustments", async () => {
    allureReporter.addDescription(
      "Fill every field on the form without changing the default values and submit it.",
      "text",
    );
    await LoginPage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.fillPreRetirementCalculatorForm(standardRetirementData);
    await Homepage.selectSocialSecurity(standardRetirementData.socialSecurity);
    await Homepage.selectMaritalStatus(standardRetirementData.maritalStatus);
    await Homepage.setSocialSecurityOverride(
      standardRetirementData.socialSecurityOverride,
    );
    await Homepage.calculate();
    await Homepage.resultsTitle.waitForDisplayed();
    expect(await Homepage.resultsTitle.getText()).toBe("Results");
  });

  it("Verify that Adjusted default values are saved correctly", async () => {
    allureReporter.addDescription(
      "Change the values in the Adjust default values dialog and save. Then, reopen the dialog and it should show the values were saved.",
      "text",
    );
    await LoginPage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.fillPreRetirementCalculatorForm(standardRetirementData);
    await Homepage.selectSocialSecurity(standardRetirementData.socialSecurity);
    await Homepage.selectMaritalStatus(standardRetirementData.maritalStatus);
    await Homepage.setSocialSecurityOverride(
      standardRetirementData.socialSecurityOverride,
    );
    await Homepage.openDefaultValues();
    await Homepage.fillAdjustDefaultValues(adjustedScenario.defaults);
    await Homepage.saveDefaultValues();
    // Reopen the dialog to verify the values were saved.
    await Homepage.openDefaultValues();
    await Homepage.verifyDefaultValues(adjustedScenario.defaults);
    await Homepage.saveDefaultValues();
  });

  it("Verify user is able to fill the form with adjusted default values and submit it successfully", async () => {
    allureReporter.addDescription(
      "Fill the form, save adjusted default values and submit/calculate. The Results section should be displayed.",
      "text",
    );
    await LoginPage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.fillPreRetirementCalculatorForm(standardRetirementData);
    await Homepage.selectSocialSecurity(standardRetirementData.socialSecurity);
    await Homepage.selectMaritalStatus(standardRetirementData.maritalStatus);
    await Homepage.setSocialSecurityOverride(
      standardRetirementData.socialSecurityOverride,
    );
    await Homepage.openDefaultValues();
    await Homepage.fillAdjustDefaultValues(adjustedScenario.defaults);
    await Homepage.saveDefaultValues();
    await Homepage.openDefaultValues();
    await Homepage.verifyDefaultValues(adjustedScenario.defaults);
    await Homepage.saveDefaultValues();
    await Homepage.calculate();
    await Homepage.resultsTitle.waitForDisplayed();
    expect(await Homepage.resultsTitle.getText()).toBe("Results");
  });

  it("Verify required field validations on pre-retirement calculator website and proper error messages are displayed", async () => {
    allureReporter.addDescription(
      "Validations:Click Calculate on an empty form. All 6 required questions should be highlighted in red with an asterisk, alert text should be displayed, and each field should show its error message. Ages above 120 and a planned retirement age that is not greater than the current age should show their own error messages.",
      "text",
    );
    await Homepage.open();
    await Homepage.clickAcceptCookies();
    await Homepage.clearForm();
    await Homepage.calculate();
    await Homepage.verifyRequiredQuestionsHighlighted(6);
    await Homepage.toBeDisplayed(Homepage.requiredFieldsAlertText);
    await Homepage.toHaveText(
      Homepage.requiredFieldsAlertText,
      fieldValidatonMessages.requiredFieldsAlertMessage,
    );
    await Homepage.toBeDisplayed(Homepage.currentAgeError);
    await Homepage.toHaveText(
      Homepage.currentAgeError,
      fieldValidatonMessages.currentAge,
    );
    await Homepage.toBeDisplayed(Homepage.retirementAgeError);
    await Homepage.toHaveText(
      Homepage.retirementAgeError,
      fieldValidatonMessages.retirementAge,
    );
    await Homepage.toBeDisplayed(Homepage.currentIncomeError);
    await Homepage.toHaveText(
      Homepage.currentIncomeError,
      fieldValidatonMessages.currentIncome,
    );
    await Homepage.toBeDisplayed(Homepage.currentSavingsError);
    await Homepage.toHaveText(
      Homepage.currentSavingsError,
      fieldValidatonMessages.currentSavings,
    );
    await Homepage.toBeDisplayed(Homepage.annualContributionError);
    await Homepage.toHaveText(
      Homepage.annualContributionError,
      fieldValidatonMessages.annualContribution,
    );
    await Homepage.toBeDisplayed(Homepage.contributionIncreaseError);
    await Homepage.toHaveText(
      Homepage.contributionIncreaseError,
      fieldValidatonMessages.contributionIncrease,
    );
    await Homepage.clearForm();
    await allureReporter.step(
      "Validate Current and Retirement Age cannot be greater than 120",
      async () => {
        await Homepage.fillPreRetirementCalculatorForm({
          ...standardRetirementData,
          currentAge: 130,
          retirementAge: 130,
        });
        await Homepage.calculate();
        await expect(Homepage.retirementAgeError).toBeDisplayed();
        await expect(Homepage.retirementAgeError).toHaveText(
          fieldValidatonMessages.retirementAgeNotGreater,
        );
        await expect(Homepage.currentAgeError).toBeDisplayed();
        await expect(Homepage.currentAgeError).toHaveText(
          fieldValidatonMessages.retirementAgeNotGreater,
        );
        await Homepage.clearForm();
      },
    );

    await allureReporter.step(
      "Validate Planned Retirement Age must be greater than Current Age",
      async () => {
        await Homepage.fillPreRetirementCalculatorForm({
          ...standardRetirementData,
          currentAge: 120,
          retirementAge: 120,
        });
        await Homepage.calculate();
        await expect(Homepage.retirementAgeError).toBeDisplayed();
        await expect(Homepage.retirementAgeError).toHaveText(
          fieldValidatonMessages.plannedRetirementAgeMustBeGreaterThanCurrentAge,
        );
      },
    );
    await Homepage.clearForm();
  });
});
