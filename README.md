# Node Modules Cleaner

> Removes unused / old node_modules located inside a workspace folder

## Installation

```bash
$ npm install -g node-modules-cleaner
```

## Usage

```bash
$ node-modules-cleaner <base_directory> [<number_of_days>]
```

The script prompts for every npm project it finds, asking for deletion or not. Type "n" if you DON'T want to remove the corresponding node_modules folder. Just press enter or "y" if you do want it removed.

### Arguments

- `base_directory`: full absolute path to the target folder where you want to clean unused node_modules. The script will recursively scan all subdirectories
- `number_of_days`: last modification date will be filtered based on this value (default to 0 = all folders will be scanned). 

### Example

```bash
# Removes all node_modules in $HOME/workspace npm projects that were not modified in the last 60 days:
$ node-modules-cleaner ~/workspace 60
```
