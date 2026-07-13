import { validateEnvironment } from './environment.config';

describe('validateEnvironment', () => {
  it('uses secure development defaults without a hard-coded JWT secret', () => {
    const config = validateEnvironment({});

    expect(config.NODE_ENV).toBe('development');
    expect(config.JWT_SECRET).toHaveLength(96);
    expect(config.JWT_EXPIRATION).toBe(3600);
    expect(config.ENABLE_DEMO_SEED).toBe(true);
  });

  it('rejects a short JWT secret in production', () => {
    expect(() =>
      validateEnvironment({ NODE_ENV: 'production', JWT_SECRET: 'short-secret' }),
    ).toThrow('JWT_SECRET deve possuir ao menos 32 caracteres em produção.');
  });

  it('rejects invalid ports', () => {
    expect(() => validateEnvironment({ API_PORT: '70000' })).toThrow(
      'API_PORT deve ser uma porta válida entre 1 e 65535.',
    );
  });
});
