export type Story = {
  id: string;
  name: string;
  team?: string;
  link?: string;
  revealed?: boolean;
  assigned?: string;
  refinementId?: string;
  comments?: string[];
  result?: string | null;
  index?: number;
  votes?: Record<string, string>;
};
