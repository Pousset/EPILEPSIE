import { deleteE2eUsers } from "./db";

export default async function globalTeardown() {
  await deleteE2eUsers();
}