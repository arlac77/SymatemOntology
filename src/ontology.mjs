import { SymbolInternals, RelocationTable, Diff } from "SymatemJS";

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

      for (const result of this.query([
        [A, this.symbolByName.isa, this.symbolByName.Type]
      ])) {
        return result.get("A");
      }

      const s = this.createSymbol(ic.recordingNamespace);
      this.setData(s, name);
      this.setTriple([s, this.symbolByName.isa, this.symbolByName.Type], true);
      return s;
    }

    /**
     * Creates a triples with associated data.
     * But only if there are no such triples already
     */
    registerTriples(ic, triples) {

      for (const result of this.query(triples)) {
        return;
      }


      if (s === undefined) {
        s = this.createSymbol(ns);
        this.setData(s, data);
        this.setTriple([s, attribute, value], true);
      }

      return s;
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
