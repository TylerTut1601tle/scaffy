import { ConfigResolver } from './ConfigResolver';
import { ScaffyConfig } from './ScaffyConfig';

const config: ScaffyConfig = {
  version: '1.0.0',
  outputDir: './output',
  modules: [
    { name: 'base', path: './templates/base', variables: { author: 'Alice' } },
    {
      name: 'react',
      path: './templates/react',
      extends: ['base'],
      variables: { framework: 'React' },
    },
  ],
};

const configDir = '/project';

describe('ConfigResolver', () => {
  let resolver: ConfigResolver;

  beforeEach(() => {
    resolver = new ConfigResolver(config, configDir);
  });

  it('resolves absolute path for a module', () => {
    const resolved = resolver.resolveModule('base');
    expect(resolved.absolutePath).toBe('/project/templates/base');
  });

  it('includes own variables in resolved module', () => {
    const resolved = resolver.resolveModule('base');
    expect(resolved.resolvedVariables).toEqual({ author: 'Alice' });
  });

  it('merges parent variables with own variables', () => {
    const resolved = resolver.resolveModule('react');
    expect(resolved.resolvedVariables).toEqual({
      author: 'Alice',
      framework: 'React',
    });
  });

  it('own variables override parent variables', () => {
    const overrideConfig: ScaffyConfig = {
      ...config,
      modules: [
        { name: 'base', path: './t/base', variables: { color: 'blue' } },
        { name: 'child', path: './t/child', extends: ['base'], variables: { color: 'red' } },
      ],
    };
    const r = new ConfigResolver(overrideConfig, configDir);
    expect(r.resolveModule('child').resolvedVariables.color).toBe('red');
  });

  it('resolves all modules', () => {
    const all = resolver.resolveAllModules();
    expect(all).toHaveLength(2);
  });

  it('throws when module is not found', () => {
    expect(() => resolver.resolveModule('unknown')).toThrow('Module "unknown" not found');
  });

  it('returns absolute output directory', () => {
    expect(resolver.getOutputDir()).toBe('/project/output');
  });
});
