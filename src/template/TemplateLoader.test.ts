import fs from 'fs/promises';
import path from 'path';
import { TemplateLoader } from './TemplateLoader';

jest.mock('fs/promises');

const mockFs = fs as jest.Mocked<typeof fs>;

const MODULES_DIR = '/fake/modules';
const VALID_MANIFEST = JSON.stringify({
  id: 'typescript-base',
  name: 'TypeScript Base',
  description: 'Basic TS setup',
  version: '1.0.0',
  variables: [],
  files: [{ sourcePath: 'tsconfig.json', targetPath: 'tsconfig.json' }],
});

describe('TemplateLoader', () => {
  let loader: TemplateLoader;

  beforeEach(() => {
    loader = new TemplateLoader(MODULES_DIR);
    jest.clearAllMocks();
  });

  it('loads a valid module manifest', async () => {
    mockFs.readFile.mockResolvedValue(VALID_MANIFEST as never);
    const module = await loader.load('typescript-base');
    expect(module.id).toBe('typescript-base');
    expect(module.files).toHaveLength(1);
  });

  it('throws when module directory does not exist', async () => {
    mockFs.readFile.mockRejectedValue(new Error('ENOENT'));
    await expect(loader.load('missing-module')).rejects.toThrow('not found');
  });

  it('throws when manifest is missing required id field', async () => {
    const bad = JSON.stringify({ name: 'No ID', files: [] });
    mockFs.readFile.mockResolvedValue(bad as never);
    await expect(loader.load('bad-module')).rejects.toThrow('missing "id"');
  });

  it('lists available modules', async () => {
    mockFs.readdir.mockResolvedValue([
      { name: 'typescript-base', isDirectory: () => true },
      { name: 'eslint', isDirectory: () => true },
      { name: 'readme.md', isDirectory: () => false },
    ] as never);
    const modules = await loader.listAvailable();
    expect(modules).toEqual(['typescript-base', 'eslint']);
  });

  it('returns empty array when modules dir is missing', async () => {
    mockFs.readdir.mockRejectedValue(new Error('ENOENT'));
    const modules = await loader.listAvailable();
    expect(modules).toEqual([]);
  });
});
