// const fileSelector = ".tree-view > .full-menu .file";
const notMultiSelectedSelector = ".tree-view-root:not(.multi-select)";
const multiSelectedSelector = ".tree-view-root.multi-select";
const projectRootSelector = ".header.list-item.project-root-header"; // unfortunately, there's no indicator on the .list-item of whether it's a git repo
const modifiedFileSelector = ".entry.file.status-modified";
const modifiedDirectorySelector = ".entry.directory.status-modified > .list-item";

export function initializeContextMenu() {
  atom.contextMenu.add({
    // modified files and directories
    [`${notMultiSelectedSelector} ${modifiedFileSelector}, ${notMultiSelectedSelector} ${modifiedDirectorySelector}`]: [
      { type: "separator" },
      {
        label: "Git",
        submenu: [
          { label: "Add", command: "pulsar-git-plus-context:add" },
          { label: "Add + Commit", command: "pulsar-git-plus-context:add-and-commit" },
          { label: "Checkout", command: "pulsar-git-plus-context:checkout-file" },
          { label: "Difftool", command: "pulsar-git-plus-context:difftool" },
          {
            label: "Unstage",
            command: "pulsar-git-plus-context:unstage-file"
          }
        ]
      },
      { type: "separator" }
    ],
    // modified files
    [`${notMultiSelectedSelector} ${modifiedFileSelector}`]: [
      { type: "separator" },
      {
        label: "Git",
        submenu: [{ label: "Diff", command: "pulsar-git-plus-context:diff" }]
      },
      { type: "separator" }
    ],
    [`${multiSelectedSelector} ${modifiedFileSelector}`]: [
      { type: "separator" },
      {
        label: "Git",
        submenu: [
          { label: "Add", command: "pulsar-git-plus-context:add" },
          {
            label: "Unstage",
            command: "pulsar-git-plus-context:unstage-file"
          }
        ]
      },
      { type: "separator" }
    ],
    // all files and directories
    // root directory
    [`${notMultiSelectedSelector} ${projectRootSelector}`]: [
      { type: "separator" },
      {
        label: "Git",
        submenu: [
          { label: "Diff", command: "pulsar-git-plus-context:diff-all" },
          {
            label: "Diff Branches",
            command: "pulsar-git-plus-context:diff-branches"
          }
        ]
      },
      { type: "separator" }
    ],
    [`${multiSelectedSelector} ${projectRootSelector}, ${notMultiSelectedSelector} ${projectRootSelector}`]: [
      { type: "separator" },
      {
        label: "Git",
        submenu: [
          { label: "Add", command: "pulsar-git-plus-context:add" },
          { label: "Pull", command: "pulsar-git-plus-context:pull" },
          { label: "Push", command: "pulsar-git-plus-context:push" }
        ]
      },
      { type: "separator" }
    ]
  });
}
