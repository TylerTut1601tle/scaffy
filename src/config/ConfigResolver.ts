import path from 'path';
import { ScaffyConfig, TemplateModuleConfig } from './ScaffyConfig';

export interface ResolvedModuleConfig extends TemplateModuleConfig {
  absolutePath: string;
  resolvedVariables: Record<string, string>;
}

export class ConfigResolver {
  constructor(
    private readonly config: ScaffyConfig,
    private readonly configDir: string
  ) {}

  resolveModule(moduleName: string): ResolvedModuleConfig {
    const mod = this.config.modules.find((m) => m.name === moduleName);
    if (!mod) {
      throw new Error(
        `Module "${moduleName}" not found in config. Available: ${this.config.modules
          .map((m) => m.name)
          .join(', ')}`
      );
    }
    return this.resolveModuleConfig(mod);
  }

  resolveAllModules(): ResolvedModuleConfig[] {
    return this.config.modules.map((mod) => this.resolveModuleConfig(mod));
  }

  private resolveModuleConfig(mod: TemplateModuleConfig): ResolvedModuleConfig {
    const absolutePath = path.resolve(this.configDir, mod.path);
    const parentVariables = this.resolveParentVariables(mod.extends ?? []);
    const resolvedVariables = { ...parentVariables, ...(mod.variables ?? {}) };

    return { ...mod, absolutePath, resolvedVariables };
  }

  private resolveParentVariables(
    parentNames: string[]
  ): Record<string, string> {
    return parentNames.reduce<Record<string, string>>((acc, name) => {
      const parent = this.resolveModule(name);
      return { ...acc, ...parent.resolvedVariables };
    }, {});
  }

  getOutputDir(): string {
    return path.resolve(this.configDir, this.config.outputDir);
  }
}
