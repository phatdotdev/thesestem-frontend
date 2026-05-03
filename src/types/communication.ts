export interface NotificationResponse {
  id: string;
  title: string;

  content: string;

  type: string;

  userId: string;
  read: boolean;

  createdAt: string;
}
