import { readFileSync, existsSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import { config as loadDotenv } from 'dotenv';
import { ConfigSchema, Config } from './schema.js';

loadDotenv({ path: '.env.local', quiet: true });
loadDotenv({ path: '.env', quiet: true });

function interpolateEnvVars(value: string): string {
  return value.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || '');
}

function interpolateObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return interpolateEnvVars(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(interpolateObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = interpolateObject(value);
    }
    return result;
  }
  return obj;
}

export function loadConfig(configPath?: string): Config {
  const paths = configPath 
    ? [configPath]
    : ['./config.yaml', './config.yml', './config/config.yaml', './config/config.yml'];

  let configFile: string | undefined;
  for (const path of paths) {
    if (existsSync(path)) {
      configFile = path;
      break;
    }
  }

  if (!configFile) {
    throw new Error(`Config file not found. Searched: ${paths.join(', ')}`);
  }

  const raw = readFileSync(configFile, 'utf-8');
  const parsed = parseYaml(raw);
  const interpolated = interpolateObject(parsed);
  
  return ConfigSchema.parse(interpolated);
}
