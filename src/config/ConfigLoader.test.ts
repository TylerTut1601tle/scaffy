import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigLoader } from './ConfigLoader';
import { ScaffyConfig } from './ScaffyConfig';

const validConfig: ScaffyConfig = {
  version: '1.0.0',
  outputDir: './out',
  modules: [{ name: 'base', path: './templates/base' }],
};

function writeTempConfig(dir: string, filename: string, content: unknown): string {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(content), 'utf-8');
  return filePath;
}

describe('ConfigLoader', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffy-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('loads a valid config from an explicit path', () => {
    const filePath = writeTempConfig(tmpDir, 'scaffy.config.json', validConfig);
    const loader = new ConfigLoader(tmpDir);
    const config = loader.load(filePath);
    expect(config.version).toBe('1.0.0');
    expect(config.modules).toHaveLength(1);
  });

  it('auto-discovers scaffy.config.json in cwd', () => {
    writeTempConfig(tmpDir, 'scaffy.config.json', validConfig);
    const loader = new ConfigLoader(tmpDir);
    const config = loader.load();
    expect(config.outputDir).toBe('./out');
  });

  it('throws if no config file is found', () => {
    const loader = new ConfigLoader(tmpDir);
    expect(() => loader.load()).toThrow('No config file found');
  });

  it('throws on invalid JSON', () => {
    const filePath = path.join(tmpDir, 'scaffy.config.json');
    fs.writeFileSync(filePath, '{ invalid json }');
    const loader = new ConfigLoader(tmpDir);
    expect(() => loader.load()).toThrow('Failed to parse config file');
  });

  it('throws when module is missing required fields', () => {
    const bad = { ...validConfig, modules: [{ name: 'x' }] };
    const filePath = writeTempConfig(tmpDir, 'scaffy.config.json', bad);
    const loader = new ConfigLoader(tmpDir);
    expect(() => loader.load(filePath)).toThrow('"name" and "path"');
  });
});
