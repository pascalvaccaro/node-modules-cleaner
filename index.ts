import { stat, readdir, remove, pathExists } from 'fs-extra';
import { join, dirname } from 'path';
import readline from 'readline';

const [,, BASE_DIRECTORY, days] = process.argv;
const MAX_AGE = Number(days) * 24 * 60 * 60 * 1000;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


async function* packageGenerator(expiration: number, base = BASE_DIRECTORY): AsyncIterableIterator<string> {
  for (const item of (await readdir(base))) {
    // Don't bother with hidden files and node_modules directories
    if (item.startsWith('.') || item.indexOf('node_modules') >= 0) continue;

    const fullPath = join(base, item);
    const statItem = await stat(fullPath);
    // Only yields expired package.json
    if (/package\.json/.test(item) && statItem.mtime.getTime() < expiration) {
      const npmDir = dirname(fullPath);
      const node_modules = join(npmDir, "node_modules");
      if (await pathExists(node_modules)) {
        process.stdin.write(`Delete node_modules from ${npmDir.replace(BASE_DIRECTORY + "/", "")}? (Y/n) `);
        yield node_modules;
      }
    } else if (statItem.isDirectory()) {
      yield * packageGenerator(expiration, fullPath);
    }
  }
}

(async () => {
  try {
    const expiration = new Date().getTime() - MAX_AGE;
    const deletions: Array<Promise<void>> = [];
    
    const packageIterator = packageGenerator(expiration);
    let currentPackage = await packageIterator.next();

    for await (const answer of rl) {
      answer.toLowerCase() !== "n" && deletions.push(remove(currentPackage.value));
      currentPackage = await packageIterator.next();
      currentPackage.done && rl.close();
    }
  
    await Promise.all(deletions);
    console.log(`Deleted ${deletions.length} node_modules folders`);
  } catch (err) {
    console.error(err);
  } finally {
    rl.close();
  }
})();
