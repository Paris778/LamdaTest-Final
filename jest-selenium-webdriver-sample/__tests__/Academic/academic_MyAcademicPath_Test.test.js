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
* Check clicking on period of expanded accordion menu
* Hover pop up behaviour
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

    it("navigates to Academic/My Academic Path", async () => {
    
      let button1 = await driver.findElement(By.partialLinkText('Academic'));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[3]/div/ul/li[2]/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('My Academic Path | UNIC Portal');
    }, 50000);

    //Clicks on a course
    it("clicks on a course", async () => {

      let courseButton = await driver.findElement(By.xpath('//*[@id="DataTables_Table_0"]/tbody/tr[17]/td[1]/a'));
      await courseButton.click();

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      await driver.switchTo().window(windows[1]);

      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/ECTS_Syllabi/COMP-431.pdf');

      //Go back
      await driver.switchTo().window(parent);
      
    }, 50000);

    it("clicks on a period", async () => {

      let periodBtn = await driver.findElement(By.partialLinkText('Fall 2016'));
      await periodBtn.click();

      let checkText = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/div/button/div/div/div')).getText();

      await expect(checkText).toBe(' Fall 2016');

      //Go back
      await driver.get('https://portal.unic.ac.cy/academic/path');
      
      
    }, 50000);

    it("clicks on an accordion element Section B", async () => {

      let plusBtn = await driver.findElement(By.xpath('//*[@id="m_accordion_1_item_1_head"]'));
      await plusBtn.click();

      let checkClass = await driver.findElement(By.id('m_accordion_1_item_1_body')).getAttribute('class');
      
      await expect(checkClass).toBe('m-accordion__item-body not-default-body collapse show');      
      
    }, 50000);

    it("clicks on a course from expanded menu", async () => {

      let courseButton = await driver.findElement(By.xpath('//*[@id="DataTables_Table_1"]/tbody/tr[1]/td[1]/a'));
      
      await courseButton.click();

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      console.log(windows);

      await driver.switchTo().window(windows[2]);

      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/ECTS_Syllabi/COMP-213.pdf');

      //Go back
      await driver.switchTo().window(parent);
      
    }, 50000);

      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
