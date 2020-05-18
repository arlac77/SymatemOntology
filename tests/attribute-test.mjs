import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("type", async t => {
  const { backend, ic, a1, s1 } = await prepareBackend({
    a: 1,
    s: 1
  });

  ///writer.setTriple([s1, a1, 12], true);

  t.truthy(backend.declareType(ic, "t1"));
  t.is(
    backend.declareType(ic, "t1"),
    backend.declareType(ic, "t1")
  );
});

test("link", async t => {
  const { backend, ic, a1, s1 } = await prepareBackend({
    a: 1,
    s: 1
  });

  const { A } = backend.placeholders(ic.tmpNamespace, {"A":"xyz"});

  backend.link(ic, [s1,a1,A]);

  const results = [...backend.query(ic, [s1,a1,A])];

  t.is(results[0][0],s1);
  t.is(results[0][1],a1);
  t.is(backend.getData(results[0][2]),"xyz");
});
