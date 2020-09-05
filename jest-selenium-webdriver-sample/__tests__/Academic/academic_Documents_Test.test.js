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
* Test that the document actually loads on the pdf plug-in window
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

    it("navigates to Academic/Documents", async () => {
    
      let button1 = driver.findElement(By.partialLinkText('Academic'));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[3]/div/ul/li[3]/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('Documents | UNIC Portal');
    }, 50000);

    it("clicks on Bachelor's Degree document", async () => {

      let documentBtn = await driver.findElement(By.xpath('//*[@id="documentsList"]/div[1]'));
      await documentBtn.click();

      let checkClass = await documentBtn.getAttribute('class');
      
      await expect(checkClass).toBe('m-widget4__item active');      
      
    }, 50000);

    it("clicks on Bachelor's Diploma Supplement document", async () => {

      let documentBtn = await driver.findElement(By.xpath('//*[@id="documentsList"]/div[2]'));
      await documentBtn.click();

      let checkClass = await documentBtn.getAttribute('class');
      
      await expect(checkClass).toBe('m-widget4__item active');      
      
    }, 50000);

    it("clicks on Bachelor's Transcript document", async () => {

      let documentBtn = await driver.findElement(By.xpath('//*[@id="documentsList"]/div[3]'));
      await documentBtn.click();

      let checkClass = await documentBtn.getAttribute('class');
      
      await expect(checkClass).toBe('m-widget4__item active');      
      
    }, 50000);


    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
