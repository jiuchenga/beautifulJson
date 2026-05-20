// src/lib/json-utils.ts

/**
 * Format / beautify JSON string with configurable indent
 */
export function formatJSON(input: string, indent: string | number = 2, sortKeys: boolean = false): string {
  const parsed = JSON.parse(input);
  if (sortKeys) {
    return JSON.stringify(sortObjectKeys(parsed), null, indent);
  }
  return JSON.stringify(parsed, null, indent);
}

/**
 * Minify JSON (remove all whitespace)
 */
export function minifyJSON(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

/**
 * Validate JSON and return error with position info
 */
export function validateJSON(input: string): { valid: boolean; error?: string; position?: number } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = (e as Error).message;
    const posMatch = message.match(/position\s+(\d+)/);
    return {
      valid: false,
      error: message,
      position: posMatch ? parseInt(posMatch[1]) : undefined,
    };
  }
}

/**
 * Escape JSON string for embedding in other contexts
 */
export function escapeJSON(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Unescape a JSON string
 */
export function unescapeJSON(input: string): string {
  return input
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"');
}

/**
 * Sort object keys recursively
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  return Object.keys(obj as Record<string, unknown>)
    .sort()
    .reduce((result: Record<string, unknown>, key) => {
      result[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      return result;
    }, {});
}

/**
 * Compare two JSON strings and return differences
 */
export interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'changed';
  left?: unknown;
  right?: unknown;
}

export function compareJSON(left: string, right: string): DiffResult[] {
  const lObj = JSON.parse(left);
  const rObj = JSON.parse(right);
  const diffs: DiffResult[] = [];
  findDiffs(lObj, rObj, '', diffs);
  return diffs;
}

function findDiffs(left: unknown, right: unknown, path: string, diffs: DiffResult[]): void {
  if (left === right) return;
  if (left === null || right === null || typeof left !== typeof right) {
    diffs.push({ path: path || '$', type: 'changed', left, right });
    return;
  }
  if (typeof left !== 'object') {
    if (left !== right) {
      diffs.push({ path: path || '$', type: 'changed', left, right });
    }
    return;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= right.length) {
        diffs.push({ path: `${path}[${i}]`, type: 'removed', left: left[i] });
      } else if (i >= left.length) {
        diffs.push({ path: `${path}[${i}]`, type: 'added', right: right[i] });
      } else {
        findDiffs(left[i], right[i], `${path}[${i}]`, diffs);
      }
    }
    return;
  }
  const lKeys = new Set(Object.keys(left as object));
  const rKeys = new Set(Object.keys(right as object));
  for (const key of rKeys) {
    if (!lKeys.has(key)) {
      diffs.push({
        path: path ? `${path}.${key}` : key,
        type: 'added',
        right: (right as Record<string, unknown>)[key],
      });
    }
  }
  for (const key of lKeys) {
    if (!rKeys.has(key)) {
      diffs.push({
        path: path ? `${path}.${key}` : key,
        type: 'removed',
        left: (left as Record<string, unknown>)[key],
      });
    } else {
      findDiffs(
        (left as Record<string, unknown>)[key],
        (right as Record<string, unknown>)[key],
        path ? `${path}.${key}` : key,
        diffs
      );
    }
  }
}

/**
 * JSON to XML conversion
 */
export function jsonToXML(input: string, rootName: string = 'root'): string {
  const obj = JSON.parse(input);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${objToXML(obj, rootName)}`;
}

function sanitizeTagName(name: string): string {
  let safe = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (/^[0-9]/.test(safe)) safe = '_' + safe;
  return safe || 'item';
}

function objToXML(obj: unknown, tagName: string): string {
  const tag = sanitizeTagName(tagName);
  if (obj === null || obj === undefined) return `<${tag}/>`;
  if (typeof obj !== 'object') return `<${tag}>${escapeXML(String(obj))}</${tag}>`;
  if (Array.isArray(obj)) {
    return obj.map((item) => objToXML(item, 'item')).join('\n');
  }
  const inner = Object.entries(obj as Record<string, unknown>)
    .map(([key, val]) => objToXML(val, key))
    .join('\n  ');
  return `<${tag}>\n  ${inner}\n</${tag}>`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * XML to JSON conversion (basic parser)
 */
export function xmlToJSON(xml: string): string {
  const result = parseXMLNode(xml);
  return JSON.stringify(result, null, 2);
}

function parseXMLNode(xml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const tagRegex = /<(\w+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>|<(\w+)(?:\s[^>]*)?\/>/g;
  let match;
  while ((match = tagRegex.exec(xml)) !== null) {
    const tag = match[1] || match[3];
    const content = match[2] || '';
    const value = content.includes('<')
      ? parseXMLNode(content)
      : content.trim() || null;
    if (result[tag] !== undefined) {
      if (!Array.isArray(result[tag])) {
        result[tag] = [result[tag]];
      }
      (result[tag] as unknown[]).push(value);
    } else {
      result[tag] = value;
    }
  }
  return result;
}

/**
 * JSON to Java Entity (POJO) class generator
 */
export function jsonToJavaEntity(input: string, className: string = 'Root'): string {
  const obj = JSON.parse(input);
  return generateJavaClass(obj, className);
}

function generateJavaClass(obj: unknown, className: string): string {
  const fields: string[] = [];
  const innerClasses: string[] = [];

  if (typeof obj !== 'object' || obj === null) return '';

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fieldName = key.replace(/[^a-zA-Z0-9]/g, '_');
    const { type, innerClass } = javaType(value, capitalize(fieldName));
    if (innerClass) innerClasses.push(innerClass);
    fields.push(`    private ${type} ${fieldName};`);
  }

  let result = `public class ${className} {\n${fields.join('\n')}\n`;
  for (const field of Object.keys(obj as Record<string, unknown>)) {
    const fieldName = field.replace(/[^a-zA-Z0-9]/g, '_');
    const { type } = javaType((obj as Record<string, unknown>)[field], capitalize(fieldName));
    result += generateGetterSetter(fieldName, type);
  }
  for (const ic of innerClasses) {
    result += `\n${ic}\n`;
  }
  result += '}';
  return result;
}

function javaType(value: unknown, name: string): { type: string; innerClass?: string } {
  if (value === null) return { type: 'Object' };
  if (typeof value === 'boolean') return { type: 'Boolean' };
  if (typeof value === 'number') return Number.isInteger(value) ? { type: 'Integer' } : { type: 'Double' };
  if (typeof value === 'string') return { type: 'String' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'List<Object>' };
    const { type, innerClass } = javaType(value[0], name);
    return { type: `List<${type}>`, innerClass };
  }
  if (typeof value === 'object') {
    const innerClass = generateJavaClass(value, name);
    return { type: name, innerClass };
  }
  return { type: 'Object' };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateGetterSetter(field: string, type: string): string {
  const cap = capitalize(field);
  return `\n    public ${type} get${cap}() { return ${field}; }\n    public void set${cap}(${type} ${field}) { this.${field} = ${field}; }\n`;
}

/**
 * JSON to C# class generator
 */
export function jsonToCSharp(input: string, className: string = 'Root'): string {
  const obj = JSON.parse(input);
  return generateCSharpClass(obj, className);
}

function generateCSharpClass(obj: unknown, className: string): string {
  if (typeof obj !== 'object' || obj === null) return '';

  const properties: string[] = [];
  const innerClasses: string[] = [];

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const propName = capitalize(key.replace(/[^a-zA-Z0-9]/g, '_'));
    const { type, innerClass } = csharpType(value, propName);
    if (innerClass) innerClasses.push(innerClass);
    properties.push(`    [JsonProperty("${key}")]\n    public ${type} ${propName} { get; set; }`);
  }

  let result = `using Newtonsoft.Json;\n\npublic class ${className}\n{\n${properties.join('\n\n')}\n`;
  for (const ic of innerClasses) {
    result += `\n${ic}\n`;
  }
  result += '}';
  return result;
}

function csharpType(value: unknown, name: string): { type: string; innerClass?: string } {
  if (value === null) return { type: 'object' };
  if (typeof value === 'boolean') return { type: 'bool' };
  if (typeof value === 'number') return Number.isInteger(value) ? { type: 'int' } : { type: 'double' };
  if (typeof value === 'string') return { type: 'string' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'List<object>' };
    const { type, innerClass } = csharpType(value[0], name);
    return { type: `List<${type}>`, innerClass };
  }
  if (typeof value === 'object') {
    const innerClass = generateCSharpClass(value, name);
    return { type: name, innerClass };
  }
  return { type: 'object' };
}

/**
 * JSON to Go struct generator
 */
export function jsonToGoStruct(input: string, structName: string = 'AutoGenerated'): string {
  const obj = JSON.parse(input);
  return generateGoStruct(obj, structName);
}

function generateGoStruct(obj: unknown, structName: string): string {
  if (typeof obj !== 'object' || obj === null) return '';

  const fields: string[] = [];
  const innerStructs: string[] = [];

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fieldName = key.replace(/[^a-zA-Z0-9]/g, '').replace(/^[0-9]/, '_$&');
    const exportedName = capitalize(fieldName);
    const { type, innerStruct } = goType(value, exportedName);
    if (innerStruct) innerStructs.push(innerStruct);
    fields.push(`\t${exportedName} ${type} \`json:"${key}"\``);
  }

  let result = `type ${structName} struct {\n${fields.join('\n')}\n}`;
  for (const is of innerStructs) {
    result += `\n\n${is}`;
  }
  return result;
}

function goType(value: unknown, name: string): { type: string; innerStruct?: string } {
  if (value === null) return { type: 'interface{}' };
  if (typeof value === 'boolean') return { type: 'bool' };
  if (typeof value === 'number') return Number.isInteger(value) ? { type: 'int' } : { type: 'float64' };
  if (typeof value === 'string') return { type: 'string' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: '[]interface{}' };
    const { type, innerStruct } = goType(value[0], name);
    return { type: `[]${type}`, innerStruct };
  }
  if (typeof value === 'object') {
    const innerStruct = generateGoStruct(value, name);
    return { type: `*${name}`, innerStruct };
  }
  return { type: 'interface{}' };
}

/**
 * Get JSON data types summary
 */
export function analyzeJSONTypes(input: string, showIndex: boolean = true): string {
  const parsed = JSON.parse(input);
  const analysis = describeTypes(parsed, 0, showIndex);
  return analysis;
}

function describeTypes(value: unknown, depth: number, showIndex: boolean): string {
  const indent = '  '.repeat(depth);
  if (value === null) return `${indent}null`;
  if (typeof value === 'boolean') return `${indent}boolean`;
  if (typeof value === 'number') return `${indent}number`;
  if (typeof value === 'string') return `${indent}string (length: ${(value as string).length})`;
  if (Array.isArray(value)) {
    let result = `${indent}array[${value.length}]\n`;
    const limit = Math.min(value.length, 5);
    for (let i = 0; i < limit; i++) {
      const prefix = showIndex ? `[${i}]: ` : '- ';
      result += `${indent}  ${prefix}${describeTypes(value[i], depth + 2, showIndex)}\n`;
    }
    if (value.length > 5) result += `${indent}  ... and ${value.length - 5} more items\n`;
    return result;
  }
  if (typeof value === 'object') {
    let result = `${indent}object\n`;
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result += `${indent}  "${key}": ${describeTypes(val, depth + 2, showIndex)}\n`;
    }
    return result;
  }
  return `${indent}unknown`;
}
