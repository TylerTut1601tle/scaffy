export interface TemplateModuleConfig {
  name: string;
  path: string;
  variables?: Record<string, string>;
  extends?: string[];
}

export interface ScaffyConfig {
  version: string;
  outputDir: string;
  modules: TemplateModuleConfig[];
}

export const DEFAULT_CONFIG: Partial<ScaffyConfig> = {
  version: '1.0.0',
  outputDir: './output',
  modules: [],
};

export function validateConfig(config: unknown): config is ScaffyConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be a non-null object');
  }

  const c = config as Record<string, unknown>;

  if (typeof c.version !== 'string') {
    throw new Error('Config must have a string "version" field');
  }

  if (typeof c.outputDir !== 'string') {
    throw new Error('Config must have a string "outputDir" field');
  }

  if (!Array.isArray(c.modules)) {
    throw new Error('Config must have an array "modules" field');
  }

  for (const mod of c.modules) {
    if (typeof mod.name !== 'string' || typeof mod.path !== 'string') {
      throw new Error('Each module must have "name" and "path" string fields');
    }
  }

  return true;
}
