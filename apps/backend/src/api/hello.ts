import { IGetUserAuthInfoRequest } from '../interfaces';

export function hello(req: IGetUserAuthInfoRequest, res) {
  // res.json({ message: `Hello, ${req.user.email}!` });
  res.json({ message: `Hello, Checking!` });
}
