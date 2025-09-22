import { test as base } from '@playwright/test';
import { Logger } from '../../src/common/logger/Logger';
import { Reporter } from '../../src/common/reporter/reporter';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';

export const test = base.extend<
  {
    usersNumber;
    contextsNumber;
    infoTestLog;
    addTestHierarchy;
  },
  {
    logger;
  }
>({
  usersNumber: [1, { option: true }],
  contextsNumber: [1, { option: true }],

  logger: [
    async ({}, use) => {
      const logger = Logger.getInstance(process.env.LOG_LEVEL || 'error');
      await use(logger);
    },
    { scope: 'worker' },
  ],

  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const indexOfTestSubfolderStart = testInfo.file.indexOf('/tests') + 7;
      const fileName = testInfo.file.substring(indexOfTestSubfolderStart);

      logger.info(`Test started: ${fileName}`);
      await use('infoTestLog');
      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],

  addTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const reporter = new Reporter();
      const fileName = testInfo.file;

      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(fileName, logger);

      reporter.linkParentSuite(parentSuite);
      reporter.linkSuite(suite);
      if (subSuite) reporter.linkSubSuite(subSuite);

      await use('addTestHierarchy');
    },
    { scope: 'test', auto: true },
  ],
});
