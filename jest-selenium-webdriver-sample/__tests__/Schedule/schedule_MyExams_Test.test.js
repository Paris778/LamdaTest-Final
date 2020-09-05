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

    //My exams
    it("navigates to Schedule/My Exams", async () => {
      
      let button1 = driver.findElement(By.partialLinkText('Schedule'));
      //await driver.findElement(By.className("ml-3 m-lg-0"));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[2]/div/ul/li[2]/a/span"));
      await button2.click();

      await expect(await driver.getTitle()).toBe('My Exams | UNIC Portal');
    }, 50000);

    //Clicks on a course
    it("clicks on a course", async () => {

      let courseButton = await driver.findElement(By.xpath('//*[@id="courseScheduleDT"]/tbody/tr[2]/td[1]/a'));
      await courseButton.click();

      //await driver.findElement(By.css("body")).sendKeys(key.CONTROL+"\t");
      //console.log(driver.getWindowHandles());

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      console.log(windows);

      await driver.switchTo().window(windows[1]);

      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/ECTS_Syllabi/COMP-431.pdf');

      //Go back
      await driver.switchTo().window(parent);
      
    }, 50000);

    //Clicks on a Professor
    it("clicks on a professor", async () => {

      let profButton = await driver.findElement(By.partialLinkText('Dr Ioanna Dionysiou'));
      await profButton.click();

      await expect(await driver.getTitle()).toBe('Dr Ioanna Dionysiou | UNIC Portal');

      //Go back
      await driver.get("https://portal.unic.ac.cy/schedule/exams?academic-period-id=454");
      
    }, 50000);

    //Changes Period
    it("changes period to Spring 2018", async () => {

      let dropButton = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/div/button'));
      await dropButton.click();

      let periodButton = await driver.findElement(By.xpath('//*[@id="bs-select-1-4"]'));
      await periodButton.click();

      await expect(await driver.getCurrentUrl()).toBe('https://portal.unic.ac.cy/schedule/exams?academic-period-id=427');
        
    }, 50000);

  
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
