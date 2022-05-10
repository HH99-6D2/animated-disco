type ifString = string | null;

export interface IUserCreateData {
  id: number;
  nickname: ifString;
  imageUrl: ifString;
}
