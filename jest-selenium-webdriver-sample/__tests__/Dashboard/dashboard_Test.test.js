const webdriver = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const LambdaTestRestClient = require("@lambdatest/node-rest-client");
require("dotenv").config();
const tools = require("../../main.js");
const capabilities = tools.capabilities;

console.log(capabilities);

//Overwrite Capabilities
//capabilities.browserName = "firefox";

//Lamda Credentials
const username = process.env.LT_USERNAME;
const accessKey = process.env.LT_ACCESS_KEY;

//User credentials
const userUsername = process.env.UNIC_USERNAME;
const userPassword = process.env.UNIC_PASSWORD;

const AutomationClient = LambdaTestRestClient.AutomationClient({
  username,
  accessKey,
});

let sessionId = null;

//ACTUAL TESTS

//////////////////////////////////////////////////////
//TO:DO
/*
* Some sort of test for the available jobs. 
* Didn't write one for that because I assumed that the list is dynamic and jobs can get removes/added.
*/

describe("User", () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .usingServer(
        "https://" + username + ":" + accessKey + "@hub.lambdatest.com/wd/hub"
      )
      .withCapabilities(capabilities)
      .build();
    await driver.getSession().then(function (session) {
      sessionId = session.id_;
    });
    await driver.get("https://portal.unic.ac.cy/signin");

    //Log in
    let user = await driver.findElement(By.id("studentId"));
    await user.clear();
    await user.sendKeys(userUsername);

    let pass = await driver.findElement(By.id("password"));
    await pass.clear();
    await pass.sendKeys(userPassword);
    let button = await driver.findElement(By.id("signinBtn"));

    await button.click();
    await expect(await driver.getTitle()).toBe("Dashboard | UNIC Portal");

  }, 30000);

  /////////////////////////////////////////////////////////////////////////
  //Naviagtes to Calendar 
  it("navigates to Calendar", async () => {

    let calendarBtn = driver.findElement(By.xpath('//*[@id="dashboardCalendar"]/a'));
    await calendarBtn.click();

    await expect(await driver.getTitle()).toBe('Calendar | UNIC Portal');

    let back = driver.findElement(By.partialLinkText('Dashboard'));
    await back.click();

  }, 50000);

  //My exams
  it("navigates to All Job Openings", async () => {

    let allJobsBtm = await driver.findElement(By.xpath('//*[@id="dashboardAllVacancies"]/a'));
    await allJobsBtm.click();

    await expect(await driver.getTitle()).toBe('Job Openings | UNIC Portal');

    let back = driver.findElement(By.partialLinkText('Dashboard'));
    await back.click();
  }, 50000);

  /////////////////////////////////////////////////////////////////////////
  //Messages (both don't work)
  it("presses messages/notices", async () => {

    //let noticesBtn = driver.findElement(By.xpath('//*[@id="dashboardMessages"]/div[1]/div[2]/ul/li[2]/a'));
    let noticesBtn = driver.findElement(By.className('nav-link m-tabs__link'));
    await noticesBtn.click();
    //let m =  noticesBtn.getAttribute("aria-selected");
    //let x = noticesBtn.getAttribute();

    let checkAttribute = await noticesBtn.getAttribute("aria-selected");

    await expect(checkAttribute).toBe('true');
  }, 50000);

  it("presses messages/inbox", async () => {

    let inboxBtn = driver.findElement(By.xpath('//*[@id="dashboardInbox"]'));
    await inboxBtn.click();
    //let m =  inboxBtn.getAttribute("aria-selected");
    //let x = inboxBtn.getAttribute();
    
    await expect(await inboxBtn.getAttribute("aria-selected")).toBe('true');
  }, 50000);

  afterAll(async () => {
    await driver.quit();
  }, 40000);
});
