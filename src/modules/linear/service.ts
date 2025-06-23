import { env } from "../../env";
import { LinearIssueSchema, LinearIssue } from "./schema";
import { serializeLinearIssue } from "./schema";
import { db } from "../../db/client";
import { linear_issues } from "../../db/schema";
import { sql } from "drizzle-orm";

export class LinearService {
  /**
   * Fetch all issues from Linear (no filtering)
   *   /**
   * Fetch issues for a specific Linear team using the team's key.
   * @param teamKey The team key (e.g. "1EDTECH") used in Linear.
   * getIssuesByTeam method removed; use getAllIssues (now scoped to "1EDTECH") instead.
   */
  static async getAllIssues(teamKey: "1ED" = "1ED"): Promise<LinearIssue[]> {
    const query = `
        query {
          issues(first: 50, filter: {
              team: {key: { eq: "${teamKey}"}}, 
              assignee: {id: {eq: "526a6693-0f73-48f0-aca1-d6bbd6e1ad5a"}},
              state: {name: {in: ["In Progress", "Todo", "In Review"]}}
            }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              identifier
              number
              title
              description
              priority
              createdAt
              updatedAt
              completedAt
              dueDate
              branchName
              url
              state { id name type }
              team { id name key }
              assignee { id name email }
            }
          }
        }
      `;

    const response = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${env.LINEAR_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Linear API error ${response.status}: ${text}`);
    }

    const json = (await response.json()) as any;

    // Validate and return typed array of LinearIssue objects
    const nodes = json.data?.issues?.nodes ?? [];
    return LinearIssueSchema.array().parse(nodes);
  }

  /**
   * Upsert Linear issues into the database.
   * 1. Fetches issues from Linear via `getAllIssues`.
   * 2. Serializes each issue to match `linear_issues` table shape.
   * 3. Performs an upsert (insert or update on conflict by id).
   *
   * Returns the number of issues processed.
   */
  static async upsertIssues(teamKey: "1ED" = "1ED"): Promise<number> {
    const issues = await this.getAllIssues(teamKey);

    // Convert to DB-ready rows using the serializer (validates + adds custom fields)
    const rows = issues.map((issue) => serializeLinearIssue(issue));

    // Upsert each row. Keeping the loop simple for clarity; can be batch-optimized later.
    for (const row of rows) {
      await db
        .insert(linear_issues)
        .values(row as any) // cast for drizzle insert type compatibility
        .onConflictDoUpdate({
          target: linear_issues.id,
          set: row as any,
        });
    }

    return rows.length;
  }
}
