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
* ----------------------
* General Page Tests
* ----------------------
* Test the 'My Clubs Only' check box
* Test the entries drop down menu
* Test the searching feature
* Test the page navigation (press on page number directly or with left/right buttons)
* Test sorting by clicking on table headers (Name/Category/Status)
* ----------------------
* Specific Club Tests
* ----------------------
* Test Join/Leave functionality
* Test Event functioanlity (click on events, interact with integrated google maps)
* Test the committee member entries drop down menu
* Test the committee member search bar
* Test the committee member page navigation (if applicable) using page numbers and arrows
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

    it("navigates to Student Life/Clubs", async () => {
    
      let button1 = driver.findElement(By.partialLinkText('Student Life'));
      
      await button1.click();
      let button2 = await driver.findElement(By.xpath("/html/body/div[1]/header/div[2]/div/div/div/div/ul/li[4]/div/ul/li/a/span"));
      await button2.click();
  
      await expect(await driver.getTitle()).toBe('Clubs | UNIC Portal');
    }, 50000);

    //////////////////////////////////////////
    //Specific club page tests
    it("presses on a club", async () => {
    
      //let clubBtn = await driver.findElement(By.partialLinkText('Accounting'));
      let clubBtn = await driver.findElement(By.xpath('//*[@id="clubsListDT"]/tbody/tr[1]/td[1]/a'));
      await clubBtn.click();
      

  
      await expect(await driver.getCurrentUrl()).toBe('https://portal.unic.ac.cy/student-life/clubs/367');
    }, 50000);

    it("presses on Events tab", async () => {
    
      let eventsBtn = await driver.findElement(By.xpath('//*[@id="clubInfo"]/div[1]/div/ul/li[2]/a'));
      await eventsBtn.click();

      let checkParameter = await eventsBtn.getAttribute("aria-selected");
      
      await expect(checkParameter).toBe('true');
    }, 50000);

    it("presses on Committee Members tab", async () => {
    
      let commMembBtn = await driver.findElement(By.xpath('//*[@id="clubInfo"]/div[1]/div/ul/li[3]/a'));
      await commMembBtn.click();

      let checkParameter = await commMembBtn.getAttribute("aria-selected");
      
      await expect(checkParameter).toBe('true');
    }, 50000);

    it("presses on Announcements tab", async () => {
    
      let announcementsBtn = await driver.findElement(By.xpath('//*[@id="clubInfo"]/div[1]/div/ul/li[4]/a'));
      await announcementsBtn.click();

      let checkParameter = await announcementsBtn.getAttribute("aria-selected");
      
      await expect(checkParameter).toBe('true');
    }, 50000);

    //Specific Club tests end here
    //////////////////////////////////////////

    /* *************************
    OTHER ELEMENTS (for Student Life / Clubs  page)

    let myClubsOnyCheckBox = await driver.findElement(By.xpath('//*[@id="clubFilter"]/label'));
    let dropDownMenuBtn = await driver.findElement(By.xpath('//*[@id="clubsListDT_length"]/label/select')); 
    let searchBar = await driver.findElement(By.xpath('//*[@id="clubsListDT_filter"]/label/input')); 
    //
    let nameHeaderBar = await driver.findElement(By.xpath('//*[@id="clubsListDT"]/thead/tr/th[1]')); 
    let categoryHeaderBar = await driver.findElement(By.xpath('//*[@id="clubsListDT"]/thead/tr/th[2]')); 
    let statusHeaderBar = await driver.findElement(By.xpath('//*[@id="clubsListDT"]/thead/tr/th[3]')); 
    //
    let secondPageBtn = await driver.findElement(By.xpath('//*[@id="clubsListDT_paginate"]/ul/li[3]/a')); 
    let arrowBtnRight = await driver.findElement(By.xpath('//*[@id="clubsListDT_next"]/a')); 
    let arrowBtnLeft = await driver.findElement(By.xpath('//*[@id="clubsListDT_previous"]/a')); 
    //


    */
    
      
    afterAll(async () => {
      await driver.quit();
    }, 40000);      
  });
