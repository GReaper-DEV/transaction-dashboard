# Transaction Dashboard

A small React app that shows a bank account balance and a list of transactions. You can:

- search by merchant
- filter by status and type
- sort by date or amount
- show 10, 25 or 50 transactions per page
- click a transaction to see more details

Built with React, TypeScript and Tailwind CSS, using Vite.

## How to run it

You need Node.js 22.12 or newer.

```bash
npm install
npm run dev     # open http://localhost:5173
npm test        # run the tests
npm run build   # build for production
```

There is no real backend. The file `src/api/mockApi.ts` reads the data from JSON files in `src/data/` and waits a short time before it returns them, like a real API would.

You can add one of these to the URL to see other states:

- `?scenario=error`: loading the transactions fails, and you can try the "Try again" button
- `?scenario=empty`: the account has no transactions
- `?scenario=slow`: loading takes 3 seconds, so you can see the loading state

## Folder structure

```
src/
├── types.ts                  Account, Transaction, Money
├── api/mockApi.ts            Fake API that reads local JSON
├── data/                     Test data
├── lib/                      Helpers for money, dates and pagination
├── hooks/useFetch.ts         Loads data and handles loading, errors and retry
├── components/ui/            Reusable components
│                             (Button, Badge, Card, Select, TextInput, Modal, Pagination, StateMessage)
└── features/
    ├── account/              Account summary
    └── transactions/         Everything for the transactions list
```

`components/ui` has simple components like buttons, dropdowns and the modal. They don't know anything about transactions, so they can be used anywhere in the app.

`features/` has the code for each part of the app. All the transactions code is in one folder.

In `features/transactions`, only `TransactionsSection` has state. It loads the data, keeps the filters, the current page and the open transaction, and passes them to the other components. The other components only show what they get.

## Main decisions

### Money

- Amounts are saved in cents, not as decimal numbers. For example, €45.23 is saved as `4523`. Decimal numbers in JavaScript are not always exact (`0.1 + 0.2` gives `0.30000000000000004`), so using whole numbers avoids small mistakes in money.
- Not every currency has 2 decimals. Euro has 2, Japanese yen has 0. The app uses the browser's `Intl.NumberFormat`, which knows this for every currency.
- Amounts are always positive in the data. The `type` field (credit or debit) says if money came in or went out. The + or − sign is added only on the screen.
- Money in is green with a +. Declined transactions are crossed out, because they did not change the balance.

### Data and state

- A small hook, `useFetch`, loads the data. It gives back the data, a loading flag, an error and a `retry` function. The account and the transactions load separately, so if one fails, the other still works.
- Filters, the current page and the page size are saved with `useState`. The list on the screen is calculated from the data and the filters each time something changes (with `useMemo`). There is no second copy of the list to keep updated.
- The steps are always: filter, then sort, then split into pages. When you change a filter or the page size, you go back to page 1.
- Filtering, sorting and pagination are normal functions without React. This makes them easy to test.

### UI

- The same list works on phone and desktop. On a phone, each transaction is a small card. On a bigger screen, the data is shown in columns. Each row is a `<button>`, so it also works with the keyboard.
- Details open in a modal. The modal uses the browser's `<dialog>` element, which already handles focus, closing with Escape and clicking outside.
- Long names and descriptions are cut in the list and shown in full in the details.
- There is no router, because the app has only one page. The downside: the open transaction is not in the URL, so a refresh closes it and you can't share a link to it.

### Libraries

Only React, Tailwind and Vitest. The browser already has what this app needs (`Intl` for formatting money and dates, `<dialog>` for the modal).

## Tests

The tests check the parts where a bug would cause the most problems:

- money formatting (decimals for each currency, + and − signs)
- filtering and sorting
- pagination (last page, a page that doesn't exist, an empty list)

## Git

The project was pushed as a single commit. In a team project, I would create a separate branch for each feature (for example `feature/pagination`), open a pull request so someone can review it, and merge it into the main branch after review.

## Known problem

Sorting by amount is not correct when the transactions are in different currencies. Without exchange rates, the app can't know if $129.99 is more or less than ¥8,990, so it just compares the numbers. In a real app, the backend should send all amounts in the account currency, or do the sorting itself.

## If the app gets bigger

I didn't add these because the app has only one page, but I would add them as it grows:

- **Filtering, sorting and pagination on the server.** Now all transactions are loaded at once. This is fine for a small list, but not for thousands of transactions.
- **Amounts in the account currency from the backend.** This fixes the sorting problem above.
- **Filters in the URL.** So a refresh keeps the filters, and you can share a link to a filtered list.
- **Checking API data with zod.** TypeScript only checks the code, not the data that comes from the server. zod checks the data when it arrives and shows a clear error if something is wrong.
- **More tests.** Component tests with Testing Library for the main actions (filter, open details, retry), and end-to-end tests with Playwright on phone and desktop sizes.
- **Prettier and ESLint.** To keep the code style the same everywhere and catch common mistakes with React hooks. Also `tailwind-merge`, so a component's default styles can be safely changed from outside.
- **Environment variables.** When there is a real API, its URL goes in a `.env` file (for example `VITE_API_URL`), so development and production can use different servers. `.env.example` shows what to set. It is not used yet, because the app only reads mock data.
- **React Router.** If we add more pages, for example account details, each page needs its own URL, like `/account/details`. The same goes for transactions: with a URL like `/transactions/:id`, a transaction can be opened in a new tab, shared as a link, or reopened after a refresh. A router like React Router handles this.