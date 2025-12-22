// src/components/editor/MonacoSetup.ts
import * as monaco from "monaco-editor";

import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution";

export function setupMonaco() {
  return monaco;
}
