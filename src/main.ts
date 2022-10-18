import puppeteer from 'puppeteer';

export async function main(
  body: mainBody
) {
  try {
    // 1. Create a new browser session with Puppeteer
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    const timestamp = new Date();

    // 2. Navigate to 'https://ca.indeed.com/' and search for jobs using the variables passed in the body
    await page.goto('https://ca.indeed.com/')
    await page.type('#text-input-what', `${testBody.job_title}`)


    // 3. Location input is modified, but first we clear the existing (default) location
    await page.focus('#text-input-where');
    await page.click('#text-input-where' , { clickCount: 3 })
    await page.keyboard.type(`${testBody.city}, ${testBody.province}`);
    delay(5000)

    // 4.a clicking the correct button (by class)
    // await page.focus('.yosegi-InlineWhatWhere-primaryButton')
    // await page.waitForSelector('.yosegi-InlineWhatWhere-primaryButton')
    // await page.click('.yosegi-InlineWhatWhere-primaryButton');

    // 4.b clicking the correct button (by selector)
    await page.focus('#jobsearch > button')
    await page.waitForSelector('#jobsearch > button')
    await page.click('#jobsearch > button');



    // 3. Copy the Job Title, Company Name, and Full Job Description for the first 'n' jobs, where 'n' is 'number_of_jobs', and save it to an appropriately named .txt file
    // const result = await page.evaluate(() => {
    //   return document.querySelector("jcs-JobTitle css-jspxzf eu4oa1w0").innerText;
    // });

    // const jobTitles = page.$x(`//a[@class="jcs-JobTitle css-jspxzf eu4oa1w0"]`)
    // const jobLocations = page.$x(`//div[@class="companyLocation"]`)
    // const jobDescriptions = page.$x(`//div[@class="slider_sub_item css-kyg8or eu4oa1w0"]`)
    // console.log(jobTitle)

    const jobListings = await page.evaluate(() => {
        const jobInfo = [];
        const jobs = document.querySelectorAll(
            '#mosaic-jobcards > div:not([style*="display:none;"]) a.jcs-JobTitle css-jspxzf eu4oa1w0'
        );
        jobs.forEach((item) => {
            jobInfo.push({

                job_title: item.textContent,
                company_name: document.querySelector('.companyName') as HTMLInputElement,
                job_description: document.querySelector('.slider_sub_item.css-kyg8or.eu4oa1w0') as HTMLInputElement,

            });
        });
        return jobs[6];
        console.log(jobs)
    });

    // 4. If 'screenshot' is true, take a screenshot of the entire page and save it to an appropriately named .png file
    await page.screenshot({path: `./screenshots/${timestamp.getUTCMilliseconds()}-jobs.png`, fullPage: true })

    await browser.close()

    return { automation: true };

  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Automation %s', error);
    return {
      error: error,
      automation: false,
    };
  } finally {}
}

export interface mainBody {
  job_title: string;
  city: string;
  province: string;
  number_of_jobs: number;
  screenshot: boolean;
}

const testBody: mainBody = {
  job_title: 'Software Engineer',
  city: 'Toronto',
  province: 'ON',
  number_of_jobs: 7,
  screenshot: true,
};

main(testBody).then(res => {
  console.log(res);
  process.exit(0);
});

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
