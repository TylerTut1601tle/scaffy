import fs from 'fs/promises';
import { TemplateRenderer } from './TemplateRenderer';
import { TemplateModule } from './TemplateModule';

jest.mock('fs/promises');

const mockFs = fs as jest.Mocked<typeof fs>;

const MODULES_DIR = '/fake/modules';

const baseModule: TemplateModule = {
  id: 'typescript-base',
  name: 'TypeScript Base',
  description: 'Basic TS setup',
  version: '1.0.0',
  variables: [{ name: 'projectName', description: 'Project name', required: true }],
  files: [
    { sourcePath: 'package.json.tpl', targetPath: 'package.json', transform: true },
    { sourcePath: 'static.txt', targetPath: 'static.txt', transform: false },
  ],
};

describe('TemplateRenderer', () => {
  let renderer: TemplateRenderer;

  beforeEach(() => {
    renderer = new TemplateRenderer(MODULES_DIR);
    jest.clearAllMocks();
  });

  it('interpolates variables in file content and target path', async () => {
    mockFs.readFile
      .mockResolvedValueOnce('{"name": "{{ projectName }}"}' as never)
      .mockResolvedValueOnce('no interpolation here' as never);

    const resolved = await renderer.render(baseModule, { projectName: 'my-app' });

    expect(resolved.resolvedFiles[0].content).toBe('{"name": "my-app"}');
    expect(resolved.resolvedFiles[1].content).toBe('no interpolation here');
  });

  it('leaves unknown placeholders intact', async () => {
    mockFs.readFile.mockResolvedValueOnce('Hello {{ unknown }}' as never)
      .mockResolvedValueOnce('' as never);

    const resolved = await renderer.render(baseModule, { projectName: 'x' });
    expect(resolved.resolvedFiles[0].content).toBe('Hello {{unknown}}');
  });

  it('skips interpolation when transform is false', async () => {
    mockFs.readFile
      .mockResolvedValueOnce('{{ projectName }}' as never)
      .mockResolvedValueOnce('{{ projectName }}' as never);

    const resolved = await renderer.render(baseModule, { projectName: 'my-app' });
    expect(resolved.resolvedFiles[1].content).toBe('{{ projectName }}');
  });
});
