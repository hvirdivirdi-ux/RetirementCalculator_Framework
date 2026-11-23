import { $, expect } from "@wdio/globals";
import Page from "./page.js";
import type { RetirementData } from "../type/retirementData.ts";
import type { DefaultValues } from "../type/defaultValues.ts";

const ERROR_RED = "#cc0000";

class Homepage extends Page {
  // define selectors using getter methods

  get btnAcceptCookies() {
    return $('button[id="onetrust-accept-btn-handler"]');
  }

  get currentAgeInput() {
    return $("#current-age");
  }

  get retirementAgeInput() {
    return $("#retirement-age");
  }

  get currentIncomeInput() {
    return $("#current-income");
  }

  get spouseIncomeInput() {
    return $("#spouse-income");
  }

  get currentSavingsInput() {
    return $("#current-total-savings");
  }

  get annualContributionInput() {
    return $("#current-annual-savings");
  }

  get contributionIncreaseInput() {
    return $("#savings-increase-rate");
  }

  get socialSecurityYesRadio() {
    return $('label[for="yes-social-benefits"]');
  }

  get socialSecurityNoRadio() {
    return $('label[for="no-social-benefits"]');
  }

  get singleRadio() {
    return $('label[for="single"]');
  }

  get marriedRadio() {
    return $('label[for="married"]');
  }
  get singleLabel() {
    return $('label[for="single"]');
  }

  get marriedLabel() {
    return $('label[for="married"]');
  }

  get socialSecurityOverrideInput() {
    return $("#social-security-override");
  }

  get calculateButton() {
    return $("button=Calculate");
  }

  get resultsTitle() {
    return $('//h3[normalize-space(.)="Results"]');
  }

  get requiredFieldsAlertText() {
    return $("#calculator-input-alert-desc");
  }

  get requiredQuestionLabels() {
    return $$(
      [
        'label[for="current-age"]',
        'label[for="retirement-age"]',
        'label[for="current-income"]',
        'label[for="current-total-savings"]',
        'label[for="current-annual-savings"]',
        'label[for="savings-increase-rate"]',
      ].join(", "),
    );
  }
  get currentAgeError() {
    return $("#invalid-current-age-error");
  }

  get retirementAgeError() {
    return $("#invalid-retirement-age-error");
  }

  get currentIncomeError() {
    return $("#invalid-current-income-error");
  }

  get currentSavingsError() {
    return $("#invalid-current-total-savings-error");
  }

  get annualContributionError() {
    return $("#invalid-current-annual-savings-error");
  }

  get contributionIncreaseError() {
    return $("#invalid-savings-increase-rate-error");
  }

  get clearFormButton() {
    return $("button=Clear form");
  }

  get adjustDefaultsButton() {
    return $('a[data-bs-target="#default-values-modal"]');
  }

  get defaultsDialog() {
    return $("#default-values-modal");
  }

  get additionalIncomeInput() {
    return $("#additional-income");
  }

  get retirementYearsInput() {
    return $("#retirement-duration");
  }

  get inflationYesLabel() {
    return $('label[for="include-inflation"]');
  }

  get inflationNoLabel() {
    return $('label[for="exclude-inflation"]');
  }

  get inflationYesRadio() {
    return $("#include-inflation");
  }

  get expectedInflationInput() {
    return $("#expected-inflation-rate");
  }

  get desiredIncomeInput() {
    return $("#retirement-annual-income");
  }

  get preRetirementReturnInput() {
    return $("#pre-retirement-roi");
  }

  get postRetirementReturnInput() {
    return $("#post-retirement-roi");
  }

  get saveDefaultsButton() {
    return $("button=Save changes");
  }

  //functions

  async clearForm(): Promise<void> {
    await this.step("Clear the calculator form", async () => {
      await this.clearFormButton.click();
    });
  }

  async verifyRequiredQuestionsHighlighted(
    expectedCount: number,
  ): Promise<void> {
    await this.step(
      `Verify ${expectedCount} required questions are highlighted in red`,
      async () => {
        const labels = await this.requiredQuestionLabels;
        expect(labels.length).toBe(expectedCount);

        for (const label of labels) {
          await this.toBeDisplayed(label);
          await this.waitForColor(
            label,
            ERROR_RED,
            "Required question label did not become red",
          );

          const asterisk = await label.$(".dsg-required");
          await this.toBeDisplayed(asterisk);
          await this.toHaveText(asterisk, "*");
          await this.waitForColor(
            asterisk,
            ERROR_RED,
            "Required-field asterisk did not become red",
          );
        }
      },
    );
  }

  public open() {
    return this.step("Open the retirement calculator page", () =>
      super.open(),
    );
  }

  public async clickAcceptCookies() {
    await this.step("Accept cookies if the banner is displayed", async () => {
      if (await this.btnAcceptCookies.isDisplayed()) {
        await this.btnAcceptCookies.click();
      }
    });
  }

  async fillPreRetirementCalculatorForm(data: RetirementData): Promise<void> {
    await this.step("Fill the pre-retirement calculator form", async () => {
      await this.currentAgeInput.setValue(data.currentAge.toString());
      await this.retirementAgeInput.setValue(data.retirementAge.toString());
      await this.currentIncomeInput.click();
      await this.currentIncomeInput.setValue(data.currentIncome.toString());
      if (data.spouseIncome !== undefined) {
        await this.spouseIncomeInput.click();
        await this.spouseIncomeInput.setValue(data.spouseIncome.toString());
      }
      await this.currentSavingsInput.click();
      await this.currentSavingsInput.setValue(data.currentSavings.toString());

      await this.annualContributionInput.setValue(
        data.annualContributionPercent.toString(),
      );
      await this.contributionIncreaseInput.setValue(
        data.contributionIncreasePercent.toString(),
      );
    });
  }

  async selectSocialSecurity(choice: "Yes" | "No"): Promise<void> {
    await this.step(`Select Social Security '${choice}'`, async () => {
      if (choice === "Yes") {
        await this.socialSecurityYesRadio.click();
      } else if (choice === "No") {
        await this.socialSecurityNoRadio.click();
      } else {
        throw new Error(`Invalid Social Security choice: ${choice}`);
      }
    });
  }

  async verifySocialSecurityFields(choice: "Yes" | "No"): Promise<void> {
    await this.step(
      `Verify Social Security fields for choice '${choice}'`,
      async () => {
        await this.selectSocialSecurity(choice);

        const shouldBeHidden = choice === "No";

        await this.singleLabel.waitForDisplayed({ reverse: shouldBeHidden });
        await this.marriedLabel.waitForDisplayed({ reverse: shouldBeHidden });
        await this.socialSecurityOverrideInput.waitForDisplayed({ reverse: shouldBeHidden});
      },
    );
  }

  async selectMaritalStatus(status: "Single" | "Married"): Promise<void> {
    await this.step(`Select marital status '${status}'`, async () => {
      if (status === "Single") {
        await this.singleRadio.click();
      } else if (status === "Married") {
        await this.marriedRadio.click();
      } else {
        throw new Error(`Invalid marital status: ${status}`);
      }
    });
  }

  async setSocialSecurityOverride(amount: number): Promise<void> {
    await this.step(`Set Social Security override to ${amount}`, async () => {
      await this.socialSecurityOverrideInput.click();
      await this.socialSecurityOverrideInput.setValue(amount.toString());
    });
  }

  async calculate(): Promise<void> {
    await this.step("Click Calculate", async () => {
      await this.calculateButton.click();
    });
  }

  async openDefaultValues(): Promise<void> {
    await this.step("Open the default values dialog", async () => {
      await this.adjustDefaultsButton.click();
      await this.defaultsDialog.waitForDisplayed();
    });
  }

  async fillAdjustDefaultValues(data: DefaultValues): Promise<void> {
    await this.step("Adjust the default values", async () => {
      await this.additionalIncomeInput.click();
      await this.additionalIncomeInput.setValue(
        data.additionalIncome.toString(),
      );
      await this.retirementYearsInput.setValue(data.retirementYears.toString());

      if (data.increaseWithInflation === "Yes") {
        await this.inflationYesLabel.click();

        if (data.expectedInflationPercent !== undefined) {
          await this.expectedInflationInput.click();
          await this.expectedInflationInput.setValue(
            data.expectedInflationPercent.toString(),
          );
        }
      } else if (data.increaseWithInflation === "No") {
        await this.inflationNoLabel.click();
      } else {
        throw new Error(
          `Invalid inflation choice: ${data.increaseWithInflation}`,
        );
      }

      await this.desiredIncomeInput.setValue(
        data.desiredIncomePercent.toString(),
      );
      await this.preRetirementReturnInput.setValue(
        data.preRetirementReturnPercent.toString(),
      );
      await this.postRetirementReturnInput.setValue(
        data.postRetirementReturnPercent.toString(),
      );
    });
  }

  async saveDefaultValues(): Promise<void> {
    await this.step("Save the default values", async () => {
      await this.saveDefaultsButton.click();
      await this.defaultsDialog.waitForDisplayed({ reverse: true });
    });
  }

  async verifyDefaultValues(data: DefaultValues): Promise<void> {
    await this.step("Verify the saved default values", async () => {
      await expect(this.additionalIncomeInput).toHaveValue(
        `$${data.additionalIncome}`,
      );
      await expect(this.retirementYearsInput).toHaveValue(
        data.retirementYears.toString(),
      );

      if (data.increaseWithInflation === "Yes") {
        await expect(this.inflationYesRadio).toBeSelected();
        if (data.expectedInflationPercent !== undefined) {
          await expect(this.expectedInflationInput).toHaveValue(
            `${data.expectedInflationPercent}%`,
          );
        }
      } else {
        await expect(this.inflationYesRadio).not.toBeSelected();
      }

      await expect(this.desiredIncomeInput).toHaveValue(
        `${data.desiredIncomePercent}%`,
      );
      await expect(this.preRetirementReturnInput).toHaveValue(
        `${data.preRetirementReturnPercent}%`,
      );
      await expect(this.postRetirementReturnInput).toHaveValue(
        `${data.postRetirementReturnPercent}%`,
      );
    });
  }
}

export default new Homepage();
