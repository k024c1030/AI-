// Fix: Correctly augment the global NodeJS.ProcessEnv type to avoid redeclaration errors.
// This resolves issues with 'vite/client' types not being found and subsequent variable declaration conflicts.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY?: string;
    }
  }
}

// Adding this export statement turns this file into a module, which is necessary
// for the global augmentation to be applied correctly.
export {};
