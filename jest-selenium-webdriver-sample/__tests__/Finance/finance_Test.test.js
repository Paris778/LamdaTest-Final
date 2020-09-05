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
* Test period drop down menu
* Test 'Pay with JCC' button
* Test Statement of Account Drop down entries menu
* Test Statement of Account search bar
* Test Statement of Account navigation (page number, left/right arrows)
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

    it("navigates to Finance", async () => {
    
      let button1 = driver.findElement(By.partialLinkText('Finance'));
      await button1.click();
  
      await expect(await driver.getTitle()).toBe('Finance | UNIC Portal');
    }, 50000);


    it("presses on Other Payment Options", async () => {
    
      let dropDownBtn = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/div/button[2]'));
      await dropDownBtn.click();

      let payOptionsBtn = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/div/div/a'));
      await payOptionsBtn.click();

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      await driver.switchTo().window(windows[1]);
      
      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/admission-requirements/financial-information/methods-of-payment/');

      //Go back
      await driver.switchTo().window(parent);
    }, 50000);

    /* *************************
    OTHER ELEMENTS (for Finance  page)

    //*[@id="jccPayBtn"]
    let payWithJCCbtn = await driver.findElement(By.xpath('//*[@id="jccPayBtn"]')); 
    //
    let dropDownMenuStatementOfAccountBtn = await driver.findElement(By.xpath('//*[@id="statementsDT_length"]/label/select')); 
    let searchBarStatementofAccount = await driver.findElement(By.xpath('//*[@id="statementsDT_filter"]/label/input')); 
    //
    let secondPageBtn = await driver.findElement(By.xpath('//*[@id="statementsDT_paginate"]/ul/li[3]/a')); 
    let arrowBtnRight = await driver.findElement(By.xpath('//*[@id="statementsDT_next"]/a')); 
    let arrowBtnLeft = await driver.findElement(By.xpath('//*[@id="statementsDT_previous"]/a')); 
    //


    */

      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
