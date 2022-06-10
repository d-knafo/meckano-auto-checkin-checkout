# meckano-auto-checkin-checkout

A bot for auto checkin an checkout from Meckano system

## installation

- copy the .env.example to .env
- change .env with your credentials
- change the cron schedule with the time you want checkin and checkout

  > INFO
  > Default checkin is at 09:45 on every day-of-week from Sunday through Thursday.
  > Default checkout is at 19:00 on every day-of-week from Sunday through Thursday.

- run

```
yarn install
pm2 start app.js
```
