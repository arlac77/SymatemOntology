import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("link single symbol with data", async t => {
  const { backend, ic, s1, s2 } = await prepareBackend({
    s: 2
  });

  const { A } = backend.placeholders(ic.tmpNamespace, { A: "xyz" });

  const result = backend.link(ic, [[s1, s2, A]]);

  t.is(result[0], s1);
  t.is(result[1], s2);
  t.is(backend.getData(result[2]), "xyz");
});

test("link two symbols one data", async t => {
  const { backend, ic, s1 } = await prepareBackend({
    s: 1
  });

  const { A, B } = backend.placeholders(ic.tmpNamespace, { A: "xyz", B: undefined });

  const result = backend.link(ic, [[s1, A, B]]);

  t.is(result[0], s1);
  t.is(backend.getData(result[1]), "xyz");
});


