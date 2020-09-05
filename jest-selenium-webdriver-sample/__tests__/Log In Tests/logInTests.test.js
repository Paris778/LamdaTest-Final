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
* User tries to reset password
* User tries to copy the password or the password field
* User presses the remember me button

*/

//Valid username but invalid password
describe("User", () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .usingServer(
        "https://" + username + ":" + accessKey + "@hub.lambdatest.com/wd/hub"
      )
      .withCapabilities(capabilities)
      .build();
    await driver.getSession().then(function(session) {
      sessionId = session.id_;
    });
    await driver.get("https://portal.unic.ac.cy/signin");
  }, 30000);

  it("enters invalid username", async () => {
    let user = await driver.findElement(By.id("studentId"));
    await user.clear();
    await user.sendKeys("InvalidStudentUsername1234");

    let button = await driver.findElement(By.id("signinBtn"));

    await button.click();

    let alertBox = await driver.findElement(
      By.className(
        "m-alert alert alert-danger alert-dismissible animated fadeIn"
      )
    );
    let alertText = await alertBox.getText();
    console.log("Text:    " + alertText);

    await expect(alertText).toBe(
      "This is not a valid Student ID (e.g. U194N0000)"
    );
  }, 50000);

  it("enters valid username but invalid password", async () => {
    let user = await driver.findElement(By.id("studentId"));
    await user.clear();
    await user.sendKeys(userUsername);

    let pass = await driver.findElement(By.id("password"));
    await pass.clear();
    await pass.sendKeys("invalidPassword");
    let button = await driver.findElement(By.id("signinBtn"));

    await button.click();

    let alertBox = await driver.findElement(
      By.className(
        "m-alert alert alert-danger alert-dismissible animated fadeIn"
      )
    );
    let alertText = await alertBox.getText();
    console.log("Text:    " + alertText);

    await expect(alertText).toBe(
      "Your credentials are invalid, please try again."
    );
  }, 50000);

  //Valid set of credentials

  //
  it("has signed in using a valid set of credentials", async () => {
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

  it("logs out", async () => {

    let profileDownBtn = await driver.findElement(By.className("fas fa-chevron-down"));
     await profileDownBtn.click();

    let logoutBtn = await driver.findElement(By.className("btn m-btn--pill btn-primary m-btn m-btn--custom m-btn--label-brand m-btn--bolder"));
    await logoutBtn.click();

    await expect(await driver.getTitle()).toBe("Sign In | UNIC Portal");
  }, 50000);

  afterAll(async () => {
    await driver.quit();
  }, 40000);
});
