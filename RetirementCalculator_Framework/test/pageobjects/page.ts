import { browser, expect } from '@wdio/globals'
import allureReporter from '@wdio/allure-reporter'
import type { ChainablePromiseElement } from 'webdriverio'
import { env } from '../config/environments.js'


export default class Page {
    
    public open () {
        return browser.url(env.baseUrl)
    }

    public async toBeDisplayed(element: ChainablePromiseElement | WebdriverIO.Element, name?: string): Promise<void> {
        await this.step(`Verify ${name ?? (await element).selector} is displayed`, async () => {
            await expect(element).toBeDisplayed()
        })
    }

    public async toHaveText(element: ChainablePromiseElement | WebdriverIO.Element, text: string, name?: string): Promise<void> {
        await this.step(`Verify ${name ?? (await element).selector} has text '${text}'`, async () => {
            await expect(element).toHaveText(text)
        })
    }

    public async waitForColor(element: ChainablePromiseElement | WebdriverIO.Element, hex: string, message: string): Promise<void> {
        const el = await element
        await browser.waitUntil(
            async () => (await el.getCSSProperty('color')).parsed.hex === hex,
            { timeoutMsg: message }
        )
    }

    protected step<T>(name: string, body: () => Promise<T>): Promise<T> {
        return allureReporter.step(name, body)
    }
}
