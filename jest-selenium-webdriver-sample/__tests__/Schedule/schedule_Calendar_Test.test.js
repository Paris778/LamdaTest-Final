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
* Test that the Classes, Exams, Event, Holidays buttons work as expected
* Test that the month,week,day,list buttons work as expected
* Test the the arrow work for all four categories (month,week,day,list)
* Test that the 'today' button works
* Test that if you click on a date while in List-view , the same date opens in day-view
* Test that the hover pop-ups work for events in Month-view
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

    //Calendar
    it("navigates to Schedule/Calendar", async () => {
      
      let button1 = driver.findElement(By.partialLinkText('Schedule'));
      //await driver.findElement(By.className("ml-3 m-lg-0"));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[2]/div/ul/li[4]/a/span"));
      await button2.click();

      await expect(await driver.getTitle()).toBe('Calendar | UNIC Portal');
    }, 50000);

  
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
