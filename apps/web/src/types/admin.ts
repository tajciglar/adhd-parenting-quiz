export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalEntries: number;
  totalUsers: number;
  entriesByCategory: Record<string, number>;
}
