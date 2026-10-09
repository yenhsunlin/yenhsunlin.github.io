'use strict';

const fs = require('node:fs');
const path = require('node:path');

const project = path.resolve(__dirname, '..');
const repository = path.resolve(project, '..');
const output = path.join(project, 'public');
const dryRun = process.argv.includes('--dry-run');
// Only these website paths may be updated. Add a new page here when needed.
const publishedPaths = new Set([
  'index.html', 'Advisees', 'Awards', 'Publications', 'Resume', 'Talks',
  'attaches', 'css', 'img', 'js', 'fancybox'
]);

function collectFiles(directory, relative = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(relative, entry.name);
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) {
      throw new Error(`Refusing hidden files or symbolic links: ${name}`);
    }
    if (entry.isDirectory()) return collectFiles(path.join(directory, entry.name), name);
    if (!entry.isFile()) throw new Error(`Not a regular file: ${name}`);
    return [name];
  });
}

if (path.basename(project) !== '_hexo' || !fs.existsSync(path.join(output, 'index.html'))) {
  throw new Error('Run this script from the integrated _hexo project after a successful build.');
}

const files = collectFiles(output);
// Validate every destination before writing any files. Never follow destination links.
for (const name of files) {
  if (!publishedPaths.has(name.split(path.sep)[0])) {
    throw new Error(`Unapproved website path: ${name}. Update publishedPaths for new pages.`);
  }
  let destination = repository;
  const parts = name.split(path.sep);
  for (const [index, part] of parts.entries()) {
    destination = path.join(destination, part);
    const stat = fs.lstatSync(destination, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error(`Unsafe destination: ${destination}`);
    }
  }
}

let changed = 0;
for (const name of files) {
  const source = path.join(output, name);
  const destination = path.join(repository, name);
  if (fs.existsSync(destination) && fs.readFileSync(source).equals(fs.readFileSync(destination))) continue;
  changed++;
  console.log(`${dryRun ? 'Would update' : 'Updating'} ${name}`);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}
console.log(`${dryRun ? 'Checked' : 'Exported'} ${files.length} files; ${changed} ${dryRun ? 'would change' : 'changed'}. No files deleted. No Git operations performed.`);
