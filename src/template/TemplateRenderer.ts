import fs from 'fs/promises';
import path from 'path';
import { ResolvedModule, TemplateModule, TemplateFile, ResolvedFile } from './TemplateModule';

type Variables = Record<string, string>;

export class TemplateRenderer {
  private readonly modulesDir: string;

  constructor(modulesDir: string) {
    this.modulesDir = modulesDir;
  }

  async render(module: TemplateModule, variables: Variables): Promise<ResolvedModule> {
    const resolvedFiles = await Promise.all(
      module.files.map((file) => this.renderFile(module.id, file, variables))
    );

    return { ...module, resolvedFiles };
  }

  private async renderFile(
    moduleId: string,
    file: TemplateFile,
    variables: Variables
  ): Promise<ResolvedFile> {
    const sourcePath = path.join(this.modulesDir, moduleId, file.sourcePath);
    const rawContent = await fs.readFile(sourcePath, 'utf-8');

    const content = file.transform !== false
      ? this.interpolate(rawContent, variables)
      : rawContent;

    const targetPath = this.interpolate(file.targetPath, variables);

    return { targetPath, content };
  }

  private interpolate(template: string, variables: Variables): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      if (key in variables) return variables[key];
      return `{{${key}}}`;
    });
  }
}
