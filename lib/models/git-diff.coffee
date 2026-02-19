git = require '../git'
notifier = require '../notifier'

module.exports = (repo, {diffStat, file}={}) ->
  file ?= repo.relativize(atom.workspace.getActiveTextEditor()?.getPath())

  if not file
    return notifier.addError "No open file. Select 'Diff All'."

  stagingStatus = git.getStagingStatus(repo, file)

  atom.workspace.open(
    "atom-github://file-patch/#{encodeURIComponent(file)}?workdir=#{encodeURIComponent(repo.getWorkingDirectory())}&stagingStatus=#{encodeURIComponent(stagingStatus)}"
  )
