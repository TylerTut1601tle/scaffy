import fs from 'fs';
import path from 'path';
import { ScaffyConfig, DEFAULT_CONFIG, validateConfig } from './ScaffyConfig';

const CONFIG_FILE_NAMES = ['scaffy.config.json', '.scaffyrc', '.scaffyrc.json'];

export class ConfigLoader {
  private configPath: string | null = null;

  constructor(private readonly cwd: string = process.cwd()) {}

  resolveConfigPath(explicitPath?: string): string {
    if (explicitPath) {
      const resolved = path.resolve(this.cwd, explicitPath);
      if (!fs.existsSync(resolved)) {
        throw new Error(`Config file not found: ${resolved}`);
      }
      return resolved;
    }

    for (const name of CONFIG_FILE_NAMES) {
      const candidate = path.join(this.cwd, name);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    throw new Error(
      `No config file found. Looked for: ${CONFIG_FILE_NAMES.join(', ')}`
    );
  }

  load(explicitPath?: string): ScaffyConfig {
    this.configPath = this.resolveConfigPath(explicitPath);
    const raw = fs.readFileSync(this.configPath, 'utf-8');
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`Failed to parse config file at ${this.configPath}`);
    }

    const merged = { ...DEFAULT_CONFIG, ...(parsed as object) };
    validateConfig(merged);
    return merged as ScaffyConfig;
  }

  getConfigPath(): string | null {
    return this.configPath;
  }
}
