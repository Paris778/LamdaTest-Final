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
* Test the form (buttons , menus , etc)
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

    //Career/Job Openings
    it("navigates to Career/Job Openings", async () => {

      let button1 = driver.findElement(By.partialLinkText('Career'));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[6]/div/ul/li[2]/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('Job Openings | UNIC Portal');
    }, 50000);


    it("presses Contact Us Button", async () => {
    
      let contactUsBtn = await driver.findElement(By.xpath('//*[@id="policiesTabEnglish1Label"]'));
      await contactUsBtn.click();

      let checkAttribute = await contactUsBtn.getAttribute('aria-selected');
      
      await expect(checkAttribute).toBe('true');

    }, 50000);

    
    /* OTHER ELEMENTS 
    let submitButton = await driver.findElement(By.xpath('//*[@id="vacancyFilterForm"]/div/div[8]/button'));
    
    let classificagtionFilterForm = await driver.findElement(By.xpath('//*[@id="vacancyFilterForm"]/div/div[1]/div/button'));
    let companiesFilterForm = await driver.findElement(By.xpath('//*[@id="vacancyFilterForm"]/div/div[2]/div/button'));
    let currencyFilterForm = await driver.findElement(By.xpath('//*[@id="vacancyFilterForm"]/div/div[5]/div/button'));
    //
    let jobTitleTextArea = await driver.findElement(By.xpath('//*[@id="vacancyFilterJobTitle"]'));
    //
    let navigationArrowLeft = await driver.findElement(By.xpath('//*[@id="pageBtns"]/li[1]/a'));
    let navigationArrowRight = await driver.findElement(By.xpath('//*[@id="pageBtns"]/li[7]/a'));
   

    */
      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
