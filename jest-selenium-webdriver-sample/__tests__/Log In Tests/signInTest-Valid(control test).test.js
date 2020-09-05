const webdriver = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const LambdaTestRestClient = require("@lambdatest/node-rest-client");
require("dotenv").config();
const tools = require("../../main.js");
const capabilities = tools.capabilities;

//console.log(capabilities);

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

/* const capabilities = {
  build: 'jest-LambdaTest-Single',
  browserName: 'chrome',
  version: '72.0',
  platform: 'WIN10',
  video: true,
  network: true,
  console: true,
  visual: true
};  */

//console.log(capabilities);


//Overwrite Capabilities
//capabilities.browserName = "firefox";


//ACTUAL TEST
//Description:  User logs in using a set of valid credentials

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

 /*    //Log in
    let user = await driver.findElement(By.id("studentId"));
    await user.clear();
    await user.sendKeys(userUsername);

    let pass = await driver.findElement(By.id("password"));
    await pass.clear();
    await pass.sendKeys(userPassword);
    let button = await driver.findElement(By.id("signinBtn"));

    await button.click();
    await expect(await driver.getTitle()).toBe("Dashboard | UNIC Portal"); */

  }, 30000);

  it("logs in successfully", async () => {

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

  }, 50000); 



  afterAll(async () => {
    await driver.quit();
  }, 40000);
});
