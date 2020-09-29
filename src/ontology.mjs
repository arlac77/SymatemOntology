import { SymbolInternals, RelocationTable, Diff } from "@symatem/core";

export function SymatemOntologyMixin(base) {
  return class SymatemOntologyMixin extends base {
    initPredefinedSymbols() {
      super.initPredefinedSymbols();
      this.registerNamespaces({ Query: ["has", "isa"] });
    }

    createContect() {
      return new InitializationContext(this);
    }

    removeContext() {}

    declareType(ic, name) {
      const { A } = this.placeholders(ic.tmpNamespace, { A: name });
      const result = this.link(
        [[A, this.symbolByName.isa, this.symbolByName.Type]],
        ic.recordingNamespace
      );
      return result[0][0];
    }
  };
}

class InitializationContext {
  constructor(backend) {
    const repositoryNamespace = SymbolInternals.identityOfSymbol(
      backend.createSymbol(backend.metaNamespaceIdentity)
    );
    const modalNamespace = SymbolInternals.identityOfSymbol(
      backend.createSymbol(backend.metaNamespaceIdentity)
    );
    const recordingNamespace = SymbolInternals.identityOfSymbol(
      backend.createSymbol(backend.metaNamespaceIdentity)
    );

    const rt = RelocationTable.create();
    RelocationTable.set(rt, recordingNamespace, modalNamespace);

    const writer = new Diff(backend, repositoryNamespace, rt);

    Object.defineProperties(this, {
      backend: { value: backend },
      writer: { value: writer },
      repositoryNamespace: { value: repositoryNamespace },
      modalNamespace: { value: modalNamespace },
      recordingNamespace: { value: recordingNamespace },
      tmpNamespace: { value: recordingNamespace } // ??
    });
  }
}
