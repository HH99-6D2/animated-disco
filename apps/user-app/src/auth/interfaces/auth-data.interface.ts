type ifString = string | null;

export interface IAuthCreateData {
  provider: number;
  socialId: string;
  email: ifString;
}
