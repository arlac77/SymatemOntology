export function SymatemOntologyMixin(base) {
  return class SymatemOntologyMixin extends base {
    initPredefinedSymbols() {
      super.initPredefinedSymbols();
      this.registerNamespaces({ Query: ["has", "isa"] });
    }

    declareType(ns, name) {
      const { A } = this.placeholders(ns, { A: name });

      for (const result of this.query([
        [A, this.symbolByName.isa, this.symbolByName.Type]
      ])) {
        return result.get("A");
      }

      const s = this.createSymbol(ns);
      this.setData(s, name);
      this.setTriple([s, this.symbolByName.isa, this.symbolByName.Type], true);
      return s;
    }
  };
}
