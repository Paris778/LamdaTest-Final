const webdriver = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const LambdaTestRestClient = require("@lambdatest/node-rest-client");
require("dotenv").config();
const tools = require("../../main.js");
const capabilities = tools.capabilities;
const key = require("selenium-webdriver").Key;

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
* Test that the search form works as expected
* Course Hyperlinks work
* Professor Hyperlinks work
* Changing pages on list work (using number)
* Changing pages on list work (using arrows)
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

    //All courses
    it("navigates to Schedule/All Courses", async () => {
      
      let button1 = driver.findElement(By.partialLinkText('Schedule'));
      //await driver.findElement(By.className("ml-3 m-lg-0"));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[2]/div/ul/li[3]/a"));
      await button2.click();

      await expect(await driver.getTitle()).toBe('All Courses | UNIC Portal');
    }, 50000);

  
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
