import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("simple link", async t => {
  const { backend, ic, a1, s1 } = await prepareBackend({
    a: 1,
    s: 1
  });

  const { A } = backend.placeholders(ic.tmpNamespace, { A: "xyz" });

  const results = [...backend.link(ic, [[s1, a1, A]])];

  t.is(results[0][0], s1);
  t.is(results[0][1], a1);
  t.is(backend.getData(results[0][2]), "xyz");
});
