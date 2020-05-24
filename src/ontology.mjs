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
      const result = this.link(ic, [
        [A, this.symbolByName.isa, this.symbolByName.Type]
      ]);
      return result[0][0];
    }

    /**
     * Creates triples with associated data.
     * But only if there are no such triples already
     */
    link(ic, queries) {
      if (queries.length === 0) {
        return [];
      }

      const query = queries[0];

      const isPlaceholder = query.map(s => this.isPlaceholder(s));
      const mask = this.queryMasks[
        isPlaceholder.map(f => (f ? "V" : "M")).join("")
      ];

      for (const r of this.queryTriples(mask, query)) {
        return [r, ...this.link(ic, queries.slice(1))];
      }

      const triple = query.map((s, i) => {
        if (isPlaceholder[i]) {
          const data = this.getLiteralData(s);
          s = this.createSymbol(ic.recordingNamespace);
          if (data !== undefined) {
            this.setData(s, data);
          }
        }
        return s;
      });

      this.setTriple(triple, true);

      return [triple, ...this.link(ic, queries.slice(1))];
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
