import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("simple link", async t => {
  const { backend, ic, a1, s1 } = await prepareBackend({
    a: 1,
    s: 1
  });

  const { A } = backend.placeholders(ic.tmpNamespace, { A: "xyz" });

  const result = backend.link(ic, [[s1, a1, A]]);

  t.is(result[0], s1);
  t.is(result[1], a1);
  t.is(backend.getData(result[2]), "xyz");
});
