{CompositeDisposable} = require 'atom'
{TextEditorView, View} = require 'atom-space-pen-views'

isEmpty = (string) -> string is ''

showObject = (repo, objectHash, file) ->
  objectHash = if isEmpty objectHash then 'HEAD' else objectHash

  # TODO: file only changes
  atom.workspace.open(
    "atom-github://commit-detail?workdir=#{encodeURIComponent(repo.getWorkingDirectory())}&sha=#{encodeURIComponent(objectHash)}"
  )

class InputView extends View
  @content: ->
    @div =>
      @subview 'objectHash', new TextEditorView(mini: true, placeholderText: 'Commit hash to show. (Defaults to HEAD)')

  initialize: (@repo) ->
    @disposables = new CompositeDisposable
    @currentPane = atom.workspace.getActivePane()
    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()
    @objectHash.focus()
    @disposables.add atom.commands.add 'atom-text-editor', 'core:cancel': => @destroy()
    @disposables.add atom.commands.add 'atom-text-editor', 'core:confirm': =>
      text = @objectHash.getModel().getText().split(' ')[0]
      showObject(@repo, text)
      @destroy()

  destroy: ->
    @disposables?.dispose()
    @panel?.destroy()

module.exports = (repo, objectHash, file) ->
  if not objectHash?
    new InputView(repo)
  else
    showObject(repo, objectHash, file)
