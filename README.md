# Hacker News Article Scraper

This project contains a script that scrapes the first 100 articles from the "newest" section of Hacker News using Playwright. The script collects the articles and validates if they are sorted from newest to oldest based on their timestamps.

## How It Works

### Main Functions

1. **extractArticlesFromPage(page)**:
   - Extracts article data from the current page.
   - Returns an array of articles with their rank, ID, title, and time.

2. **collectFirst100ArticlesUsingMoreButton(page)**:
   - Collects the first 100 articles by clicking the "More" button to load additional articles.
   - Returns an array of the first 100 articles.

3. **collectFirst100ArticlesUsingQueryParameter(page)**:
   - Collects the first 100 articles by navigating through pages using query parameters.
   - Returns an array of the first 100 articles.

4. **collectFirst100Articles(page, useMoreButton = true)**:
   - Chooses the method for collecting the first 100 articles based on the `useMoreButton` parameter.
   - Returns an array of the first 100 articles.

5. **validateArticleOrder(articles)**:
   - Validates if the articles are sorted from newest to oldest based on their timestamps.
   - Returns `true` if the articles are sorted correctly, otherwise `false`.

6. **sortHackerNewsArticles()**:
   - Main function that launches the browser, navigates to Hacker News, collects the first 100 articles, and validates their order.

### Usage

1. Ensure you have Node.js installed.
2. Install the required dependencies by running:
   ```bash
   npm install
   ```
3. Run the script:
   ```bash
   npm run start
   ```

### Dependencies

- [Playwright](https://playwright.dev/): A Node.js library to automate Chromium, Firefox, and WebKit with a single API.

### Notes

- The script uses the `collectFirst100Articles` function to collect articles. You can choose the method by setting the `useMoreButton` parameter to `true` (default) for using the "More" button or `false` for using query parameters.
- The script runs in headless mode by default.

### Example Output

- If the articles are sorted correctly:
  ```
  ✅ The first 100 articles are sorted correctly from newest to oldest.
  ```
- If the articles are not sorted correctly:
  ```
  ❌ The first 100 articles are NOT sorted correctly.
  ```

### Error Handling

- The script includes error handling to catch and log any errors that occur during execution.

