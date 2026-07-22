# Daily World Brief

Daily World Brief is a zero-cost morning newsletter project. It uses only GitHub Pages for the public subscription page, Google Apps Script for subscription handling, RSS processing, scheduling, and email sending, and Google Sheets for subscriber storage.

The service is not live until you deploy the Apps Script web app, replace the frontend endpoint, configure tested RSS feeds, and publish the static site.

## File Structure

```text
daily-world-brief/
├── index.html
├── styles.css
├── app.js
├── apps-script/
│   └── Code.gs
├── README.md
└── .gitignore
```

## Placeholders

- `app.js`: replace `REPLACE_WITH_APPS_SCRIPT_URL` with the deployed Apps Script web-app URL.
- `apps-script/Code.gs`: `USA_FEEDS`, `KOREA_FEEDS`, and `WORLD_FEEDS` contain editable RSS feed objects. Test every feed and review publisher reuse terms before production use.
- Script Property `SPREADSHEET_ID`: set this to your private Google Sheet ID.
- Script Property `SITE_URL`: set this to the GitHub Pages URL for the public subscription page.
- Script Property `SENDER_NAME`: set this to the display name for outgoing emails, such as `Daily World Brief`.

No private key, spreadsheet ID, email password, or secret belongs in the frontend files.

## 1. Gmail Account Setup

Use the Google account that should own the Apps Script project and send the emails. MailApp sends through the account running the script and is subject to that account's daily quota.

## 2. Google Sheet Setup

Create a private Google Sheet. Do not publish it to the web and do not share it publicly.

Create a sheet named `Subscribers` with these columns in row 1:

```text
email
status
confirmation_token
unsubscribe_token
created_at
confirmed_at
unsubscribed_at
last_sent_at
```

The script can also create or repair the header row when `testSheetConnection()` runs.

## 3. Apps Script Setup

Open the Google Sheet, then choose Extensions > Apps Script. Create a script file named `Code.gs` and paste in the contents of `apps-script/Code.gs`.

## 4. Script Properties

In Apps Script, open Project Settings > Script Properties and add:

```text
SPREADSHEET_ID = your Google Sheet ID
SITE_URL = your future GitHub Pages URL
SENDER_NAME = Daily World Brief
```

## 5. Project Timezone

In Apps Script project settings, set the timezone to `Asia/Seoul`.

## 6. Authorization

Run `testSheetConnection()` from the Apps Script editor. Review and approve the requested permissions for Sheets, script properties, external URL fetching, and MailApp.

## 7. Web-App Deployment

In Apps Script, choose Deploy > New deployment > Web app.

Set:

- Execute as: `Me`
- Who has access: `Anyone`

Copy the deployed web-app URL. This URL handles subscription POST requests, confirmation links, and unsubscribe links.

## 8. Replacing the Frontend Endpoint

Open `app.js` and replace:

```js
const SUBSCRIPTION_ENDPOINT = "REPLACE_WITH_APPS_SCRIPT_URL";
```

with your deployed Apps Script web-app URL.

Do not put the spreadsheet ID or any secret in `index.html`, `styles.css`, or `app.js`.

## 9. Local Website Preview

This is a static site. Open `index.html` in a browser to preview it locally. Subscriptions will only work after the Apps Script web-app URL is deployed and inserted into `app.js`.

## 10. Subscription Testing

After deployment, enter an email address on the page and submit the form. The Apps Script `doPost(e)` handler stores the address as `pending` and sends a double-opt-in confirmation email.

The hidden honeypot field is named `website`. If it is populated, the script silently accepts the request without storing or sending anything.

## 11. Confirmation Testing

Open the confirmation link from the email. A valid pending token changes the subscriber status to `active` and sets `confirmed_at`.

Confirmation tokens expire after 14 days. Invalid or expired links show a generic public message.

## 12. Unsubscribe Testing

Use the unsubscribe link in a test email. The script changes the subscriber status to `unsubscribed` and sets `unsubscribed_at`. It does not delete the row.

## 13. Feed Testing

Edit `USA_FEEDS`, `KOREA_FEEDS`, and `WORLD_FEEDS` in `Code.gs`.

Each feed object must contain:

```js
{
  name: "Publisher name",
  url: "https://publisher.example/rss.xml",
  priority: 3,
  region: "USA"
}
```

Only use free public RSS or Atom feeds. Test every RSS address before production use, and check each publisher's reuse, redistribution, and email-newsletter terms. The configured feed URLs are editable and should be rechecked before production use.

Run `testFeeds()` to verify fetch and parsing behavior. One failed feed should not stop the others.

## 14. Newsletter Preview Testing

Run `testNewsletterPreview()` to generate a plain-text preview in the Apps Script logs without sending to subscribers.

Run `testSendDailyNewsletterToOwner()` to send one preview email only to the Google account running the script. It does not send to the subscriber list.

## 15. Creating the Daily Trigger

Run `setupDailyTrigger()` after feed testing is complete. It removes existing `sendDailyNewsletter` triggers first, then creates one daily time-driven trigger for the 8 AM hour.

Apps Script time-driven triggers may run within a time window. They are not guaranteed to execute at exactly `8:00:00 AM`.

Run `removeDailyTrigger()` to remove the daily newsletter trigger.

## 16. GitHub Repository Creation

Create a new GitHub repository named `daily-world-brief`. Add these files to it:

```text
index.html
styles.css
app.js
apps-script/Code.gs
README.md
.gitignore
```

The Apps Script code is stored in the repository for version control, but it must still be pasted or synced into Apps Script to run.

## 17. GitHub Pages Publishing

In the GitHub repository, open Settings > Pages. Publish from the main branch root. After GitHub Pages gives you a public URL, set the Apps Script `SITE_URL` property to that URL.

## 18. Updating an Apps Script Deployment

After changing `Code.gs`, create a new Apps Script deployment version or edit the existing deployment, depending on your deployment workflow. If the web-app URL changes, update `SUBSCRIPTION_ENDPOINT` in `app.js` and redeploy GitHub Pages.

## 19. MailApp Quotas

`sendDailyNewsletter()` checks `MailApp.getRemainingDailyQuota()` before sending. It sends separately to each active subscriber and updates `last_sent_at` only after a successful send.

Google changes quota rules from time to time and quotas vary by account type. Check Google's current MailApp quota documentation before production use.

## 20. RSS Publisher Terms

RSS feeds are public access mechanisms, not blanket republication licenses. Before production use, confirm that each publisher allows reuse of titles, feed descriptions, links, and source names in an email newsletter.

This project does not fetch or scrape full article HTML. It uses only RSS or Atom fields supplied by the feed.

## 21. Troubleshooting

- Missing Script Property: verify `SPREADSHEET_ID`, `SITE_URL`, and `SENDER_NAME`.
- Subscription form shows setup error: replace `REPLACE_WITH_APPS_SCRIPT_URL` in `app.js`.
- No confirmation email: check MailApp authorization, spam folders, and remaining quota.
- Duplicate subscription: active subscribers cannot subscribe again with the same normalized email.
- Feed returns zero stories: verify publisher access, test the configured RSS URLs, and check that items are from the most recent 30 hours.
- Korean section is empty: use Korean-language feeds; Korean-section items without meaningful Korean text are rejected.
- Newsletter sends fewer than five stories: the script uses fewer stories instead of adding weak, stale, or duplicate items.
- Trigger did not run exactly at 8:00 AM: Apps Script runs time triggers within an approximate execution window.

## Security Review

- The spreadsheet is private and accessed only by Apps Script using `SPREADSHEET_ID`.
- Subscriber records are never returned by `doGet(e)` or `doPost(e)`.
- Frontend files contain no spreadsheet ID, password, private key, or token.
- RSS-derived text is escaped before insertion into HTML emails.
- Spreadsheet writes sanitize string values to reduce formula-injection risk.
- `LockService` protects subscription and subscriber-update writes.
- Public action names are validated.
- Browser requests cannot call `sendDailyNewsletter()`.
- Confirmation tokens, unsubscribe tokens, and subscriber email addresses are not logged.
- The code does not use `eval`.
