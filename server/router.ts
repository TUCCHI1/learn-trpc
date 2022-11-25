import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "TUCCHI1",
  },
];

const appRouter = t.router({
  // この時点では入力は不明
  // クライアントは何でも送ってくる可能性がある
  // なので、特定のデータ型を仮定することはしない
  userById: t.procedure
    .input((val: unknown) => {
      // 値がstringであれば、その値を返す
      // この値が文字列であることをTypeScriptは認識する
      if (typeof val === "string") return val;

      // 入力が文字列でなかった場合
      // プロシージャを実行せず、エラーを投げる
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const { input } = req;

      const user = userList.find((u) => u.id === input);
      return user;
    }),
  userCreate: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = `${Math.random()}`;

      const user: User = {
        id,
        name: req.input.name,
      };

      userList.push(user);

      return user;
    }),
});

export type AppRouter = typeof appRouter;
