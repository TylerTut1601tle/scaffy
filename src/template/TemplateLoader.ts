import fs from 'fs/promises';
import path from 'path';
import { TemplateModule } from './TemplateModule';

const TEMPLATE_MANIFEST_FILE = 'scaffy.module.json';

export class TemplateLoader {
  private readonly modulesDir: string;

  constructor(modulesDir: string) {
    this.modulesDir = modulesDir;
  }

  async load(moduleId: string): Promise<TemplateModule> {
    const modulePath = path.join(this.modulesDir, moduleId);
    const manifestPath = path.join(modulePath, TEMPLATE_MANIFEST_FILE);

    let raw: string;
    try {
      raw = await fs.readFile(manifestPath, 'utf-8');
    } catch {
      throw new Error(`Module "${moduleId}" not found at ${manifestPath}`);
    }

    const manifest = JSON.parse(raw) as TemplateModule;
    this.validate(manifest, moduleId);
    return manifest;
  }

  async listAvailable(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.modulesDir, { withFileTypes: true });
      return entries
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
    } catch {
      return [];
    }
  }

  private validate(module: TemplateModule, id: string): void {
    if (!module.id) throw new Error(`Module manifest missing "id" field (${id})`);
    if (!module.name) throw new Error(`Module manifest missing "name" field (${id})`);
    if (!Array.isArray(module.files)) throw new Error(`Module manifest missing "files" array (${id})`);
  }
}
