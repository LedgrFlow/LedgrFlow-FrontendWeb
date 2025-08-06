export type UserActivity = {
  id: string;
  user_id: string;
  event: string;
  ip_address: string;
  user_agent?: string | null;
  org_id?: string | null;
  file_id?: string | null;
  created_at: string; // ISO date string
};

export type CreateActivityPayload = {
  event: string;
  org_id?: string;
  file_id?: string;
};

export type UpdateActivityPayload = Partial<
  Omit<CreateActivityPayload, "event" | "ip_address"> & {
    event?: string;
    ip_address?: string;
  }
>;
