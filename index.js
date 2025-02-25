// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

// Function to extract article data from the current page
async function extractArticlesFromPage(page) {
  return await page.$$eval(".athing", (elements) => {
    return elements.map((el) => {
      const rank = el.querySelector(".rank").textContent.trim(); // Extracting the rank of the article
      const id = el.getAttribute("id"); // Extracting the article ID
      const title = el.querySelector(".titleline a").textContent.trim(); // Extracting the article title
      const timeElement = el.nextElementSibling.querySelector(".age");
      const time = timeElement
        ? parseInt(timeElement.getAttribute("title").split(" ")[1])
        : 0; // Default to 0 if time is missing
      return { id, rank, title, time };
    });
  });
}

// Function to collect the first 100 articles from multiple pages by clicking the more button
async function collectFirst100ArticlesUsingMoreButton(page) {
  let articles = [];
  // Loop until we have at least 100 articless
  while (articles.length < 100) {
    // Extract articles from the current page
    const newArticles = await extractArticlesFromPage(page);
    
    // Concatenate newly extracted articles to the existing list
    articles = articles.concat(newArticles);
    console.log(`Collected ${articles.length} articles so far...`);
    // If we still don't have 100 articles, click 'More'
    if (articles.length < 100) {
      console.log("Clicking 'More' to load additional articles...");
      await page.click("a.morelink"); // Clicking the 'More' button
    }
  }
  //Return 100 articles
  return articles.slice(0, 100);
}
// Function to collect the first 100 articles using the query parameters for navigation
async function collectFirst100ArticlesUsingQueryParameter(page) {
  let articles = [];
  let lastId = null; // Store the last article ID for query parameter navigation
  let lastRank = 0; // Store the last rank for query parameter navigation

  // Loop until we have at least 100 articles
  while (articles.length < 100) {
    const newArticles = await extractArticlesFromPage(page);

    // If this is not the first batch, skip the first article from the new batch to avoid duplicates
    if (articles.length > 0 && newArticles.length > 0) {
        newArticles.shift();// Remove the first element (duplicate of last from previous page)
      }

    articles = articles.concat(newArticles);
    console.log(`Collected ${articles.length} articles so far...`);

    // If we have collected enough articles, stop the loop
    if (articles.length >= 100) {
      break;
    }

    // Get the last article's ID and rank for navigation to the next page
    const lastArticle = articles[articles.length - 1];
    lastId = lastArticle.id;
    lastRank = parseInt(lastArticle.rank.replace(".", "")); // Convert rank to integer

    console.log(
      `Navigating to the next page with last ID: ${lastId} and rank: ${lastRank}`
    );

    // Navigate to the next page using query parameters
    await page.goto(
      `https://news.ycombinator.com/newest?next=${lastId}&n=${lastRank}`,{ timeout: 60000 }
    );
  }

  // Return exactly 100 articles
  return articles.slice(0, 100);
}
// Function to validate if the articles are sorted from newest to oldest
function validateArticleOrder(articles) {
  console.log("Validating the order of the articles from newest to oldest...");
  for (let i = 0; i < articles.length - 1; i++) {
    // If the next article is newer than the previous one, it means the order is wrong
    if (articles[i].time < articles[i + 1].time) {
      console.log(
        `Articles are NOT sorted correctly at index ${i}:\n${
          articles[i].id
        }": ${articles[i].title}" is older than ${articles[i + 1].id}: "${
          articles[i + 1].title
        }"`
      );
      return true;
    }
  }
  return false;
}

// Function to choose the method for collecting articles
async function collectFirst100Articles(page, useMoreButton = true) {
  if (useMoreButton) {
    return await collectFirst100ArticlesUsingMoreButton(page);
  } else {
    return await collectFirst100ArticlesUsingQueryParameter(page);
  }
}

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  try {
    // Collect the first 100 articles using the chosen method
    const first100Articles = await collectFirst100Articles(page, true); // Set to false to use query parameters

    // Validate if the articles are sorted from newest to oldest
    const isSorted = validateArticleOrder(first100Articles);
    if (isSorted) {
      console.log(
        "\n✅ The first 100 articles are sorted correctly from newest to oldest."
      );
    } else {
      console.log("❌ The first 100 articles are NOT sorted correctly.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
})();

