import {
  RustWasmBackend
} from "SymatemJS";

import { SymatemQueryMixin } from "@symatem/query";
import { SymatemOntologyMixin } from "@symatem/ontology";

export async function prepareBackend(options = {}) {
  const BackendClass = SymatemOntologyMixin(SymatemQueryMixin(RustWasmBackend));
  const backend = await new BackendClass();

  const ic = backend.createContect();

  const symbols = {};

  Object.entries(options).forEach(([name, number]) => {
    for (let n = 1; n <= number; n++) {
      let key = `${name}${n}`;
      symbols[key] = ic.writer.createSymbol(ic.recordingNamespace);
    }
  });

  return {
    ...symbols,
    backend,
    ic
  };
}
