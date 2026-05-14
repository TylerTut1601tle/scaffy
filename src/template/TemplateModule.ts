export interface TemplateVariable {
  name: string;
  description: string;
  default?: string;
  required?: boolean;
}

export interface TemplateModule {
  id: string;
  name: string;
  description: string;
  version: string;
  variables: TemplateVariable[];
  files: TemplateFile[];
  dependencies?: string[];
}

export interface TemplateFile {
  sourcePath: string;
  targetPath: string;
  transform?: boolean;
}

export interface ResolvedModule extends TemplateModule {
  resolvedFiles: ResolvedFile[];
}

export interface ResolvedFile {
  targetPath: string;
  content: string;
}
