import { pool } from "./database";
import { AIResponse, ComparisonRecord } from "./ai-providers/type";

export async function saveComparison(
  prompt: string,
  responses: AIResponse[]
): Promise<number> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const totalTokens = responses.reduce(
      (sum, r) => sum + r.usage.totalTokens,
      0
    );
    const totalCost = responses.reduce((sum, r) => sum + r.estimatedCost, 0);
    const successfulResponses = responses.filter((r) => r.success).length;
    const averageLatency =
      successfulResponses > 0
        ? Math.round(
            responses
              .filter((r) => r.success)
              .reduce((sum, r) => sum + r.latency, 0) / successfulResponses
          )
        : 0;

    const comparisonResult = await client.query(
      `
      INSERT INTO comparisons (prompt, total_tokens, total_cost, successful_responses, average_latency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      [prompt, totalTokens, totalCost, successfulResponses, averageLatency]
    );

    const comparisonId = comparisonResult.rows[0].id;

    for (const response of responses) {
      await client.query(
        `
        INSERT INTO model_responses (
          comparison_id, provider, model, response, prompt_tokens, 
          completion_tokens, total_tokens, estimated_cost, latency, 
          success, error_message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
        [
          comparisonId,
          response.provider,
          response.model,
          response.response,
          response.usage.promptTokens,
          response.usage.completionTokens,
          response.usage.totalTokens,
          response.estimatedCost,
          response.latency,
          response.success,
          response.error || null,
        ]
      );
    }

    await client.query("COMMIT");
    return comparisonId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getComparisonHistory(
  limit: number = 10
): Promise<ComparisonRecord[]> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT 
        c.id,
        c.prompt,
        c.created_at,
        c.total_tokens,
        c.total_cost,
        c.successful_responses,
        c.average_latency,
        json_agg(
          json_build_object(
            'provider', mr.provider,
            'model', mr.model,
            'response', mr.response,
            'usage', json_build_object(
              'promptTokens', mr.prompt_tokens,
              'completionTokens', mr.completion_tokens,
              'totalTokens', mr.total_tokens
            ),
            'estimatedCost', mr.estimated_cost,
            'latency', mr.latency,
            'success', mr.success,
            'error', mr.error_message
          )
        ) as responses
      FROM comparisons c
      LEFT JOIN model_responses mr ON c.id = mr.comparison_id
      GROUP BY c.id, c.prompt, c.created_at, c.total_tokens, c.total_cost, c.successful_responses, c.average_latency
      ORDER BY c.created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows.map((row) => ({
      id: row.id,
      prompt: row.prompt,
      createdAt: row.created_at,
      totalTokens: row.total_tokens,
      totalCost: parseFloat(row.total_cost),
      successfulResponses: row.successful_responses,
      averageLatency: row.average_latency,
      responses: row.responses || [],
    }));
  } finally {
    client.release();
  }
}

export async function getComparisonById(
  id: number
): Promise<ComparisonRecord | null> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT 
        c.id,
        c.prompt,
        c.created_at,
        c.total_tokens,
        c.total_cost,
        c.successful_responses,
        c.average_latency,
        json_agg(
          json_build_object(
            'provider', mr.provider,
            'model', mr.model,
            'response', mr.response,
            'usage', json_build_object(
              'promptTokens', mr.prompt_tokens,
              'completionTokens', mr.completion_tokens,
              'totalTokens', mr.total_tokens
            ),
            'estimatedCost', mr.estimated_cost,
            'latency', mr.latency,
            'success', mr.success,
            'error', mr.error_message
          )
        ) as responses
      FROM comparisons c
      LEFT JOIN model_responses mr ON c.id = mr.comparison_id
      WHERE c.id = $1
      GROUP BY c.id, c.prompt, c.created_at, c.total_tokens, c.total_cost, c.successful_responses, c.average_latency
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      prompt: row.prompt,
      createdAt: row.created_at,
      totalTokens: row.total_tokens,
      totalCost: parseFloat(row.total_cost),
      successfulResponses: row.successful_responses,
      averageLatency: row.average_latency,
      responses: row.responses || [],
    };
  } finally {
    client.release();
  }
}
