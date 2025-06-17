**Proposed solution (concise)**

**1 Architecture**

- *Service* Node + TypeScript (runs in a single Railway container).
- *Persistence* Postgres via Drizzle ORM.
- _External I/O_

  - **Linear**: GraphQL API + Webhooks for Issue events (reminderAt, completedAt, status) ([linear.app][1], [linear.app][2])
  - **Slack**: Bolt-JS app with interactive buttons.

- *Scheduler* Small cron (node-cron) that every 5 min fetches issues whose `reminderAt <= now()` as a fallback if the workspace’s Linear plan doesn’t emit reminder webhooks.
- _Flow_

  ```
  Linear issue → set “Remind me”
          ↓  (webhook / poll)
  Service logs snapshot  ➜  Slack DM:
        “Done?”  [Yes] [No]
          ↓                     ↓
       on-time / early      late → ask new estimate + reason
          ↓                     ↓
     update Linear status   update reminderAt
          ↓
       write outcome row
  ```

**2 DB schema (minimal)**

```
tickets (
  id              serial PK,
  linear_id       text unique,
  title           text,
  estimate_pts    int,
  reminder_at     timestamptz,
  created_at      timestamptz DEFAULT now(),
  completed_at    timestamptz,
  assignee_id     text
)

outcomes (
  id           serial PK,
  ticket_id    int FK → tickets.id,
  outcome      enum('EARLY','ON_TIME','LATE'),
  actual_days  numeric(4,1),
  notes        text,
  recorded_at  timestamptz DEFAULT now()
)
```

**3 Directory layout**

```
src/
  index.ts           – bootstrap & HTTP listener
  env.ts             – dotenv schema
  modules/
    linear/
      client.ts      – Typed SDK wrapper
      webhooks.ts    – /linear/webhook handler
      poller.ts      – cron fallback
    slack/
      app.ts         – Bolt init
      handlers.ts    – interactive-message callbacks
    db/
      schema.ts      – Drizzle models
      queries.ts
  services/
    estimate.service.ts
    outcome.service.ts
  utils/
tests/
prisma/ or drizzle/
```

**4 Naming conventions**

- Domain nouns (`EstimateSnapshot`, `Outcome`, `ReminderService`)—avoid generic “utils”.
- Functions are verbs (`recordSnapshot`, `sendReminder`).
- Routes: `POST /webhook/linear`, `POST /slack/actions`.

**5 Extensibility hooks**

- Workspace API keys read from `env`.
- Abstract `Notifier` interface (Slack now, email later).
- Additional “provider” folder if another PM tool is added.

**6 Next steps**

1. Create Railway project with Postgres add-on.
2. Scaffold repo (`pnpm dlx create-ts@latest`).
3. Add Drizzle, Linear JS SDK, Bolt.
4. Implement `/linear/webhook` handler → verify signature ([linear.app][2]).
5. Build Slack interaction flow; store responses.
6. Write cron poller; deploy; test with a sample ticket.

If this outline looks correct, I’ll draft the initial code skeleton (handlers + schema).

[1]: https://linear.app/developers?utm_source=chatgpt.com "Linear Developers"
[2]: https://linear.app/docs/api-and-webhooks?utm_source=chatgpt.com "API and Webhooks – Linear Docs"
