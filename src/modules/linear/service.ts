import { env } from "../../env";

export class LinearService {
  /**
   * Fetch all issues from Linear (no filtering)
   */
  static async getAllIssues(): Promise<any[]> {
    const query = `
      query {
        issues(first: 50) {
          nodes {
            id
            identifier
            title
            estimate
            createdAt
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
    return json.data?.issues?.nodes ?? [];
  }
}
