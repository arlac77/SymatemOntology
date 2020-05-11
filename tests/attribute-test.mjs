import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("type", async t => {
  const { recordingNamespace, backend, writer, a1, s1 } = await prepareBackend({
    a: 1,
    s: 1
  });

  ///writer.setTriple([s1, a1, 12], true);

  t.truthy(backend.declareType(recordingNamespace, "t1"));
  t.is(
    backend.declareType(recordingNamespace, "t1"),
    backend.declareType(recordingNamespace, "t1")
  );
});
