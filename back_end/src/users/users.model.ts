export class User {
  constructor(
    public username: string,
    public password_hash: string,
    public nickname: string,
    public phone: string,
    public email: string,
    public point: number,
    public is_admin: boolean,
  ) {}
}
