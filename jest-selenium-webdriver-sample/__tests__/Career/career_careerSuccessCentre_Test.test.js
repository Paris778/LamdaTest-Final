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
* Test the language drop down menu
* Test The scrolling functionality
* Test that links in the tab on the left are working
* Test that documents from tabs download as expected (Cv Templates etc)
*
*
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

    it("navigates to Career/Career Success Centre", async () => {
    
      let button1 = driver.findElement(By.partialLinkText('Career'));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[6]/div/ul/li[1]/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('Career Success Centre | UNIC Portal');
    }, 50000);


    it("presses Contact Us Button", async () => {
    
      let contactUsBtn = await driver.findElement(By.xpath('//*[@id="policiesTabEnglish1Label"]'));
      await contactUsBtn.click();

      let checkAttribute = await contactUsBtn.getAttribute('aria-selected');
      
      await expect(checkAttribute).toBe('true');

    }, 50000);

    
    // OTHER ELEMENTS 
    // let languageDropDownMenu = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/div/button'));

    


      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
