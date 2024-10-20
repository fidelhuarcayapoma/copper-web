export interface Report {
  activeUsers: number;
  inactiveUsers: number;
  usersPerRole: UsersPerRole;
}

interface UsersPerRole {
  ADMIN: number;
  USER: number;
  BASIC: number;
  PREMIUM: number;
}