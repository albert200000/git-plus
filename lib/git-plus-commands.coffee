git = require './git'

getCommands = ->
  gitAdd                = require('./models/add').default
  gitAddModified        = require('./models/add-modified').default
  GitCheckoutNewBranch   = require './models/git-checkout-new-branch'
  GitCheckoutBranch      = require './models/git-checkout-branch'
  GitDeleteBranch        = require './models/git-delete-branch'
  gitCheckoutFile        = require('./models/checkout-file').default
  GitCherryPick          = require './models/git-cherry-pick'
  GitCommit              = require './models/git-commit'
  GitCommitAmend         = require './models/git-commit-amend'
  GitDiff                = require './models/git-diff'
  GitDiffBranches        = require './models/git-diff-branches'
  GitDifftool            = require './models/git-difftool'
  GitDiffAll             = require './models/git-diff-all'
  gitFetch               = require('./models/fetch').default
  gitFetchInAllRepos            = require('./models/fetch-in-all-repos').default
  GitInit                = require './models/git-init'
  GitLog                 = require './models/git-log'
  gitPull                = require('./models/pull').default
  gitPush                = require('./models/push').default
  gitReset                = require('./models/reset').default
  GitRemove              = require './models/git-remove'
  GitShow                = require './models/git-show'
  GitStageFiles          = require './models/git-stage-files'
  GitStageHunk           = require './models/git-stage-hunk'
  ManageStashes               = require './models/manage-stashes'
  GitStashApply          = require './models/git-stash-apply'
  GitStashDrop           = require './models/git-stash-drop'
  GitStashPop            = require './models/git-stash-pop'
  GitStashSave           = require './models/git-stash-save'
  GitStashSaveMessage    = require './models/git-stash-save-message'
  GitStatus              = require './models/git-status'
  GitTags                = require './models/git-tags'
  GitRun                 = require './models/git-run'
  GitMerge               = require './models/git-merge'
  GitRebase              = require './models/git-rebase'
  GitOpenChangedFiles    = require './models/git-open-changed-files'

  commands = []

  git.getRepo()
    .then (repo) ->
      currentFile = repo.relativize(atom.workspace.getActiveTextEditor()?.getPath())
      git.refresh repo
      if atom.config.get('pulsar-git-plus.experimental.customCommands')
        commands = commands.concat(require('./service').getCustomCommands())
      commands.push ['pulsar-git-plus:add', 'Add', gitAdd]
      commands.push ['pulsar-git-plus:add-modified', 'Add Modified', gitAddModified]
      commands.push ['pulsar-git-plus:add-all', 'Add All', -> gitAdd(true)]
      commands.push ['pulsar-git-plus:log', 'Log', -> GitLog(repo)]
      commands.push ['pulsar-git-plus:log-current-file', 'Log Current File', -> GitLog(repo, onlyCurrentFile: true)]
      commands.push ['pulsar-git-plus:remove-current-file', 'Remove Current File', -> GitRemove(repo)]
      commands.push ['pulsar-git-plus:checkout-all-files', 'Checkout All Files', -> gitCheckoutFile(true)]
      commands.push ['pulsar-git-plus:checkout-current-file', 'Checkout Current File', -> gitCheckoutFile()]
      commands.push ['pulsar-git-plus:commit', 'Commit', -> GitCommit(repo)]
      commands.push ['pulsar-git-plus:commit-all', 'Commit All', -> GitCommit(repo, stageChanges: true)]
      commands.push ['pulsar-git-plus:commit-amend', 'Commit Amend', -> GitCommitAmend(repo)]
      commands.push ['pulsar-git-plus:add-and-commit', 'Add And Commit', -> git.add(repo, file: currentFile).then -> GitCommit(repo)]
      commands.push ['pulsar-git-plus:add-and-commit-and-push', 'Add And Commit And Push', -> git.add(repo, file: currentFile).then -> GitCommit(repo, andPush: true)]
      commands.push ['pulsar-git-plus:add-all-and-commit', 'Add All And Commit', -> git.add(repo).then -> GitCommit(repo)]
      commands.push ['pulsar-git-plus:add-all-commit-and-push', 'Add All, Commit And Push', -> git.add(repo).then -> GitCommit(repo, andPush: true)]
      commands.push ['pulsar-git-plus:commit-all-and-push', 'Commit All And Push', -> GitCommit(repo, stageChanges: true, andPush: true)]
      commands.push ['pulsar-git-plus:checkout', 'Checkout', -> GitCheckoutBranch(repo)]
      commands.push ['pulsar-git-plus:checkout-remote', 'Checkout Remote', -> GitCheckoutBranch(repo, {remote: true})]
      commands.push ['pulsar-git-plus:new-branch', 'Checkout New Branch', -> GitCheckoutNewBranch(repo)]
      commands.push ['pulsar-git-plus:delete-local-branch', 'Delete Local Branch', -> GitDeleteBranch(repo)]
      commands.push ['pulsar-git-plus:delete-remote-branch', 'Delete Remote Branch', -> GitDeleteBranch(repo, {remote: true})]
      commands.push ['pulsar-git-plus:delete-branch-local-and-remote', 'Delete Branch (Local and Remote)', -> GitDeleteBranch(repo).then -> GitDeleteBranch(repo, {remote: true})]
      commands.push ['pulsar-git-plus:cherry-pick', 'Cherry-Pick', -> GitCherryPick(repo)]
      commands.push ['pulsar-git-plus:diff', 'Diff', -> GitDiff(repo, file: currentFile)]
      commands.push ['pulsar-git-plus:diff-branches', 'Diff branches', -> GitDiffBranches(repo)]
      commands.push ['pulsar-git-plus:difftool', 'Difftool', -> GitDifftool(repo)]
      commands.push ['pulsar-git-plus:diff-all', 'Diff All', -> GitDiffAll(repo)]
      commands.push ['pulsar-git-plus:fetch', 'Fetch', gitFetch]
      commands.push ['pulsar-git-plus:fetch-all', 'Fetch All (Repos & Remotes)', gitFetchInAllRepos]
      commands.push ['pulsar-git-plus:fetch-prune', 'Fetch Prune', -> gitFetch({prune: true})]
      commands.push ['pulsar-git-plus:pull', 'Pull', gitPull]
      commands.push ['pulsar-git-plus:push', 'Push', gitPush]
      commands.push ['pulsar-git-plus:push-set-upstream', 'Push -u', -> gitPush(true)]
      commands.push ['pulsar-git-plus:remove', 'Remove', -> GitRemove(repo, showSelector: true)]
      commands.push ['pulsar-git-plus:reset', 'Reset HEAD', gitReset]
      commands.push ['pulsar-git-plus:show', 'Show', -> GitShow(repo)]
      commands.push ['pulsar-git-plus:stage-files', 'Stage Files', -> GitStageFiles(repo)]
      commands.push ['pulsar-git-plus:stage-hunk', 'Stage Hunk', -> GitStageHunk(repo)]
      commands.push ['pulsar-git-plus:manage-stashes', 'Manage Stashes', ManageStashes.default]
      commands.push ['pulsar-git-plus:stash-save', 'Stash: Save Changes', -> GitStashSave(repo)]
      commands.push ['pulsar-git-plus:stash-save-message', 'Stash: Save Changes With Message', -> GitStashSaveMessage(repo)]
      commands.push ['pulsar-git-plus:stash-pop', 'Stash: Apply (Pop)', -> GitStashPop(repo)]
      commands.push ['pulsar-git-plus:stash-apply', 'Stash: Apply (Keep)', -> GitStashApply(repo)]
      commands.push ['pulsar-git-plus:stash-delete', 'Stash: Delete (Drop)', -> GitStashDrop(repo)]
      commands.push ['pulsar-git-plus:status', 'Status', -> GitStatus(repo)]
      commands.push ['pulsar-git-plus:tags', 'Tags', -> GitTags(repo)]
      commands.push ['pulsar-git-plus:run', 'Run', -> new GitRun(repo)]
      commands.push ['pulsar-git-plus:merge', 'Merge', -> GitMerge(repo)]
      commands.push ['pulsar-git-plus:merge-remote', 'Merge Remote', -> GitMerge(repo, remote: true)]
      commands.push ['pulsar-git-plus:merge-no-fast-forward', 'Merge without fast-forward', -> GitMerge(repo, noFastForward: true)]
      commands.push ['pulsar-git-plus:rebase', 'Rebase', -> GitRebase(repo)]
      commands.push ['pulsar-git-plus:git-open-changed-files', 'Open Changed Files', -> GitOpenChangedFiles(repo)]

      return commands

module.exports = getCommands
