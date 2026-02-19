_ = require 'underscore-plus'
path = require 'path'
fs = require 'fs'
git = require '../git'
notifier = require '../notifier'

{CompositeDisposable, BufferedProcess} = require "atom"
{$} = require "atom-space-pen-views"

disposables = new CompositeDisposable
SyncScroll = null

updateNewTextEditor = (newTextEditor, editor, gitRevision, fileContents) ->
  _.delay ->
    lineEnding = editor.buffer?.lineEndingForRow(0) || "\n"
    fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding)
    newTextEditor.buffer.setPreferredLineEnding(lineEnding)
    newTextEditor.setText(fileContents)
    newTextEditor.buffer.cachedDiskContents = fileContents
  , 300

showRevision = (repo, filePath, editor, gitRevision, fileContents, options={}) ->
  gitRevision = path.basename(gitRevision)
  outputFilePath = "#{repo.getPath()}/{#{gitRevision}} #{path.basename(filePath)}"
  outputFilePath += ".diff" if options.diff
  tempContent = "Loading..." + editor.buffer?.lineEndingForRow(0)
  fs.writeFile outputFilePath, tempContent, (error) =>
    if not error
      atom.workspace.open filePath,
        split: "left"
      .then (editor) =>
        atom.workspace.open outputFilePath,
          split: "right"
        .then (newTextEditor) =>
          updateNewTextEditor(newTextEditor, editor, gitRevision, fileContents)
          try
            disposables.add newTextEditor.onDidDestroy -> fs.unlink outputFilePath
          catch error
            return atom.notifications.addError "Could not remove file #{outputFilePath}"

module.exports =
  showRevision: (repo, editor, gitRevision) ->
    options = {diff: false}

    filePath = editor.getPath()
    fileName = path.basename(filePath)

    args = ["show", "#{gitRevision}:./#{fileName}"]
    git.cmd(args, cwd: path.dirname(filePath))
    .then (data) ->
      showRevision(repo, filePath, editor, gitRevision, data, options)
    .catch (code) ->
      atom.notifications.addError("Git Plus: Could not retrieve revision for #{fileName} (#{code})")
