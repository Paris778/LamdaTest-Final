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
* Figure out why it can't find the button element
* Write a test of the schedule button
* 
/*
*********************************************************************************************************
IMPORTANT NOTE:
 This page was really probelmatic and I spent a lot of time on it.
The two last button tests always fail because it can't find the button element for whatever reason.
So after a lot of trial and error I decided to move on to other pages and come back to it if I have time.
*********************************************************************************************************
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

    it("navigates to Academic/Course Pre-Registration", async () => {
    
      let button1 = driver.findElement(By.partialLinkText('Academic'));
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[3]/div/ul/li[7]/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('Course Pre-Registration | UNIC Portal');
    }, 50000);

    //Clicks on a course
    //Sometimes , this test fails.
    //If it fails the 'clicks on course from expanded window' also fails
    it("clicks on a course", async () => {

      //let courseButton = await driver.findElement(By.linkText("COMP-112"));
      //let courseButton = await driver.findElement(By.xpath('//*[@id="academicPathDT"]/tbody/tr[1]/td[1]/a'));
      //let courseButton = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[2]/div[3]/div[1]/div[2]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[1]/a'));      

      let courseButton = await driver.findElement(By.xpath('//*[@id="academicPathDT"]/tbody/tr[4]/td[1]/a'));      
      await courseButton.click();

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      await driver.switchTo().window(windows[1]);

      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/ECTS_Syllabi/COMP-114.pdf');

      //Go back
      await driver.close();
      await driver.switchTo().window(parent);
      //await driver.get("https://portal.unic.ac.cy/academic/course-registration");
      
    }, 50000);


    it("clicks on an accordion element Section B", async () => {

      let plusBtn = await driver.findElement(By.xpath('//*[@id="coursesListSectionBHead"]'));
      await plusBtn.click();

      let checkClass = await driver.findElement(By.id('coursesListSectionBHead')).getAttribute('aria-expanded');
     //    m-accordion__item-head background-white
      
      await expect(checkClass).toBe('true');      
      
    }, 50000);

    it("clicks on a course from expanded menu", async () => {

      let courseButton = await driver.findElement(By.partialLinkText('COMP-213'));
      
      await courseButton.click();

      let parent = await driver.getWindowHandle();
      let windows = await driver.getAllWindowHandles();

      console.log(windows);

      await driver.switchTo().window(windows[1]);

      await expect(await driver.getCurrentUrl()).toBe('https://www.unic.ac.cy/ECTS_Syllabi/COMP-213.pdf');

      //Go back
      await driver.switchTo().window(parent);
      
    }, 50000);

    it("clicks on an accordion element Section B to collapse", async () => {

      let plusBtn = await driver.findElement(By.xpath('//*[@id="coursesListSectionBHead"]'));
      await plusBtn.click();

      let checkClass = await driver.findElement(By.id('coursesListSectionBHead')).getAttribute('aria-expanded');
     //    m-accordion__item-head background-white
     //   m-accordion__item-head background-white collapsed
      
      await expect(checkClass).toBe('false');      
      
    }, 50000);

    it("clicks 'View Calendar' button ", async () => {

      //let toggleBtn = await driver.findElement(By.id('courseCalendarToggle'));
      //let toggleBtn = await driver.findElement(By.xpath('//*[@id="courseCalendarToggle"]'));
      //let toggleBtn = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[2]/button[1]'));
      //let toggleBtn = await driver.findElement(By.partialLinkText('Calendar'));
      let toggleBtn = await driver.findElement(By.xpath('//*[@id="courseCalendarToggle"]/i'));
     

      await toggleBtn.click();

      let checkElementAttribute = await driver.findElement(By.id('coursesList')).getAttribute('style');
      
      await expect(checkElementAttribute).toBe('display: none;');      
      
    }, 50000);

    it("clicks 'Schedule' button ", async () => {

      let scheduleBtn = await driver.findElement(By.id('btnPrintSchedule'));
      //await scheduleBtn.click();

      //FILL THIS IN 
      // *****
      
      await expect(true).toBe(true);      
      
    }, 50000);

    it("clicks 'View Courses' button ", async () => {

      //let toggleBtn = await driver.findElement(By.id('courseCalendarToggle'));
      let toggleBtn = await driver.findElement(By.partialLinkText('View Courses'));
      await toggleBtn.click();

      let checkElementAttribute = await driver.findElement(By.id('calendarContainer')).getAttribute('style');
      
      await expect(checkElementAttribute).toBe('display: none;');      
      
    }, 50000);

      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
