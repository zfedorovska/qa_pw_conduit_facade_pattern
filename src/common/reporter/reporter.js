import * as allure from 'allure-js-commons';

export class Reporter {
  constructor(allureApi = allure) {
    this._allure = allureApi;
  }

  linkParentSuite(name) {
    this._allure.parentSuite(name);
  }

  linkSuite(name) {
    this._allure.suite(name);
  }

  linkSubSuite(name) {
    this._allure.subSuite(name);
  }
}
