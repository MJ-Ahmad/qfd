// scripts/prepare-docs.js
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dest = path.join(destDir, e.name);
    if (e.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  }
}

// remove docs
const rimraf = (d) => {
  if (!fs.existsSync(d)) return;
  fs.rmSync(d, { recursive: true, force: true });
};

const root = process.cwd();
const docs = path.join(root, 'docs');
rimraf(docs);
ensureDir(docs);

copyDir(path.join(root, 'src', 'pages'), docs);
ensureDir(path.join(docs, 'css'));
copyDir(path.join(root, 'src', 'css'), path.join(docs, 'css'));
ensureDir(path.join(docs, 'js'));
copyDir(path.join(root, 'src', 'js'), path.join(docs, 'js'));
copyDir(path.join(root, 'public'), docs);

console.log('docs prepared');
