export function SymatemOntologyMixin(base) {
  return class SymatemOntologyMixin extends base {
    initPredefinedSymbols() {
      super.initPredefinedSymbols();
      this.registerNamespaces({ Query: ["xxx"] });
    }

    declareType(name) {

    }
  };
}
