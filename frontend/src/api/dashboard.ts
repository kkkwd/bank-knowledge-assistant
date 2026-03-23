import { apiClient } from "./client";
import { MetricsOverview } from "../types/metrics";

export function fetchMetricsOverview() {
  return apiClient.get<MetricsOverview>("/metrics/overview");
}

export function fetchRecentQuestions() {
  return apiClient.get<string[]>("/metrics/recent-questions");
}
