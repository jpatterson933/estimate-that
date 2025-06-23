import { env } from "../../env";
import { LinearIssueSchema, LinearIssue } from "./schema";

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
}
