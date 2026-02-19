var $dp3SY$atom = require("atom");
var $dp3SY$fs = require("fs");
var $dp3SY$path = require("path");
var $dp3SY$os = require("os");
var $dp3SY$atomspacepenviews = require("atom-space-pen-views");
var $dp3SY$atomnotify = require("atom-notify");
var $dp3SY$react = require("react");
var $dp3SY$reactdom = require("react-dom");
var $dp3SY$ansitohtml = require("ansi-to-html");
var $dp3SY$classnames = require("classnames");
var $dp3SY$linkifyurls = require("linkify-urls");
var $dp3SY$fsplus = require("fs-plus");
var $dp3SY$fuzzaldrin = require("fuzzaldrin");
var $dp3SY$nodeemoji = require("node-emoji");
var $dp3SY$underscoreplus = require("underscore-plus");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequirecbd0"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequirecbd0"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("eVTd8", function(module, exports) {

$parcel$export(module.exports, "getRepo", () => $adf137444a9b1dd7$export$971b7948bfdfe11b);
$parcel$export(module.exports, "getRepoForPath", () => $adf137444a9b1dd7$export$1c476441f8d1d38b);
$parcel$export(module.exports, "default", () => $adf137444a9b1dd7$export$2e2bcd8739ae039);




var $fZiky = parcelRequire("fZiky");
const $adf137444a9b1dd7$var$reposByDirectory = new Map();
const $adf137444a9b1dd7$var$getRepoForDirectory = async (directory)=>{
    const repo = await atom.project.repositoryForDirectory(directory);
    if (repo) {
        $adf137444a9b1dd7$var$reposByDirectory.set(directory, repo);
        return repo;
    }
};
const $adf137444a9b1dd7$var$getCachedRepo = (path)=>{
    const iterator = $adf137444a9b1dd7$var$reposByDirectory.entries();
    let entry = iterator.next();
    while(!entry.done){
        const [directory, repo] = entry.value;
        if (directory.contains(path)) {
            if (repo.isDestroyed()) {
                $adf137444a9b1dd7$var$reposByDirectory.delete(directory);
                return undefined;
            } else return repo;
        }
        entry = iterator.next();
    }
};
async function $adf137444a9b1dd7$export$971b7948bfdfe11b() {
    const activeEditor = atom.workspace.getCenter().getActiveTextEditor();
    if (activeEditor) {
        const path = activeEditor.getPath();
        if (path) {
            let repo = $adf137444a9b1dd7$var$getCachedRepo(path);
            if (repo) return repo;
            const directory = new (0, $dp3SY$atom.File)(path).getParent();
            repo = await $adf137444a9b1dd7$var$getRepoForDirectory(directory);
            if (repo) return repo;
        }
    }
    const repos = await Promise.all(atom.project.getDirectories().map($adf137444a9b1dd7$var$getRepoForDirectory)).then((results)=>results.filter(Boolean));
    if (repos.length === 0) return undefined;
    if (repos.length === 1) return repos[0];
    if (repos.length > 1) return (0, $fZiky.default)(repos);
}
const $adf137444a9b1dd7$export$1c476441f8d1d38b = async (path)=>{
    const repo = $adf137444a9b1dd7$var$getCachedRepo(path);
    if (repo) return repo;
    const stat = $dp3SY$fs.statSync(path);
    const directory = new (0, $dp3SY$atom.Directory)(stat.isFile() ? $dp3SY$path.dirname(path) : path);
    return await $adf137444a9b1dd7$var$getRepoForDirectory(directory);
};
const $adf137444a9b1dd7$var$defaultCmdOptions = {
    color: false,
    env: process.env
};
async function $adf137444a9b1dd7$export$2e2bcd8739ae039(args, options = $adf137444a9b1dd7$var$defaultCmdOptions) {
    if (options.color) {
        args = [
            "-c",
            "color.ui=always"
        ].concat(args);
        delete options.color;
    }
    return new Promise((resolve, reject)=>{
        let output = "";
        const gitProcess = new (0, $dp3SY$atom.BufferedProcess)({
            // $FlowFixMe
            command: atom.config.get("pulsar-git-plus.general.gitPath") || "git",
            args: args,
            options: options,
            stdout: (data)=>output += data.toString(),
            stderr: (data)=>output += data.toString(),
            exit: (code)=>{
                resolve({
                    output: output.trim(),
                    failed: code !== 0
                });
            }
        });
        // TODO: clean up the disposable from this subscription
        gitProcess.onWillThrowError((_error)=>{
            atom.notifications.addError("Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.");
            reject(Error("Couldn't find git"));
        });
    });
}

});
parcelRegister("fZiky", function(module, exports) {

$parcel$export(module.exports, "default", () => $ba3ac58dfc20d764$export$2e2bcd8739ae039);

class $ba3ac58dfc20d764$var$RepoListView {
    constructor(repos){
        this.disposables = new (0, $dp3SY$atom.CompositeDisposable)();
        this.isAttached = false;
        this.destroy = ()=>{
            this.disposables.dispose();
        };
        this.emitter = new (0, $dp3SY$atom.Emitter)();
        this.list = new SelectList({
            items: repos.map((repository)=>{
                const path = repository.getWorkingDirectory();
                return {
                    repo: repository,
                    name: path.substring(path.lastIndexOf("/") + 1)
                };
            }),
            filterKeyForItem (item) {
                return item.name;
            },
            infoMessage: "Which Repo?",
            elementForItem (item, _options) {
                const li = document.createElement("li");
                li.textContent = item.name;
                return li;
            },
            didCancelSelection: ()=>{
                this.destroy();
                this.emitter.emit("did-cancel", "User aborted");
            },
            didConfirmSelection: (item)=>{
                this.emitter.emit("did-confirm", item.repo);
                this.destroy();
            }
        });
        this.result = new Promise((resolve, reject)=>{
            this.emitter.once("did-cancel", reject);
            this.emitter.once("did-confirm", resolve);
        });
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>{
            this.list.destroy();
            this.emitter.dispose();
        }));
        this.attach();
    }
    attach() {
        this.previouslyFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
            item: this.list.element
        });
        this.list.focus();
        this.isAttached = true;
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>{
            var _a;
            this.panel.destroy();
            (_a = this.previouslyFocusedElement) === null || _a === void 0 || _a.focus();
        }));
    }
}
var $ba3ac58dfc20d764$export$2e2bcd8739ae039 = async (repos)=>{
    return new $ba3ac58dfc20d764$var$RepoListView(repos).result;
};

});


parcelRegister("lppKC", function(module, exports) {






(function() {
    var ActivityLogger, BufferedProcess, Directory, Os, RepoListView, Repository, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, splice = [].splice;
    Os = $dp3SY$os;
    ({ BufferedProcess: BufferedProcess, Directory: Directory } = $dp3SY$atom);
    RepoListView = (parcelRequire("jPd0C"));
    notifier = (parcelRequire("gSFWX"));
    Repository = (parcelRequire("eQF7Z")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    gitUntrackedFiles = function(repo, dataUnstaged = []) {
        var args;
        args = [
            'ls-files',
            '-o',
            '--exclude-standard'
        ];
        return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return dataUnstaged.concat(_prettifyUntracked(data));
        });
    };
    _prettify = function(data, { staged: staged } = {}) {
        var i, mode;
        if (data === '') return [];
        data = data.split(/\0/).slice(0, -1);
        return function() {
            var j, len, results;
            results = [];
            for(i = j = 0, len = data.length; j < len; i = j += 2){
                mode = data[i];
                results.push({
                    mode: mode,
                    staged: staged,
                    path: data[i + 1]
                });
            }
            return results;
        }();
    };
    _prettifyUntracked = function(data) {
        if (data === '') return [];
        data = data.split(/\n/).filter(function(d) {
            return d !== '';
        });
        return data.map(function(file) {
            return {
                mode: '?',
                path: file
            };
        });
    };
    _prettifyDiff = function(data) {
        var line, ref;
        data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
        splice.apply(data, [
            1,
            data.length - 1 + 1
        ].concat(ref = function() {
            var j, len, ref1, results;
            ref1 = data.slice(1);
            results = [];
            for(j = 0, len = ref1.length; j < len; j++){
                line = ref1[j];
                results.push('@@' + line);
            }
            return results;
        }())), ref;
        return data;
    };
    getRepoForCurrentFile = function() {
        return new Promise(function(resolve, reject) {
            var directory, path, project, ref;
            project = atom.project;
            path = (ref = atom.workspace.getCenter().getActiveTextEditor()) != null ? ref.getPath() : void 0;
            directory = project.getDirectories().filter(function(d) {
                return d.contains(path);
            })[0];
            if (directory != null) return project.repositoryForDirectory(directory).then(function(repo) {
                var submodule;
                submodule = repo.repo.submoduleForPath(path);
                if (submodule != null) return resolve(submodule);
                else return resolve(repo);
            }).catch(function(e) {
                return reject(e);
            });
            else return reject("no current file");
        });
    };
    module.exports = git = {
        cmd: function(args, options = {
            env: process.env
        }, { color: color } = {}) {
            return new Promise(function(resolve, reject) {
                var output, process1, ref;
                output = '';
                if (color) args = [
                    '-c',
                    'color.ui=always'
                ].concat(args);
                process1 = new BufferedProcess({
                    command: (ref = atom.config.get('pulsar-git-plus.general.gitPath')) != null ? ref : 'git',
                    args: args,
                    options: options,
                    stdout: function(data) {
                        return output += data.toString();
                    },
                    stderr: function(data) {
                        return output += data.toString();
                    },
                    exit: function(code) {
                        if (code === 0) return resolve(output);
                        else return reject(output);
                    }
                });
                return process1.onWillThrowError(function(errorObject) {
                    notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
                    return reject("Couldn't find git");
                });
            });
        },
        getConfig: function(repo, setting) {
            return repo.getConfigValue(setting, repo.getWorkingDirectory());
        },
        reset: function(repo) {
            return git.cmd([
                'reset',
                'HEAD'
            ], {
                cwd: repo.getWorkingDirectory()
            }).then(function() {
                return notifier.addSuccess('All changes unstaged');
            });
        },
        status: function(repo) {
            return git.cmd([
                'status',
                '--porcelain',
                '-z'
            ], {
                cwd: repo.getWorkingDirectory()
            }).then(function(data) {
                if (data.length > 2) return data.split('\0').slice(0, -1);
                else return [];
            });
        },
        refresh: function(repo) {
            if (repo) {
                if (typeof repo.refreshStatus === "function") repo.refreshStatus();
                return typeof repo.refreshIndex === "function" ? repo.refreshIndex() : void 0;
            } else return atom.project.getRepositories().forEach(function(repo) {
                if (repo != null) return repo.refreshStatus();
            });
        },
        relativize: function(path) {
            var ref, ref1, ref2, ref3;
            return (ref = (ref1 = (ref2 = git.getSubmodule(path)) != null ? ref2.relativize(path) : void 0) != null ? ref1 : (ref3 = atom.project.getRepositories()[0]) != null ? ref3.relativize(path) : void 0) != null ? ref : path;
        },
        diff: function(repo, path) {
            return git.cmd([
                'diff',
                '-p',
                '-U1',
                path
            ], {
                cwd: repo.getWorkingDirectory()
            }).then(function(data) {
                return _prettifyDiff(data);
            });
        },
        stagedFiles: function(repo) {
            var args;
            args = [
                'diff-index',
                '--cached',
                'HEAD',
                '--name-status',
                '-z'
            ];
            return git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }).then(function(data) {
                return _prettify(data, {
                    staged: true
                });
            }).catch(function(error) {
                if (error.includes("ambiguous argument 'HEAD'")) return Promise.resolve([
                    1
                ]);
                else {
                    notifier.addError(error);
                    return Promise.resolve([]);
                }
            });
        },
        unstagedFiles: function(repo, { showUntracked: showUntracked } = {}) {
            var args;
            args = [
                'diff-files',
                '--name-status',
                '-z'
            ];
            return git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }).then(function(data) {
                if (showUntracked) return gitUntrackedFiles(repo, _prettify(data, {
                    staged: false
                }));
                else return _prettify(data, {
                    staged: false
                });
            });
        },
        getStagingStatus: function(repo, filePath) {
            return git.getRepo().then(function(repo) {
                return git.stagedFiles(repo).then(function(stagedFiles) {
                    return git.unstagedFiles(repo, {
                        showUntracked: true
                    }).then(function(unstagedFiles) {
                        var staged, unstaged;
                        staged = stagedFiles.some(function(file) {
                            return file.path === filePath;
                        });
                        unstaged = unstagedFiles.some(function(file) {
                            return file.path === filePath;
                        });
                        if (staged) return "staged";
                        else if (unstaged) return "unstaged";
                        else return "";
                    });
                });
            });
        },
        add: function(repo, { file: file, update: update } = {}) {
            var args, message, repoName;
            args = [
                'add'
            ];
            if (update) args.push('--update');
            else args.push('--all');
            args.push(file ? file : '.');
            message = `git add ${args[args.length - 1]}`;
            repoName = new Repository(repo).getName();
            return git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }).then(function(output) {
                return ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: output
                });
            }).catch(function(output) {
                return ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: output,
                    failed: true
                });
            });
        },
        getAllRepos: function() {
            var project;
            ({ project: project } = atom);
            return Promise.all(project.getDirectories().map(project.repositoryForDirectory.bind(project)));
        },
        getRepo: function() {
            return new Promise(function(resolve, reject) {
                return getRepoForCurrentFile().then(function(repo) {
                    return resolve(repo);
                }).catch(function(e) {
                    var repos;
                    repos = atom.project.getRepositories().filter(function(r) {
                        return r != null;
                    });
                    if (repos.length === 0) return reject("No repos found");
                    else if (repos.length > 1) return resolve(new RepoListView(repos).result);
                    else return resolve(repos[0]);
                });
            });
        },
        getRepoForPath: function(path) {
            if (path == null) return Promise.reject("No file to find repository for");
            else return new Promise(function(resolve, reject) {
                var repoPromises;
                repoPromises = atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project));
                return Promise.all(repoPromises).then(function(repos) {
                    return repos.filter(Boolean).forEach(function(repo) {
                        var directory, submodule;
                        directory = new Directory(repo.getWorkingDirectory());
                        if (repo != null && directory.contains(path) || directory.getPath() === path) {
                            submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
                            if (submodule != null) return resolve(submodule);
                            else return resolve(repo);
                        }
                    });
                });
            });
        },
        getSubmodule: function(path) {
            var ref, ref1, ref2;
            if (path == null) path = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
            return (ref1 = atom.project.getRepositories().filter(function(r) {
                var ref2;
                return r != null ? (ref2 = r.repo) != null ? ref2.submoduleForPath(path) : void 0 : void 0;
            })[0]) != null ? (ref2 = ref1.repo) != null ? ref2.submoduleForPath(path) : void 0 : void 0;
        },
        dir: function(andSubmodules = true) {
            return new Promise((resolve, reject)=>{
                var submodule;
                if (andSubmodules && (submodule = git.getSubmodule())) return resolve(submodule.getWorkingDirectory());
                else return git.getRepo().then(function(repo) {
                    return resolve(repo.getWorkingDirectory());
                });
            });
        }
    };
}).call(module.exports);

});
parcelRegister("jPd0C", function(module, exports) {


(function() {
    var $$, ListView, SelectListView, git;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    module.exports = ListView = class ListView extends SelectListView {
        initialize(repos) {
            this.repos = repos;
            super.initialize();
            this.currentPane = atom.workspace.getActivePane();
            return this.result = new Promise((resolve, reject)=>{
                this.resolve = resolve;
                this.reject = reject;
                return this.setup();
            });
        }
        getFilterKey() {
            return 'name';
        }
        setup() {
            this.repos = this.repos.map(function(r) {
                var path;
                path = r.getWorkingDirectory();
                return {
                    name: path.substring(path.lastIndexOf('/') + 1),
                    repo: r
                };
            });
            this.setItems(this.repos);
            return this.show();
        }
        show() {
            this.filterEditorView.getModel().placeholderText = 'Which repo?';
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.focusFilterEditor();
            return this.storeFocusedElement();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        cancelled() {
            return this.hide();
        }
        viewForItem({ name: name }) {
            return $$(function() {
                return this.li(name);
            });
        }
        confirmed({ repo: repo }) {
            this.resolve(repo);
            return this.cancel();
        }
    };
}).call(module.exports);

});

parcelRegister("gSFWX", function(module, exports) {

(function() {
    module.exports = $dp3SY$atomnotify('Git-Plus');
}).call(module.exports);

});

parcelRegister("eQF7Z", function(module, exports) {

$parcel$export(module.exports, "StashCommands", () => $acf5d328ebda8ac8$export$e594f289b9b4cc65);
$parcel$export(module.exports, "default", () => $acf5d328ebda8ac8$export$2e2bcd8739ae039);


var $eVTd8 = parcelRequire("eVTd8");
const $acf5d328ebda8ac8$export$e594f289b9b4cc65 = {
    Apply: {
        name: "apply",
        pastTense: "applied",
        presentTense: "applying"
    },
    Pop: {
        name: "pop",
        pastTense: "popped",
        presentTense: "popping"
    },
    Drop: {
        name: "drop",
        pastTense: "dropped",
        presentTense: "dropping"
    }
};
class $acf5d328ebda8ac8$export$2e2bcd8739ae039 {
    static async getCurrent() {
        const repo = await (0, $eVTd8.getRepo)();
        return repo ? new $acf5d328ebda8ac8$export$2e2bcd8739ae039(repo) : undefined;
    }
    static async getForPath(path) {
        const repo = await (0, $eVTd8.getRepoForPath)(path);
        return repo ? new $acf5d328ebda8ac8$export$2e2bcd8739ae039(repo) : undefined;
    }
    constructor(repo){
        this.repo = repo;
    }
    getWorkingDirectory() {
        return this.repo.getWorkingDirectory();
    }
    stage(paths, options = {
        update: false
    }) {
        const args = [
            "add"
        ];
        if (options.update) args.push("--update");
        else args.push("--all");
        args.push(...paths);
        return (0, $eVTd8.default)(args, {
            cwd: this.repo.getWorkingDirectory()
        });
    }
    getName() {
        return $dp3SY$path.basename(this.repo.getWorkingDirectory());
    }
    async getBranchesForRemote(remote) {
        const { failed: failed, output: output } = await (0, $eVTd8.default)([
            "branch",
            "-r",
            "--no-color"
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        if (failed) return [];
        const branches = [];
        output.split("\n").forEach((ref)=>{
            ref = ref.trim();
            if (ref.startsWith(`${remote}/`) && !ref.includes("/HEAD")) branches.push(ref.substring(ref.indexOf("/") + 1));
        });
        return branches;
    }
    async getRemoteNames() {
        const { failed: failed, output: output } = await (0, $eVTd8.default)([
            "remote"
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        if (failed) return [];
        return output.split("\n").filter(Boolean);
    }
    async getStashes() {
        const { failed: failed, output: output } = await (0, $eVTd8.default)([
            "stash",
            "list"
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        if (failed) return [];
        return output.split("\n").filter(Boolean).map((stashInfo)=>{
            const [indexInfo, ...rest] = stashInfo.split(":");
            const indexMatch = indexInfo.match(/\d+/);
            if (!indexMatch) return null;
            return {
                index: indexMatch[0],
                label: rest.join().trim(),
                content: stashInfo
            };
        }).filter(Boolean);
    }
    actOnStash(stash, command) {
        const args = [
            "stash",
            command.name,
            stash.index
        ];
        return (0, $eVTd8.default)(args, {
            cwd: this.repo.getWorkingDirectory()
        });
    }
    fetch(remote, options = {}) {
        const args = [
            "fetch",
            remote || "--all"
        ];
        if (options.prune) args.push("--prune");
        return (0, $eVTd8.default)(args, {
            cwd: this.repo.getWorkingDirectory(),
            color: true
        });
    }
    pull(options = {}) {
        const args = [
            "pull"
        ];
        if (options.autostash) args.push("--autostash");
        if (options.rebase) args.push("--rebase");
        if (options.remote) args.push(options.remote);
        if (options.branch) args.push(options.branch);
        return (0, $eVTd8.default)(args, {
            cwd: this.repo.getWorkingDirectory()
        });
    }
    push(options = {}) {
        const args = [
            "push"
        ];
        if (options.setUpstream) args.push("--set-upstream");
        if (options.remote) args.push(options.remote);
        if (options.branch) args.push(options.branch);
        return (0, $eVTd8.default)(args, {
            cwd: this.repo.getWorkingDirectory()
        });
    }
    refresh() {
        this.repo.refreshIndex();
        this.repo.refreshStatus();
    }
    relativize(path) {
        if (path === this.getWorkingDirectory()) return this.getName();
        return this.repo.relativize(path);
    }
    reset() {
        return (0, $eVTd8.default)([
            "reset",
            "HEAD"
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
    }
    async resetChanges(path) {
        const result = await (0, $eVTd8.default)([
            "checkout",
            "--",
            path
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        this.refresh();
        return result;
    }
    async isPathStaged(path) {
        const result = await (0, $eVTd8.default)([
            "diff",
            "--cached",
            "--name-only",
            path
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        if (path === this.getWorkingDirectory() && result.output !== "") return true;
        return result.output.includes(this.relativize(path));
    }
    isPathModified(path) {
        return this.repo.isPathModified(path);
    }
    async getUpstreamBranchFor(branch) {
        const result = await (0, $eVTd8.default)([
            "rev-parse",
            "--abbrev-ref",
            `${branch}@{upstream}`
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
        if (result.failed && result.output.includes("fatal: no upstream configured")) return null;
        else return result.output.split("/");
    }
    async unstage(path) {
        return await (0, $eVTd8.default)([
            "reset",
            path
        ], {
            cwd: this.repo.getWorkingDirectory()
        });
    }
}

});

parcelRegister("9JoOT", function(module, exports) {

$parcel$export(module.exports, "default", () => $715b91bc3bca4e15$export$2e2bcd8739ae039);


var $8Ozu2 = parcelRequire("8Ozu2");

var $9e2wo = parcelRequire("9e2wo");
// taken from: https://gist.github.com/jed/982883
const $715b91bc3bca4e15$var$makeId = (a)=>a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, $715b91bc3bca4e15$var$makeId);
class $715b91bc3bca4e15$var$ActivityLogger {
    constructor(){
        this.listeners = new Set();
        this._records = [];
    }
    get records() {
        return this._records;
    }
    record(attributes) {
        const record = {
            ...attributes,
            id: $715b91bc3bca4e15$var$makeId()
        };
        if (record.failed && !atom.config.get("pulsar-git-plus.general.alwaysOpenDockWithResult") && !(0, $8Ozu2.viewController).isVisible((0, $9e2wo.OutputViewContainer).URI)) atom.notifications.addError(`Unable to complete command: ${record.message}`, {
            detail: record.output,
            buttons: [
                {
                    text: "Open Output View",
                    onDidClick: ()=>{
                        atom.commands.dispatch(document.querySelector("atom-workspace"), "pulsar-git-plus:toggle-output-view");
                    }
                }
            ]
        });
        this._records.push(record);
        window.requestIdleCallback(()=>{
            this.listeners.forEach((listener)=>listener(record));
            if (atom.config.get("pulsar-git-plus.general.alwaysOpenDockWithResult")) (0, $8Ozu2.viewController).getOutputView().show();
        });
    }
    onDidRecordActivity(callback) {
        this.listeners.add(callback);
        return new (0, $dp3SY$atom.Disposable)(()=>this.listeners.delete(callback));
    }
}
const $715b91bc3bca4e15$var$logger = new $715b91bc3bca4e15$var$ActivityLogger();
var $715b91bc3bca4e15$export$2e2bcd8739ae039 = $715b91bc3bca4e15$var$logger;

});
parcelRegister("8Ozu2", function(module, exports) {

$parcel$export(module.exports, "viewController", () => $66ae84852bce7e4b$export$16b9a1e7104c8845);

var $9e2wo = parcelRequire("9e2wo");
function $66ae84852bce7e4b$var$isDock(container) {
    return container.getLocation() !== "center";
}
class $66ae84852bce7e4b$var$ViewController {
    constructor(){
        atom.workspace.addOpener((uri)=>{
            if (uri === (0, $9e2wo.OutputViewContainer).URI) return this.getOutputView();
        });
    }
    getOutputView() {
        if (!this.outputView) {
            this.outputView = new (0, $9e2wo.OutputViewContainer)();
            this.outputView.onDidDestroy(()=>{
                this.outputView = undefined;
            });
        }
        return this.outputView;
    }
    isVisible(uri) {
        const container = atom.workspace.paneContainerForURI(uri);
        if (container) {
            const activeItem = container.getActivePaneItem();
            if (!activeItem) return false;
            const viewIsActive = activeItem.getURI && activeItem.getURI() === uri;
            if ($66ae84852bce7e4b$var$isDock(container)) return container.isVisible() && viewIsActive;
            return viewIsActive;
        }
        return false;
    }
}
const $66ae84852bce7e4b$export$16b9a1e7104c8845 = new $66ae84852bce7e4b$var$ViewController();

});
parcelRegister("9e2wo", function(module, exports) {

$parcel$export(module.exports, "OutputViewContainer", () => $6b7760993bd97cfe$export$e5bb394b6678685e);




var $acbSv = parcelRequire("acbSv");
class $6b7760993bd97cfe$export$e5bb394b6678685e {
    constructor(){
        this.emitter = new (0, $dp3SY$atom.Emitter)();
        this.element = document.createElement("div");
        this.element.classList.add("pulsar-git-plus", "output");
        this.render();
        atom.workspace.open(this, {
            activatePane: false
        });
    }
    getURI() {
        return $6b7760993bd97cfe$export$e5bb394b6678685e.URI;
    }
    getTitle() {
        return "Git+";
    }
    getDefaultLocation() {
        return "bottom";
    }
    serialize() {
        return {
            deserializer: "pulsar-git-plus/output-view"
        };
    }
    async show() {
        const focusedPane = atom.workspace.getActivePane();
        await atom.workspace.open(this, {
            activatePane: true
        });
        if (focusedPane && !focusedPane.isDestroyed()) focusedPane.activate();
    }
    hide() {
        atom.workspace.hide(this);
    }
    render() {
        $dp3SY$reactdom.render(/*#__PURE__*/ $dp3SY$react.createElement((0, $acbSv.Root), null), this.element);
    }
    toggle() {
        atom.workspace.toggle(this);
    }
    destroy() {
        $dp3SY$reactdom.unmountComponentAtNode(this.element);
        this.element.remove();
        this.emitter.emit("did-destroy");
    }
    onDidDestroy(cb) {
        return this.emitter.on("did-destroy", cb);
    }
}
$6b7760993bd97cfe$export$e5bb394b6678685e.URI = "pulsar-git-plus://output-view";

});
parcelRegister("acbSv", function(module, exports) {

$parcel$export(module.exports, "Root", () => $76c43d1d1ca35db0$export$be92b6f5f03c0fe9);




var $9JoOT = parcelRequire("9JoOT");

var $eNeDK = parcelRequire("eNeDK");
function $76c43d1d1ca35db0$var$reverseMap(array, fn) {
    const result = [];
    for(let i = array.length - 1; i > -1; i--)result.push(fn(array[i], i));
    return result;
}
class $76c43d1d1ca35db0$export$be92b6f5f03c0fe9 extends $dp3SY$react.Component {
    constructor(){
        super(...arguments);
        this.state = {
            latestId: null,
            records: [
                ...(0, $9JoOT.default).records
            ]
        };
        this.subscriptions = new (0, $dp3SY$atom.CompositeDisposable)();
        this.$root = /*#__PURE__*/ $dp3SY$react.createRef();
        this.ansiConverter = new $dp3SY$ansitohtml();
    }
    componentDidMount() {
        this.subscriptions.add((0, $9JoOT.default).onDidRecordActivity((record)=>{
            this.setState((state)=>({
                    latestId: record.id,
                    records: [
                        ...state.records,
                        record
                    ]
                }));
        }), atom.commands.add("atom-workspace", "pulsar-git-plus:copy", {
            hiddenInCommandPalette: true,
            didDispatch: (event)=>{
                if (event.target && event.target.contains(document.querySelector(".pulsar-git-plus.output"))) atom.clipboard.write(window.getSelection().toString());
                else event.abortKeyBinding();
            }
        }));
        atom.keymaps.add("pulsar-git-plus", {
            ".platform-darwin atom-workspace": {
                "cmd-c": "pulsar-git-plus:copy"
            },
            ".platform-win32 atom-workspace, .platform-linux atom-workspace": {
                "ctrl-c": "pulsar-git-plus:copy"
            }
        });
    }
    componentDidUpdate(previousProps, previousState) {
        if (previousState.records.length < this.state.records.length) {
            if (this.$root.current) this.$root.current.scrollTop = 0;
        }
    }
    componentWillUnmount() {
        this.subscriptions.dispose();
        atom.keymaps["removeBindingsFromSource"]("pulsar-git-plus");
    }
    render() {
        return /*#__PURE__*/ $dp3SY$react.createElement("div", {
            id: "root",
            ref: this.$root
        }, $76c43d1d1ca35db0$var$reverseMap(this.state.records, (record)=>/*#__PURE__*/ $dp3SY$react.createElement((0, $eNeDK.Entry), {
                isLatest: this.state.latestId === record.id,
                key: record.id,
                record: record,
                ansiConverter: this.ansiConverter
            })));
    }
}

});
parcelRegister("eNeDK", function(module, exports) {

$parcel$export(module.exports, "Entry", () => $ac50ff80264ebb0b$export$3bb977b3ba9d3b59);



class $ac50ff80264ebb0b$export$3bb977b3ba9d3b59 extends $dp3SY$react.Component {
    constructor(props){
        super(props);
        this.userToggled = false;
        this.handleClickToggle = (event)=>{
            event.stopPropagation();
            this.userToggled = true;
            this.setState({
                collapsed: !this.state.collapsed
            });
        };
        this.state = {
            collapsed: atom.config.get("pulsar-git-plus.general.alwaysOpenDockWithResult") && props.isLatest ? false : true
        };
    }
    componentDidUpdate(prevProps) {
        if (!this.props.isLatest && prevProps.isLatest && !this.userToggled) this.setState({
            collapsed: true
        });
    }
    render() {
        const { failed: failed, message: message, output: output, repoName: repoName } = this.props.record;
        const hasOutput = output !== "";
        return /*#__PURE__*/ $dp3SY$react.createElement("div", {
            className: (0, ($parcel$interopDefault($dp3SY$classnames)))("record", {
                "has-output": hasOutput
            })
        }, /*#__PURE__*/ $dp3SY$react.createElement("div", {
            className: "line",
            onClick: this.handleClickToggle
        }, /*#__PURE__*/ $dp3SY$react.createElement("div", {
            className: "gutter"
        }, hasOutput && /*#__PURE__*/ $dp3SY$react.createElement("span", {
            className: "icon icon-ellipsis"
        })), /*#__PURE__*/ $dp3SY$react.createElement("div", {
            className: (0, ($parcel$interopDefault($dp3SY$classnames)))("message", {
                "text-error": failed
            })
        }, "[", repoName, "] ", message)), hasOutput && /*#__PURE__*/ $dp3SY$react.createElement("div", {
            className: (0, ($parcel$interopDefault($dp3SY$classnames)))("output", {
                collapsed: this.state.collapsed
            })
        }, /*#__PURE__*/ $dp3SY$react.createElement("pre", {
            dangerouslySetInnerHTML: {
                __html: $dp3SY$linkifyurls(this.props.ansiConverter.toHtml(output))
            }
        })));
    }
}

});






parcelRegister("crkkW", function(module, exports) {


(function() {
    var GitRun, capitalize, customCommands, git, service;
    git = (parcelRequire("lppKC"));
    GitRun = (parcelRequire("ceh8S"));
    capitalize = function(text) {
        return text.split(' ').map(function(word) {
            return word[0].toUpperCase() + word.substring(1);
        }).join(' ');
    };
    customCommands = [];
    service = {};
    if (atom.config.get('pulsar-git-plus.experimental.customCommands')) {
        service.getCustomCommands = function() {
            return customCommands;
        };
        service.getRepo = git.getRepo;
        service.registerCommand = function(element, name, fn) {
            var displayName;
            atom.commands.add(element, name, fn);
            displayName = capitalize(name.split(':')[1].replace(/-/g, ' '));
            return customCommands.push([
                name,
                displayName,
                fn
            ]);
        };
        service.run = GitRun;
    }
    module.exports = Object.freeze(service);
}).call(module.exports);

});
parcelRegister("ceh8S", function(module, exports) {






(function() {
    var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git, git2, runCommand;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    ({ $: $, TextEditorView: TextEditorView, View: View } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    git2 = (parcelRequire("eVTd8")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    runCommand = function(repo, args) {
        var promise, repoName;
        repoName = new Repository(repo).getName();
        promise = git2(args, {
            cwd: repo.getWorkingDirectory(),
            color: true
        });
        promise.then(function(result) {
            ActivityLogger.record(Object.assign({
                repoName: repoName,
                message: `${args.join(' ')}`
            }, result));
            return git.refresh(repo);
        });
        return promise;
    };
    InputView = class InputView extends View {
        static content() {
            return this.div(()=>{
                return this.subview('commandEditor', new TextEditorView({
                    mini: true,
                    placeholderText: 'Git command and arguments'
                }));
            });
        }
        initialize(repo1) {
            this.repo = repo1;
            this.disposables = new CompositeDisposable();
            this.currentPane = atom.workspace.getActivePane();
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.commandEditor.focus();
            this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:cancel': (e)=>{
                    var ref;
                    if ((ref = this.panel) != null) ref.destroy();
                    this.currentPane.activate();
                    return this.disposables.dispose();
                }
            }));
            return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (e)=>{
                var ref;
                this.disposables.dispose();
                if ((ref = this.panel) != null) ref.destroy();
                return runCommand(this.repo, this.commandEditor.getText().split(' ')).then(()=>{
                    this.currentPane.activate();
                    return git.refresh(this.repo);
                });
            }));
        }
    };
    module.exports = function(repo, args = []) {
        if (args.length > 0) return runCommand(repo, args.split(' '));
        else return new InputView(repo);
    };
}).call(module.exports);

});


parcelRegister("hH1op", function(module, exports) {

$parcel$export(module.exports, "default", () => $ce178863e42faca6$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
const $ce178863e42faca6$var$getCurrentFileInRepo = (repo)=>{
    const activeEditor = atom.workspace.getActiveTextEditor();
    const path = activeEditor && activeEditor.getPath();
    if (!path) return null;
    return repo.relativize(path);
};
var $ce178863e42faca6$export$2e2bcd8739ae039 = async (stageEverything = false)=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const path = stageEverything ? "." : $ce178863e42faca6$var$getCurrentFileInRepo(repo) || ".";
    const result = await repo.stage([
        path
    ]);
    (0, $9JoOT.default).record({
        repoName: repo.getName(),
        message: `add ${path}`,
        ...result
    });
};

});

parcelRegister("j90G6", function(module, exports) {

$parcel$export(module.exports, "default", () => $deff623bfa6a9949$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
var $deff623bfa6a9949$export$2e2bcd8739ae039 = async ()=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const result = await repo.stage([
        "."
    ], {
        update: true
    });
    (0, $9JoOT.default).record({
        repoName: repo.getName(),
        message: `add modified files`,
        ...result
    });
};

});

parcelRegister("3iQun", function(module, exports) {







































(function() {
    var getCommands, git;
    git = (parcelRequire("lppKC"));
    getCommands = function() {
        var GitCheckoutBranch, GitCheckoutNewBranch, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteBranch, GitDiff, GitDiffAll, GitDiffBranchFiles, GitDiffBranches, GitDifftool, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, ManageStashes, commands, gitAdd, gitAddModified, gitCheckoutFile, gitFetch, gitFetchInAllRepos, gitPull, gitPush, gitReset;
        gitAdd = (parcelRequire("hH1op")).default;
        gitAddModified = (parcelRequire("j90G6")).default;
        GitCheckoutNewBranch = (parcelRequire("4y5U8"));
        GitCheckoutBranch = (parcelRequire("2DNX4"));
        GitDeleteBranch = (parcelRequire("3O1Aw"));
        gitCheckoutFile = (parcelRequire("dcxBF")).default;
        GitCherryPick = (parcelRequire("77LDn"));
        GitCommit = (parcelRequire("3mGsE"));
        GitCommitAmend = (parcelRequire("bXxVi"));
        GitDiff = (parcelRequire("7c2RU"));
        GitDiffBranches = (parcelRequire("3Pi7d"));
        GitDiffBranchFiles = (parcelRequire("hD9Pz"));
        GitDifftool = (parcelRequire("ejfzQ"));
        GitDiffAll = (parcelRequire("ggLle"));
        gitFetch = (parcelRequire("jd638")).default;
        gitFetchInAllRepos = (parcelRequire("eaDLy")).default;
        GitInit = (parcelRequire("lBjNq"));
        GitLog = (parcelRequire("e4WFK"));
        gitPull = (parcelRequire("km474")).default;
        gitPush = (parcelRequire("cMzzd")).default;
        gitReset = (parcelRequire("3piiI")).default;
        GitRemove = (parcelRequire("2mdJF"));
        GitShow = (parcelRequire("271rL"));
        GitStageFiles = (parcelRequire("4BqoQ"));
        GitStageHunk = (parcelRequire("lK3FM"));
        ManageStashes = (parcelRequire("dMIZz"));
        GitStashApply = (parcelRequire("7OvTn"));
        GitStashDrop = (parcelRequire("hBbsd"));
        GitStashPop = (parcelRequire("7xGEe"));
        GitStashSave = (parcelRequire("cmRNj"));
        GitStashSaveMessage = (parcelRequire("7TM1C"));
        GitStatus = (parcelRequire("9xGRG"));
        GitTags = (parcelRequire("8niyI"));
        GitRun = (parcelRequire("ceh8S"));
        GitMerge = (parcelRequire("d1WP8"));
        GitRebase = (parcelRequire("l0YAk"));
        GitOpenChangedFiles = (parcelRequire("7u2hg"));
        commands = [];
        return git.getRepo().then(function(repo) {
            var currentFile, ref;
            currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
            git.refresh(repo);
            if (atom.config.get('pulsar-git-plus.experimental.customCommands')) commands = commands.concat((parcelRequire("crkkW")).getCustomCommands());
            commands.push([
                'pulsar-git-plus:add',
                'Add',
                gitAdd
            ]);
            commands.push([
                'pulsar-git-plus:add-modified',
                'Add Modified',
                gitAddModified
            ]);
            commands.push([
                'pulsar-git-plus:add-all',
                'Add All',
                function() {
                    return gitAdd(true);
                }
            ]);
            commands.push([
                'pulsar-git-plus:log',
                'Log',
                function() {
                    return GitLog(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:log-current-file',
                'Log Current File',
                function() {
                    return GitLog(repo, {
                        onlyCurrentFile: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:remove-current-file',
                'Remove Current File',
                function() {
                    return GitRemove(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:checkout-all-files',
                'Checkout All Files',
                function() {
                    return gitCheckoutFile(true);
                }
            ]);
            commands.push([
                'pulsar-git-plus:checkout-current-file',
                'Checkout Current File',
                function() {
                    return gitCheckoutFile();
                }
            ]);
            commands.push([
                'pulsar-git-plus:commit',
                'Commit',
                function() {
                    return GitCommit(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:commit-all',
                'Commit All',
                function() {
                    return GitCommit(repo, {
                        stageChanges: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:commit-amend',
                'Commit Amend',
                function() {
                    return GitCommitAmend(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:add-and-commit',
                'Add And Commit',
                function() {
                    return git.add(repo, {
                        file: currentFile
                    }).then(function() {
                        return GitCommit(repo);
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:add-and-commit-and-push',
                'Add And Commit And Push',
                function() {
                    return git.add(repo, {
                        file: currentFile
                    }).then(function() {
                        return GitCommit(repo, {
                            andPush: true
                        });
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:add-all-and-commit',
                'Add All And Commit',
                function() {
                    return git.add(repo).then(function() {
                        return GitCommit(repo);
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:add-all-commit-and-push',
                'Add All, Commit And Push',
                function() {
                    return git.add(repo).then(function() {
                        return GitCommit(repo, {
                            andPush: true
                        });
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:commit-all-and-push',
                'Commit All And Push',
                function() {
                    return GitCommit(repo, {
                        stageChanges: true,
                        andPush: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:checkout',
                'Checkout',
                function() {
                    return GitCheckoutBranch(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:checkout-remote',
                'Checkout Remote',
                function() {
                    return GitCheckoutBranch(repo, {
                        remote: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:new-branch',
                'Checkout New Branch',
                function() {
                    return GitCheckoutNewBranch(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:delete-local-branch',
                'Delete Local Branch',
                function() {
                    return GitDeleteBranch(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:delete-remote-branch',
                'Delete Remote Branch',
                function() {
                    return GitDeleteBranch(repo, {
                        remote: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:delete-branch-local-and-remote',
                'Delete Branch (Local and Remote)',
                function() {
                    return GitDeleteBranch(repo).then(function() {
                        return GitDeleteBranch(repo, {
                            remote: true
                        });
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:cherry-pick',
                'Cherry-Pick',
                function() {
                    return GitCherryPick(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:diff',
                'Diff',
                function() {
                    return GitDiff(repo, {
                        file: currentFile
                    });
                }
            ]);
            if (atom.config.get('pulsar-git-plus.experimental.diffBranches')) {
                commands.push([
                    'pulsar-git-plus:diff-branches',
                    'Diff branches',
                    function() {
                        return GitDiffBranches(repo);
                    }
                ]);
                commands.push([
                    'pulsar-git-plus:diff-branch-files',
                    'Diff branch files',
                    function() {
                        return GitDiffBranchFiles(repo);
                    }
                ]);
            }
            commands.push([
                'pulsar-git-plus:difftool',
                'Difftool',
                function() {
                    return GitDifftool(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:diff-all',
                'Diff All',
                function() {
                    return GitDiffAll(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:fetch',
                'Fetch',
                gitFetch
            ]);
            commands.push([
                'pulsar-git-plus:fetch-all',
                'Fetch All (Repos & Remotes)',
                gitFetchInAllRepos
            ]);
            commands.push([
                'pulsar-git-plus:fetch-prune',
                'Fetch Prune',
                function() {
                    return gitFetch({
                        prune: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:pull',
                'Pull',
                gitPull
            ]);
            commands.push([
                'pulsar-git-plus:push',
                'Push',
                gitPush
            ]);
            commands.push([
                'pulsar-git-plus:push-set-upstream',
                'Push -u',
                function() {
                    return gitPush(true);
                }
            ]);
            commands.push([
                'pulsar-git-plus:remove',
                'Remove',
                function() {
                    return GitRemove(repo, {
                        showSelector: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:reset',
                'Reset HEAD',
                gitReset
            ]);
            commands.push([
                'pulsar-git-plus:show',
                'Show',
                function() {
                    return GitShow(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stage-files',
                'Stage Files',
                function() {
                    return GitStageFiles(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stage-hunk',
                'Stage Hunk',
                function() {
                    return GitStageHunk(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:manage-stashes',
                'Manage Stashes',
                ManageStashes.default
            ]);
            commands.push([
                'pulsar-git-plus:stash-save',
                'Stash: Save Changes',
                function() {
                    return GitStashSave(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stash-save-message',
                'Stash: Save Changes With Message',
                function() {
                    return GitStashSaveMessage(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stash-pop',
                'Stash: Apply (Pop)',
                function() {
                    return GitStashPop(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stash-apply',
                'Stash: Apply (Keep)',
                function() {
                    return GitStashApply(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:stash-delete',
                'Stash: Delete (Drop)',
                function() {
                    return GitStashDrop(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:status',
                'Status',
                function() {
                    return GitStatus(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:tags',
                'Tags',
                function() {
                    return GitTags(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:run',
                'Run',
                function() {
                    return new GitRun(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:merge',
                'Merge',
                function() {
                    return GitMerge(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:merge-remote',
                'Merge Remote',
                function() {
                    return GitMerge(repo, {
                        remote: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:merge-no-fast-forward',
                'Merge without fast-forward',
                function() {
                    return GitMerge(repo, {
                        noFastForward: true
                    });
                }
            ]);
            commands.push([
                'pulsar-git-plus:rebase',
                'Rebase',
                function() {
                    return GitRebase(repo);
                }
            ]);
            commands.push([
                'pulsar-git-plus:git-open-changed-files',
                'Open Changed Files',
                function() {
                    return GitOpenChangedFiles(repo);
                }
            ]);
            return commands;
        });
    };
    module.exports = getCommands;
}).call(module.exports);

});
parcelRegister("4y5U8", function(module, exports) {





(function() {
    var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    ({ $: $, TextEditorView: TextEditorView, View: View } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    InputView = class InputView extends View {
        static content() {
            return this.div({
                class: 'git-branch'
            }, ()=>{
                return this.subview('branchEditor', new TextEditorView({
                    mini: true,
                    placeholderText: 'New branch name'
                }));
            });
        }
        initialize(repo1) {
            this.repo = repo1;
            this.disposables = new CompositeDisposable();
            this.currentPane = atom.workspace.getActivePane();
            this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.branchEditor.focus();
            this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:cancel': (event)=>{
                    return this.destroy();
                }
            }));
            return this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:confirm': (event)=>{
                    return this.createBranch();
                }
            }));
        }
        destroy() {
            this.panel.destroy();
            this.disposables.dispose();
            return this.currentPane.activate();
        }
        createBranch() {
            var message, name, repoName;
            this.destroy();
            name = this.branchEditor.getModel().getText();
            if (name.length > 0) {
                message = `checkout to new branch '${name}'`;
                repoName = new Repository(this.repo).getName();
                return git.cmd([
                    'checkout',
                    '-b',
                    name
                ], {
                    cwd: this.repo.getWorkingDirectory()
                }).then((output)=>{
                    ActivityLogger.record({
                        repoName: repoName,
                        message: message,
                        output: output
                    });
                    return git.refresh(this.repo);
                }).catch((err)=>{
                    return ActivityLogger.record({
                        repoName: repoName,
                        message: message,
                        output: err,
                        failed: true
                    });
                });
            }
        }
    };
    module.exports = function(repo) {
        return new InputView(repo);
    };
}).call(module.exports);

});

parcelRegister("2DNX4", function(module, exports) {


var $lppKC = parcelRequire("lppKC");
var $1ec5f8a8f0740fa9$require$git = $lppKC.default;

var $gSFWX = parcelRequire("gSFWX");

var $9JoOT = parcelRequire("9JoOT");
var $1ec5f8a8f0740fa9$require$ActivityLogger = $9JoOT.default;

var $eQF7Z = parcelRequire("eQF7Z");
var $1ec5f8a8f0740fa9$require$Repository = $eQF7Z.default;

var $baLSq = parcelRequire("baLSq");
module.exports = (repo, options = {
    remote: false
})=>{
    const args = options.remote ? [
        'branch',
        '-r',
        '--no-color'
    ] : [
        'branch',
        '--no-color'
    ];
    return $1ec5f8a8f0740fa9$require$git.cmd(args, {
        cwd: repo.getWorkingDirectory()
    }).then((data)=>{
        return new $baLSq(data, ({ name: name })=>{
            const args = options.remote ? [
                'checkout',
                name,
                '--track'
            ] : [
                'checkout',
                name
            ];
            const repoName = new $1ec5f8a8f0740fa9$require$Repository(repo).getName();
            $1ec5f8a8f0740fa9$require$git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }).then((output)=>{
                $1ec5f8a8f0740fa9$require$ActivityLogger.record({
                    repoName: repoName,
                    message: `checkout to ${name}`,
                    output: output
                });
                atom.workspace.getTextEditors().forEach((editor)=>{
                    try {
                        const path = editor.getPath();
                        console.log(`Git-plus: editor.getPath() returned '${path}'`);
                        if (path && path.toString) $dp3SY$fsplus.exists(path.toString(), (exists)=>{
                            if (!exists) editor.destroy();
                        });
                    } catch (error) {
                        $gSFWX.addWarning('There was an error closing windows for non-existing files after the checkout. Please check the dev console.');
                        console.info('Git-plus: please take a screenshot of what has been printed in the console and add it to the issue on github at https://github.com/albert200000/git-plus/issues/139', error);
                    }
                });
                $1ec5f8a8f0740fa9$require$git.refresh(repo);
            }).catch((error)=>{
                $1ec5f8a8f0740fa9$require$ActivityLogger.record({
                    repoName: repoName,
                    message: `checkout to ${name}`,
                    output: error,
                    failed: true
                });
            });
        });
    });
};

});
parcelRegister("baLSq", function(module, exports) {

(function() {
    var $$, ListView, SelectListView;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    module.exports = ListView = class ListView extends SelectListView {
        initialize(data, onConfirm) {
            this.data = data;
            this.onConfirm = onConfirm;
            super.initialize();
            this.addClass('git-branch');
            this.show();
            this.parseData();
            return this.currentPane = atom.workspace.getActivePane();
        }
        parseData() {
            var branches, items;
            items = this.data.split("\n");
            branches = [];
            items.forEach(function(item) {
                var name;
                item = item.replace(/\s/g, '');
                name = item.startsWith("*") ? item.slice(1) : item;
                if (item !== '') return branches.push({
                    name: name
                });
            });
            this.setItems(branches);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'name';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ name: name }) {
            var current;
            current = false;
            if (name.startsWith("*")) {
                name = name.slice(1);
                current = true;
            }
            return $$(function() {
                return this.li(name, ()=>{
                    return this.div({
                        class: 'pull-right'
                    }, ()=>{
                        if (current) return this.span('HEAD');
                    });
                });
            });
        }
        confirmed(item) {
            var ref;
            this.onConfirm(item);
            this.cancel();
            if ((ref = this.currentPane) != null ? ref.isAlive() : void 0) return this.currentPane.activate();
        }
    };
}).call(module.exports);

});


parcelRegister("3O1Aw", function(module, exports) {

var $lppKC = parcelRequire("lppKC");
var $2c5745f95cc29502$require$git = $lppKC.default;

var $gSFWX = parcelRequire("gSFWX");

var $9JoOT = parcelRequire("9JoOT");
var $2c5745f95cc29502$require$ActivityLogger = $9JoOT.default;

var $eQF7Z = parcelRequire("eQF7Z");
var $2c5745f95cc29502$require$Repository = $eQF7Z.default;

var $baLSq = parcelRequire("baLSq");
module.exports = (repo, options = {
    remote: false
})=>{
    const args = options.remote ? [
        'branch',
        '-r',
        '--no-color'
    ] : [
        'branch',
        '--no-color'
    ];
    return $2c5745f95cc29502$require$git.cmd(args, {
        cwd: repo.getWorkingDirectory()
    }).then((data)=>{
        return new $baLSq(data, ({ name: name })=>{
            let args, notification;
            if (options.remote) {
                const remote = name.substring(0, name.indexOf('/'));
                const branch = name.substring(name.indexOf('/') + 1);
                notification = $gSFWX.addInfo(`Deleting remote branch ${branch}`, {
                    dismissable: true
                });
                args = [
                    'push',
                    remote,
                    '--delete',
                    branch
                ];
            } else {
                const branch = name;
                args = [
                    'branch',
                    '-D',
                    branch
                ];
            }
            const message = `delete ${options.remote ? 'remote ' : ''} branch '${args[args.length - 1]}'`;
            const repoName = new $2c5745f95cc29502$require$Repository(repo).getName();
            $2c5745f95cc29502$require$git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }).then((output)=>{
                notification?.dismiss();
                $gSFWX.addSuccess(output);
                $2c5745f95cc29502$require$ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: output
                });
            }).catch((error)=>{
                notification?.dismiss();
                $gSFWX.addError(error);
                $2c5745f95cc29502$require$ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: error,
                    failed: true
                });
            });
        });
    });
};

});

parcelRegister("dcxBF", function(module, exports) {

$parcel$export(module.exports, "default", () => $99c676eeff6e9a85$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
const $99c676eeff6e9a85$var$getCurrentFileInRepo = (repo)=>{
    const activeEditor = atom.workspace.getActiveTextEditor();
    const path = activeEditor && activeEditor.getPath();
    if (!path) return null;
    return repo.relativize(path);
};
var $99c676eeff6e9a85$export$2e2bcd8739ae039 = async (checkoutEverything = false)=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const path = checkoutEverything ? "." : $99c676eeff6e9a85$var$getCurrentFileInRepo(repo) || ".";
    const result = await repo.resetChanges(path);
    (0, $9JoOT.default).record({
        repoName: repo.getName(),
        message: `reset changes in ${path}`,
        ...result
    });
};

});

parcelRegister("77LDn", function(module, exports) {


(function() {
    var CherryPickSelectBranch, git, gitCherryPick;
    git = (parcelRequire("lppKC"));
    CherryPickSelectBranch = (parcelRequire("7CR9r"));
    gitCherryPick = function(repo) {
        var currentHead, head, heads, i, j, len;
        heads = repo.getReferences().heads;
        currentHead = repo.getShortHead();
        for(i = j = 0, len = heads.length; j < len; i = ++j){
            head = heads[i];
            heads[i] = head.replace('refs/heads/', '');
        }
        heads = heads.filter(function(head) {
            return head !== currentHead;
        });
        return new CherryPickSelectBranch(repo, heads, currentHead);
    };
    module.exports = gitCherryPick;
}).call(module.exports);

});
parcelRegister("7CR9r", function(module, exports) {





(function() {
    var $$, BufferedProcess, CherryPickSelectBranch, CherryPickSelectCommits, SelectListView, git, notifier;
    ({ BufferedProcess: BufferedProcess } = $dp3SY$atom);
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    CherryPickSelectCommits = (parcelRequire("eW2H2"));
    module.exports = CherryPickSelectBranch = class CherryPickSelectBranch extends SelectListView {
        initialize(repo, items, currentHead) {
            this.repo = repo;
            this.currentHead = currentHead;
            super.initialize();
            this.show();
            this.setItems(items);
            return this.focusFilterEditor();
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item) {
            return $$(function() {
                return this.li(item);
            });
        }
        confirmed(item) {
            var args;
            this.cancel();
            args = [
                'log',
                '--cherry-pick',
                '-z',
                '--format=%H%n%an%n%ar%n%s',
                `${this.currentHead}...${item}`
            ];
            return git.cmd(args, {
                cwd: this.repo.getWorkingDirectory()
            }).then((save)=>{
                if (save.length > 0) return new CherryPickSelectCommits(this.repo, save.split('\0').slice(0, -1));
                else return notifier.addInfo("No commits available to cherry-pick.");
            });
        }
    };
}).call(module.exports);

});
parcelRegister("eW2H2", function(module, exports) {






(function() {
    var $, $$, ActivityLogger, CherryPickSelectCommits, Repository, SelectListMultipleView, git, notifier;
    ({ $: $, $$: $$ } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    SelectListMultipleView = (parcelRequire("35foq"));
    module.exports = CherryPickSelectCommits = class CherryPickSelectCommits extends SelectListMultipleView {
        initialize(repo, data) {
            var item;
            this.repo = repo;
            super.initialize();
            this.show();
            this.setItems(function() {
                var i, len, results;
                results = [];
                for(i = 0, len = data.length; i < len; i++){
                    item = data[i];
                    item = item.split('\n');
                    results.push({
                        hash: item[0],
                        author: item[1],
                        time: item[2],
                        subject: item[3]
                    });
                }
                return results;
            }());
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'hash';
        }
        addButtons() {
            var viewButton;
            viewButton = $$(function() {
                return this.div({
                    class: 'buttons'
                }, ()=>{
                    this.span({
                        class: 'pull-left'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight btn-cancel-button'
                        }, 'Cancel');
                    });
                    return this.span({
                        class: 'pull-right'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight btn-pick-button'
                        }, 'Cherry-Pick!');
                    });
                });
            });
            viewButton.appendTo(this);
            return this.on('click', 'button', ({ target: target })=>{
                if ($(target).hasClass('btn-pick-button')) this.complete();
                if ($(target).hasClass('btn-cancel-button')) return this.cancel();
            });
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item, matchedStr) {
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'text-highlight inline-block pull-right',
                        style: 'font-family: monospace'
                    }, ()=>{
                        if (matchedStr != null) return this.raw(matchedStr);
                        else return this.span(item.hash);
                    });
                    this.div({
                        class: 'text-info'
                    }, `${item.author}, ${item.time}`);
                    return this.div({
                        class: 'text-warning'
                    }, item.subject);
                });
            });
        }
        completed(items) {
            var commits, message, repoName;
            this.cancel();
            commits = items.map(function(item) {
                return item.hash;
            });
            message = `cherry pick commits: ${commits.join(' ')}`;
            repoName = new Repository(this.repo).getName();
            return git.cmd([
                'cherry-pick'
            ].concat(commits), {
                cwd: this.repo.getWorkingDirectory()
            }).then(function(msg) {
                notifier.addSuccess(msg);
                return ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: msg
                });
            }).catch(function(msg) {
                notifier.addError(msg);
                return ActivityLogger.record({
                    repoName: repoName,
                    message: message,
                    output: msg,
                    failed: true
                });
            });
        }
    };
}).call(module.exports);

});
parcelRegister("35foq", function(module, exports) {


(function() {
    var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, indexOf = [].indexOf;
    fuzzyFilter = $dp3SY$fuzzaldrin.filter;
    ({ $: $, $$: $$, View: View, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    // Public: Provides a view that renders a list of items with an editor that
    // filters the items. Enables you to select multiple items at once.
    // Subclasses must implement the following methods:
    // * {::viewForItem}
    // * {::completed}
    // Subclasses should implement the following methods:
    // * {::addButtons}
    // ## Requiring in packages
    // ```coffee
    // {SelectListMultipleView} = require 'atom'
    // class MySelectListView extends SelectListMultipleView
    //   initialize: ->
    //     super()
    //     @addClass('overlay from-top')
    //     @setItems(['Hello', 'World'])
    //     atom.workspaceView.append(this)
    //     @focusFilterEditor()
    //   viewForItem: (item) ->
    //     "<li>#{item}</li>"
    //   completed: (items) ->
    //     console.log("#{items} were selected")
    // ```
    module.exports = SelectListMultipleView = class SelectListMultipleView extends SelectListView {
        // This method can be overridden by subclasses but `super` should always
        // be called.
        initialize() {
            super.initialize();
            this.selectedItems = [];
            this.list.addClass('mark-active');
            this.on('mousedown', ({ target: target })=>{
                if (target === this.list[0] || $(target).hasClass('btn')) return false;
            });
            this.on('keypress', ({ keyCode: keyCode, ctrlKey: ctrlKey, shiftKey: shiftKey })=>{
                if (keyCode === 13 && (ctrlKey || shiftKey)) return this.complete();
            });
            return this.addButtons();
        }
        // Public: Function to add buttons to the SelectListMultipleView.
        // This method can be overridden by subclasses.
        // ### Important
        // There must always be a button to call the function `@complete()` to
        // confirm the selections!
        // #### Example (Default)
        // ```coffee
        // addButtons: ->
        //   viewButton = $$ ->
        //     @div class: 'buttons', =>
        //       @span class: 'pull-left', =>
        //         @button class: 'btn btn-error inline-block-tight btn-cancel-button', 'Cancel'
        //       @span class: 'pull-right', =>
        //         @button class: 'btn btn-success inline-block-tight btn-complete-button', 'Confirm'
        //   viewButton.appendTo(this)
        //   @on 'click', 'button', ({target}) =>
        //     @complete() if $(target).hasClass('btn-complete-button')
        //     @cancel() if $(target).hasClass('btn-cancel-button')
        // ```
        addButtons() {
            var viewButton;
            viewButton = $$(function() {
                return this.div({
                    class: 'buttons'
                }, ()=>{
                    this.span({
                        class: 'pull-left'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight btn-cancel-button'
                        }, 'Cancel');
                    });
                    return this.span({
                        class: 'pull-right'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight btn-complete-button'
                        }, 'Confirm');
                    });
                });
            });
            viewButton.appendTo(this);
            return this.on('click', 'button', ({ target: target })=>{
                if ($(target).hasClass('btn-complete-button')) this.complete();
                if ($(target).hasClass('btn-cancel-button')) return this.cancel();
            });
        }
        confirmSelection() {
            var item, viewItem;
            item = this.getSelectedItem();
            viewItem = this.getSelectedItemView();
            if (viewItem != null) return this.confirmed(item, viewItem);
            else return this.cancel();
        }
        confirmed(item, viewItem) {
            if (indexOf.call(this.selectedItems, item) >= 0) {
                this.selectedItems = this.selectedItems.filter(function(i) {
                    return i !== item;
                });
                return viewItem.removeClass('active');
            } else {
                this.selectedItems.push(item);
                return viewItem.addClass('active');
            }
        }
        complete() {
            if (this.selectedItems.length > 0) return this.completed(this.selectedItems);
            else return this.cancel();
        }
        // Public: Populate the list view with the model items previously set by
        //         calling {::setItems}.
        // Subclasses may override this method but should always call `super`.
        populateList() {
            var filterQuery, filteredItems, i, item, itemView, j, options, ref, ref1, ref2;
            if (this.items == null) return;
            filterQuery = this.getFilterQuery();
            if (filterQuery.length) {
                options = {
                    key: this.getFilterKey()
                };
                filteredItems = fuzzyFilter(this.items, filterQuery, options);
            } else filteredItems = this.items;
            this.list.empty();
            if (filteredItems.length) {
                this.setError(null);
                for(i = j = 0, ref = Math.min(filteredItems.length, this.maxItems); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j){
                    item = (ref1 = filteredItems[i].original) != null ? ref1 : filteredItems[i];
                    itemView = $(this.viewForItem(item, (ref2 = filteredItems[i].string) != null ? ref2 : null));
                    itemView.data('select-list-item', item);
                    if (indexOf.call(this.selectedItems, item) >= 0) itemView.addClass('active');
                    this.list.append(itemView);
                }
                return this.selectItemView(this.list.find('li:first'));
            } else return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
        }
        // Public: Create a view for the given model item.
        // This method must be overridden by subclasses.
        // This is called when the item is about to appended to the list view.
        // item          - The model item being rendered. This will always be one of
        //                 the items previously passed to {::setItems}.
        // matchedStr - The fuzzy highlighted string.
        // Returns a String of HTML, DOM element, jQuery object, or View.
        viewForItem(item, matchedStr) {
            throw new Error("Subclass must implement a viewForItem(item) method");
        }
        // Public: Callback function for when the complete button is pressed.
        // This method must be overridden by subclasses.
        // items - An {Array} containing the selected items. This will always be one
        //         of the items previously passed to {::setItems}.
        // Returns a DOM element, jQuery object, or {View}.
        completed(items) {
            throw new Error("Subclass must implement a completed(items) method");
        }
    };
}).call(module.exports);

});




parcelRegister("3mGsE", function(module, exports) {










(function() {
    var ActivityLogger, CompositeDisposable, GitPull, GitPush, Path, Repository, cleanup, commit, destroyCommitEditor, disposables, emoji, fs, getStagedFiles, getTemplate, git, notifier, prepFile, scissorsLine, showFile, trimFile, verboseCommitsEnabled;
    Path = $dp3SY$path;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    fs = $dp3SY$fsplus;
    emoji = $dp3SY$nodeemoji;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    GitPush = (parcelRequire("4Hko4"));
    GitPull = (parcelRequire("fixkc"));
    disposables = new CompositeDisposable();
    verboseCommitsEnabled = function() {
        return atom.config.get('pulsar-git-plus.commits.verboseCommits');
    };
    scissorsLine = '------------------------ >8 ------------------------';
    getStagedFiles = function(repo) {
        return git.stagedFiles(repo).then(function(files) {
            if (files.length >= 1) return git.cmd([
                '-c',
                'color.ui=false',
                'status'
            ], {
                cwd: repo.getWorkingDirectory()
            });
            else return Promise.reject("Nothing to commit.");
        });
    };
    getTemplate = function(filePath) {
        var e;
        if (filePath) try {
            return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
        } catch (error) {
            e = error;
            throw new Error("Your configured commit template file can't be found.");
        }
        else return '';
    };
    prepFile = function({ status: status, filePath: filePath, diff: diff, commentChar: commentChar, template: template }) {
        var commitEditor, content, cwd, indexOfComments, ref, text;
        if (commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0) {
            text = commitEditor.getText();
            indexOfComments = text.indexOf(commentChar);
            if (indexOfComments > 0) template = text.substring(0, indexOfComments - 1);
        }
        cwd = Path.dirname(filePath);
        status = status.replace(/\s*\(.*\)\n/g, "\n");
        status = status.trim().replace(/\n/g, `\n${commentChar} `);
        content = `${template}
${commentChar} ${scissorsLine}
${commentChar} Do not touch the line above.
${commentChar} Everything below will be removed.
${commentChar} Please enter the commit message for your changes. Lines starting
${commentChar} with '${commentChar}' will be ignored, and an empty message aborts the commit.
${commentChar}
${commentChar} ${status}`;
        if (diff) content += `\n${commentChar}
${diff}`;
        return fs.writeFileSync(filePath, content);
    };
    destroyCommitEditor = function(filePath) {
        var ref;
        return (ref = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref.destroy() : void 0;
    };
    trimFile = function(filePath, commentChar) {
        var content, cwd, findScissorsLine, startOfComments;
        findScissorsLine = function(line) {
            return line.includes(`${commentChar} ${scissorsLine}`);
        };
        cwd = Path.dirname(filePath);
        content = fs.readFileSync(fs.absolute(filePath)).toString();
        startOfComments = content.indexOf(content.split('\n').find(findScissorsLine));
        content = startOfComments > 0 ? content.substring(0, startOfComments) : content;
        return fs.writeFileSync(filePath, content);
    };
    commit = function(repo, filePath) {
        var repoName;
        repoName = new Repository(repo).getName();
        return git.cmd([
            'commit',
            "--cleanup=whitespace",
            `--file=${filePath}`
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            ActivityLogger.record({
                repoName: repoName,
                message: 'commit',
                output: emoji.emojify(data)
            });
            destroyCommitEditor(filePath);
            return git.refresh();
        }).catch(function(data) {
            ActivityLogger.record({
                repoName: repoName,
                message: 'commit',
                output: data,
                failed: true
            });
            return destroyCommitEditor(filePath);
        });
    };
    cleanup = function(currentPane) {
        if (currentPane.isAlive()) currentPane.activate();
        return disposables.dispose();
    };
    showFile = function(filePath) {
        var commitEditor, ref, splitDirection;
        commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
        if (!commitEditor) {
            if (atom.config.get('pulsar-git-plus.general.openInPane')) {
                splitDirection = atom.config.get('pulsar-git-plus.general.splitPane');
                atom.workspace.getCenter().getActivePane()[`split${splitDirection}`]();
            }
            return atom.workspace.open(filePath);
        } else {
            if (atom.config.get('pulsar-git-plus.general.openInPane')) atom.workspace.paneForURI(filePath).activate();
            else atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
            return Promise.resolve(commitEditor);
        }
    };
    module.exports = function(repo, { stageChanges: stageChanges, andPush: andPush } = {}) {
        var commentChar, currentPane, e, filePath, init, ref, startCommit, template;
        filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
        currentPane = atom.workspace.getActivePane();
        commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
        try {
            template = getTemplate(git.getConfig(repo, 'commit.template'));
        } catch (error) {
            e = error;
            notifier.addError(e.message);
            return Promise.reject(e.message);
        }
        init = function() {
            return getStagedFiles(repo).then(function(status) {
                var args;
                if (verboseCommitsEnabled()) {
                    args = [
                        'diff',
                        '--color=never',
                        '--staged'
                    ];
                    if (atom.config.get('pulsar-git-plus.diffs.wordDiff')) args.push('--word-diff');
                    return git.cmd(args, {
                        cwd: repo.getWorkingDirectory()
                    }).then(function(diff) {
                        return prepFile({
                            status: status,
                            filePath: filePath,
                            diff: diff,
                            commentChar: commentChar,
                            template: template
                        });
                    });
                } else return prepFile({
                    status: status,
                    filePath: filePath,
                    commentChar: commentChar,
                    template: template
                });
            });
        };
        startCommit = function() {
            return showFile(filePath).then(function(textEditor) {
                disposables.dispose();
                disposables = new CompositeDisposable();
                disposables.add(textEditor.onDidSave(function() {
                    trimFile(filePath, commentChar);
                    return commit(repo, filePath).then(function() {
                        if (andPush) return GitPush(repo);
                    });
                }));
                return disposables.add(textEditor.onDidDestroy(function() {
                    return cleanup(currentPane);
                }));
            }).catch(notifier.addError);
        };
        if (stageChanges) return git.add(repo, {
            update: true
        }).then(init).then(startCommit);
        else return init().then(function() {
            return startCommit();
        }).catch(function(message) {
            if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) return startCommit();
            else return notifier.addInfo(message);
        });
    };
}).call(module.exports);

});
parcelRegister("4Hko4", function(module, exports) {


(function() {
    var RemoteListView, git;
    git = (parcelRequire("lppKC"));
    RemoteListView = (parcelRequire("Bryup"));
    module.exports = function(repo, { setUpstream: setUpstream } = {}) {
        return git.cmd([
            'remote'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            var mode;
            mode = setUpstream ? 'push -u' : 'push';
            return new RemoteListView(repo, data, {
                mode: mode
            });
        });
    };
}).call(module.exports);

});
parcelRegister("Bryup", function(module, exports) {







(function() {
    var $$, ActivityLogger, ListView, RemoteBranchListView, Repository, SelectListView, _pull, git, notifier;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    _pull = (parcelRequire("7arPR"));
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    RemoteBranchListView = (parcelRequire("kVpWz"));
    module.exports = ListView = class ListView extends SelectListView {
        initialize(repo, data1, { mode: mode, tag: tag, extraArgs: extraArgs1 } = {}) {
            this.repo = repo;
            this.data = data1;
            this.mode = mode;
            this.tag = tag;
            this.extraArgs = extraArgs1;
            super.initialize();
            if (this.tag == null) this.tag = '';
            if (this.extraArgs == null) this.extraArgs = [];
            this.show();
            this.parseData();
            return this.result = new Promise((resolve1, reject1)=>{
                this.resolve = resolve1;
                this.reject = reject1;
            });
        }
        parseData() {
            var items, remotes;
            items = this.data.split("\n");
            remotes = items.filter(function(item) {
                return item !== '';
            }).map(function(item) {
                return {
                    name: item
                };
            });
            if (remotes.length === 1) return this.confirmed(remotes[0]);
            else {
                this.setItems(remotes);
                return this.focusFilterEditor();
            }
        }
        getFilterKey() {
            return 'name';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ name: name }) {
            return $$(function() {
                return this.li(name);
            });
        }
        pull(remoteName) {
            if (atom.config.get('pulsar-git-plus.remoteInteractions.promptForBranch')) return git.cmd([
                'branch',
                '--no-color',
                '-r'
            ], {
                cwd: this.repo.getWorkingDirectory()
            }).then((data)=>{
                return new Promise((resolve, reject)=>{
                    return new RemoteBranchListView(data, remoteName, ({ name: name })=>{
                        var args, branchName, repoName, startMessage;
                        branchName = name.substring(name.indexOf('/') + 1);
                        startMessage = notifier.addInfo("Pulling...", {
                            dismissable: true
                        });
                        args = [
                            'pull'
                        ].concat(this.extraArgs, remoteName, branchName).filter(function(arg) {
                            return arg !== '';
                        });
                        repoName = new Repository(this.repo).getName();
                        return git.cmd(args, {
                            cwd: this.repo.getWorkingDirectory()
                        }, {
                            color: true
                        }).then((data)=>{
                            resolve(branchName);
                            repoName = new Repository(this.repo).getName();
                            ActivityLogger.record({
                                repoName: repoName,
                                message: args.join(' '),
                                output: data
                            });
                            startMessage.dismiss();
                            return git.refresh(this.repo);
                        }).catch((error)=>{
                            reject();
                            ActivityLogger.record({
                                repoName: repoName,
                                message: args.join(' '),
                                output: error,
                                failed: true
                            });
                            return startMessage.dismiss();
                        });
                    });
                });
            });
            else return _pull(this.repo, {
                extraArgs: this.extraArgs
            });
        }
        confirmed({ name: name }) {
            var pullBeforePush;
            if (this.mode === 'pull') this.pull(name);
            else if (this.mode === 'fetch-prune') {
                this.mode = 'fetch';
                this.execute(name, '--prune');
            } else if (this.mode === 'push') {
                pullBeforePush = atom.config.get('pulsar-git-plus.remoteInteractions.pullBeforePush');
                if (pullBeforePush && atom.config.get('pulsar-git-plus.remoteInteractions.pullRebase')) this.extraArgs = '--rebase';
                if (pullBeforePush) this.pull(name).then((branch)=>{
                    return this.execute(name, null, branch);
                });
                else this.execute(name);
            } else if (this.mode === 'push -u') this.pushAndSetUpstream(name);
            else this.execute(name);
            return this.cancel();
        }
        execute(remote = '', extraArgs = '', branch) {
            var args, message, repoName, startMessage;
            if (atom.config.get('pulsar-git-plus.remoteInteractions.promptForBranch')) {
                if (branch != null) {
                    args = [
                        this.mode
                    ];
                    if (extraArgs.length > 0) args.push(extraArgs);
                    args = args.concat([
                        remote,
                        branch
                    ]);
                    message = `${this.mode[0].toUpperCase() + this.mode.substring(1)}ing...`;
                    startMessage = notifier.addInfo(message, {
                        dismissable: true
                    });
                    return git.cmd(args, {
                        cwd: this.repo.getWorkingDirectory()
                    }, {
                        color: true
                    }).then((data)=>{
                        startMessage.dismiss();
                        return git.refresh(this.repo);
                    }).catch((data)=>{
                        return startMessage.dismiss();
                    });
                } else return git.cmd([
                    'branch',
                    '--no-color',
                    '-r'
                ], {
                    cwd: this.repo.getWorkingDirectory()
                }).then((data)=>{
                    return new RemoteBranchListView(data, remote, ({ name: name })=>{
                        var branchName, repoName;
                        branchName = name.substring(name.indexOf('/') + 1);
                        startMessage = notifier.addInfo("Pushing...", {
                            dismissable: true
                        });
                        args = [
                            'push'
                        ].concat(extraArgs, remote, branchName).filter(function(arg) {
                            return arg !== '';
                        });
                        repoName = new Repository(this.repo).getName();
                        return git.cmd(args, {
                            cwd: this.repo.getWorkingDirectory()
                        }, {
                            color: true
                        }).then((data)=>{
                            ActivityLogger.record({
                                repoName: repoName,
                                message: args.join(' '),
                                output: data
                            });
                            startMessage.dismiss();
                            return git.refresh(this.repo);
                        }).catch((error)=>{
                            ActivityLogger.record({
                                repoName: repoName,
                                message: args.join(' '),
                                output: error,
                                failed: true
                            });
                            return startMessage.dismiss();
                        });
                    });
                });
            } else {
                args = [
                    this.mode
                ];
                if (extraArgs.length > 0) args.push(extraArgs);
                args = args.concat([
                    remote,
                    this.tag
                ]).filter(function(arg) {
                    return arg !== '';
                });
                message = `${this.mode[0].toUpperCase() + this.mode.substring(1)}ing...`;
                startMessage = notifier.addInfo(message, {
                    dismissable: true
                });
                repoName = new Repository(this.repo).getName();
                return git.cmd(args, {
                    cwd: this.repo.getWorkingDirectory()
                }, {
                    color: true
                }).then((data)=>{
                    ActivityLogger.record({
                        repoName: repoName,
                        message: args.join(' '),
                        output: data
                    });
                    startMessage.dismiss();
                    return git.refresh(this.repo);
                }).catch((data)=>{
                    ActivityLogger.record({
                        repoName: repoName,
                        message: args.join(' '),
                        output: data,
                        failed: true
                    });
                    return startMessage.dismiss();
                });
            }
        }
        pushAndSetUpstream(remote = '') {
            var args, message, repoName, startMessage;
            args = [
                'push',
                '-u',
                remote,
                'HEAD'
            ].filter(function(arg) {
                return arg !== '';
            });
            message = "Pushing...";
            startMessage = notifier.addInfo(message, {
                dismissable: true
            });
            repoName = new Repository(this.repo).getName();
            return git.cmd(args, {
                cwd: this.repo.getWorkingDirectory()
            }, {
                color: true
            }).then(function(data) {
                ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data
                });
                return startMessage.dismiss();
            }).catch((data)=>{
                ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data,
                    failed: true
                });
                return startMessage.dismiss();
            });
        }
    };
}).call(module.exports);

});
parcelRegister("7arPR", function(module, exports) {




(function() {
    var ActivityLogger, Repository, emptyOrUndefined, getUpstream, git, notifier;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    emptyOrUndefined = function(thing) {
        return thing !== '' && thing !== void 0;
    };
    getUpstream = function(repo) {
        var branch, branchInfo, ref, remote;
        branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring(13).split('/') : void 0;
        if (!branchInfo) return null;
        remote = branchInfo[0];
        branch = branchInfo.slice(1).join('/');
        return [
            remote,
            branch
        ];
    };
    module.exports = function(repo, { extraArgs: extraArgs } = {}) {
        var args, recordMessage, repoName, startMessage, upstream;
        if (upstream = getUpstream(repo)) {
            if (typeof extraArgs === 'string') extraArgs = [
                extraArgs
            ];
            if (extraArgs == null) extraArgs = [];
            startMessage = notifier.addInfo("Pulling...", {
                dismissable: true
            });
            recordMessage = `pull ${extraArgs.join(' ')}`;
            args = [
                'pull'
            ].concat(extraArgs).concat(upstream).filter(emptyOrUndefined);
            repoName = new Repository(repo).getName();
            return git.cmd(args, {
                cwd: repo.getWorkingDirectory()
            }, {
                color: true
            }).then(function(output) {
                ActivityLogger.record({
                    message: recordMessage,
                    output: output,
                    repoName: repoName
                });
                return startMessage.dismiss();
            }).catch(function(output) {
                ActivityLogger.record({
                    message: recordMessage,
                    output: output,
                    repoName: repoName,
                    failed: true
                });
                return startMessage.dismiss();
            });
        } else return notifier.addInfo('The current branch is not tracking from upstream');
    };
}).call(module.exports);

});

parcelRegister("kVpWz", function(module, exports) {

(function() {
    var BranchListView, RemoteBranchListView, isValidBranch;
    BranchListView = (parcelRequire("baLSq"));
    isValidBranch = function(item, remote) {
        return item.startsWith(remote + '/') && !item.includes('/HEAD');
    };
    module.exports = RemoteBranchListView = class RemoteBranchListView extends BranchListView {
        initialize(data, remote1, onConfirm) {
            this.remote = remote1;
            return super.initialize(data, onConfirm);
        }
        parseData() {
            var branches, items;
            items = this.data.split("\n").map(function(item) {
                return item.replace(/\s/g, '');
            });
            branches = items.filter((item)=>{
                return isValidBranch(item, this.remote);
            }).map(function(item) {
                return {
                    name: item
                };
            });
            if (branches.length === 1) this.confirmed(branches[0]);
            else this.setItems(branches);
            return this.focusFilterEditor();
        }
    };
}).call(module.exports);

});



parcelRegister("fixkc", function(module, exports) {



(function() {
    var RemoteListView, git, pull;
    git = (parcelRequire("lppKC"));
    pull = (parcelRequire("7arPR"));
    RemoteListView = (parcelRequire("Bryup"));
    module.exports = function(repo) {
        var extraArgs;
        extraArgs = atom.config.get('pulsar-git-plus.remoteInteractions.pullRebase') ? [
            '--rebase'
        ] : [];
        if (atom.config.get('pulsar-git-plus.remoteInteractions.pullAutostash')) extraArgs.push('--autostash');
        if (atom.config.get('pulsar-git-plus.remoteInteractions.promptForBranch')) return git.cmd([
            'remote'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return new RemoteListView(repo, data, {
                mode: 'pull',
                extraArgs: extraArgs
            }).result;
        });
        else return pull(repo, {
            extraArgs: extraArgs
        });
    };
}).call(module.exports);

});


parcelRegister("bXxVi", function(module, exports) {







(function() {
    var ActivityLogger, CompositeDisposable, Path, Repository, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile, indexOf = [].indexOf;
    Path = $dp3SY$path;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    fs = $dp3SY$fsplus;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    disposables = new CompositeDisposable();
    prettifyStagedFiles = function(data) {
        var i, mode;
        if (data === '') return [];
        data = data.split(/\0/).slice(0, -1);
        return function() {
            var j, len, results;
            results = [];
            for(i = j = 0, len = data.length; j < len; i = j += 2){
                mode = data[i];
                results.push({
                    mode: mode,
                    path: data[i + 1]
                });
            }
            return results;
        }();
    };
    prettyifyPreviousFile = function(data) {
        return {
            mode: data[0],
            path: data.substring(1).trim()
        };
    };
    prettifyFileStatuses = function(files) {
        return files.map(function({ mode: mode, path: path }) {
            switch(mode){
                case 'M':
                    return `modified:   ${path}`;
                case 'A':
                    return `new file:   ${path}`;
                case 'D':
                    return `deleted:   ${path}`;
                case 'R':
                    return `renamed:   ${path}`;
            }
        });
    };
    getStagedFiles = function(repo) {
        return git.stagedFiles(repo).then(function(files) {
            var args;
            if (files.length >= 1) {
                args = [
                    'diff-index',
                    '--no-color',
                    '--cached',
                    'HEAD',
                    '--name-status',
                    '-z'
                ];
                return git.cmd(args, {
                    cwd: repo.getWorkingDirectory()
                }).then(function(data) {
                    return prettifyStagedFiles(data);
                });
            } else return Promise.resolve([]);
        });
    };
    getGitStatus = function(repo) {
        return git.cmd([
            '-c',
            'color.ui=false',
            'status'
        ], {
            cwd: repo.getWorkingDirectory()
        });
    };
    diffFiles = function(previousFiles, currentFiles) {
        var currentPaths;
        previousFiles = previousFiles.map(function(p) {
            return prettyifyPreviousFile(p);
        });
        currentPaths = currentFiles.map(function({ path: path }) {
            return path;
        });
        return previousFiles.filter(function(p) {
            var ref;
            return (ref = p.path, indexOf.call(currentPaths, ref) >= 0) === false;
        });
    };
    parse = function(prevCommit) {
        var firstSpliting, message, prevChangedFiles, replacerRegex, statusRegex;
        statusRegex = /\n{2,}((?:(?::\w{6} \w{6}(?: \w{7}\.{3}){2} [ MADRCU?!]\s+.+?\n?))*)$/;
        firstSpliting = statusRegex.exec(prevCommit);
        if (firstSpliting != null) {
            message = prevCommit.substring(0, firstSpliting.index);
            replacerRegex = /^:\w{6} \w{6}(?: \w{7}\.{3}){2} ([ MADRCU?!].+)$/gm;
            prevChangedFiles = firstSpliting[1].trim().replace(replacerRegex, "$1").split('\n');
        } else {
            message = prevCommit.trim();
            prevChangedFiles = [];
        }
        return {
            message: message,
            prevChangedFiles: prevChangedFiles
        };
    };
    cleanupUnstagedText = function(status) {
        var text, unstagedFiles;
        unstagedFiles = status.indexOf("Changes not staged for commit:");
        if (unstagedFiles >= 0) {
            text = status.substring(unstagedFiles);
            return status = `${status.substring(0, unstagedFiles - 1)}\n${text.replace(/\s*\(.*\)\n/g, "")}`;
        } else return status;
    };
    prepFile = function({ commentChar: commentChar, message: message, prevChangedFiles: prevChangedFiles, status: status, filePath: filePath }) {
        var currentChanges, nothingToCommit, replacementText, textToReplace;
        status = cleanupUnstagedText(status);
        status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, `\n${commentChar} `);
        if (prevChangedFiles.length > 0) {
            nothingToCommit = "nothing to commit, working directory clean";
            currentChanges = `committed:\n${commentChar}`;
            textToReplace = null;
            if (status.indexOf(nothingToCommit) > -1) textToReplace = nothingToCommit;
            else if (status.indexOf(currentChanges) > -1) textToReplace = currentChanges;
            replacementText = `committed:
${prevChangedFiles.map(function(f) {
                return `${commentChar}   ${f}`;
            }).join("\n")}`;
            status = status.replace(textToReplace, replacementText);
        }
        return fs.writeFileSync(filePath, `${message}
${commentChar} Please enter the commit message for your changes. Lines starting
${commentChar} with '${commentChar}' will be ignored, and an empty message aborts the commit.
${commentChar}
${commentChar} ${status}`);
    };
    showFile = function(filePath) {
        var commitEditor, ref, splitDirection;
        commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
        if (!commitEditor) {
            if (atom.config.get('pulsar-git-plus.general.openInPane')) {
                splitDirection = atom.config.get('pulsar-git-plus.general.splitPane');
                atom.workspace.getCenter().getActivePane()[`split${splitDirection}`]();
            }
            return atom.workspace.open(filePath);
        } else {
            if (atom.config.get('pulsar-git-plus.general.openInPane')) atom.workspace.paneForURI(filePath).activate();
            else atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
            return Promise.resolve(commitEditor);
        }
    };
    destroyCommitEditor = function(filePath) {
        var ref;
        return (ref = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref.destroy() : void 0;
    };
    commit = function(repo, filePath) {
        var args, repoName;
        args = [
            'commit',
            '--amend',
            '--cleanup=strip',
            `--file=${filePath}`
        ];
        repoName = new Repository(repo).getName();
        return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            ActivityLogger.record({
                repoName: repoName,
                message: 'commit',
                output: data
            });
            destroyCommitEditor(filePath);
            return git.refresh();
        }).catch(function(data) {
            ActivityLogger.record({
                repoName: repoName,
                message: 'commit',
                output: data,
                failed: true
            });
            return destroyCommitEditor(filePath);
        });
    };
    cleanup = function(currentPane, filePath) {
        if (currentPane.isAlive()) currentPane.activate();
        return disposables.dispose();
    };
    module.exports = function(repo) {
        var commentChar, currentPane, cwd, filePath, ref;
        currentPane = atom.workspace.getActivePane();
        filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
        cwd = repo.getWorkingDirectory();
        commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
        return git.cmd([
            'whatchanged',
            '-1',
            '--format=%B'
        ], {
            cwd: cwd
        }).then(function(amend) {
            return parse(amend);
        }).then(function({ message: message, prevChangedFiles: prevChangedFiles }) {
            return getStagedFiles(repo).then(function(files) {
                prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
                return {
                    message: message,
                    prevChangedFiles: prevChangedFiles
                };
            });
        }).then(function({ message: message, prevChangedFiles: prevChangedFiles }) {
            return getGitStatus(repo).then(function(status) {
                return prepFile({
                    commentChar: commentChar,
                    message: message,
                    prevChangedFiles: prevChangedFiles,
                    status: status,
                    filePath: filePath
                });
            }).then(function() {
                return showFile(filePath);
            });
        }).then(function(textEditor) {
            disposables.add(textEditor.onDidSave(function() {
                return commit(repo, filePath);
            }));
            return disposables.add(textEditor.onDidDestroy(function() {
                return cleanup(currentPane, filePath);
            }));
        }).catch(function(msg) {
            return notifier.addInfo(msg);
        });
    };
}).call(module.exports);

});

parcelRegister("7c2RU", function(module, exports) {


(function() {
    var git, notifier;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    module.exports = async function(repo, { diffStat: diffStat, file: file } = {}) {
        var ref, stagingStatus;
        if (file == null) file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
        if (!file) return notifier.addError("No open file. Select 'Diff All'.");
        stagingStatus = await git.getStagingStatus(repo, file);
        return atom.workspace.open(`atom-github://file-patch/${encodeURIComponent(file)}?workdir=${encodeURIComponent(repo.getWorkingDirectory())}&stagingStatus=${encodeURIComponent(stagingStatus)}`);
    };
}).call(module.exports);

});

parcelRegister("3Pi7d", function(module, exports) {





(function() {
    var BranchListView, Path, fs, git, nothingToShow, notifier, prepFile, showFile;
    Path = $dp3SY$path;
    fs = $dp3SY$fsplus;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    BranchListView = (parcelRequire("baLSq"));
    nothingToShow = 'Nothing to show.';
    showFile = function(filePath) {
        var splitDirection;
        if (atom.config.get('pulsar-git-plus.general.openInPane')) {
            splitDirection = atom.config.get('pulsar-git-plus.general.splitPane');
            atom.workspace.getCenter().getActivePane()[`split${splitDirection}`]();
        }
        return atom.workspace.open(filePath);
    };
    prepFile = function(text, filePath) {
        return new Promise(function(resolve, reject) {
            if ((text != null ? text.length : void 0) === 0) return reject(nothingToShow);
            else return fs.writeFile(filePath, text, {
                flag: 'w+'
            }, function(err) {
                if (err) return reject(err);
                else return resolve(true);
            });
        });
    };
    module.exports = function(repo) {
        var disposable;
        disposable = null;
        return git.cmd([
            'branch',
            '--no-color'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return new BranchListView(data, function({ name: name }) {
                var args, branchName;
                branchName = name;
                args = [
                    'diff',
                    '--stat',
                    repo.branch,
                    name
                ];
                return git.cmd(args, {
                    cwd: repo.getWorkingDirectory()
                }).then(function(data) {
                    var diffFilePath, diffStat;
                    diffStat = data;
                    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
                    args = [
                        'diff',
                        '--color=never',
                        repo.branch,
                        name
                    ];
                    if (atom.config.get('pulsar-git-plus.diffs.wordDiff')) args.push('--word-diff');
                    return git.cmd(args, {
                        cwd: repo.getWorkingDirectory()
                    }).then(function(data) {
                        return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
                    }).then(function() {
                        return showFile(diffFilePath);
                    }).then(function(textEditor) {
                        return disposable = textEditor.onDidDestroy(function() {
                            fs.unlink(diffFilePath);
                            return disposable != null ? disposable.dispose() : void 0;
                        });
                    }).catch((err)=>{
                        if (err === nothingToShow) return notifier.addInfo(err);
                        else return notifier.addError(err);
                    });
                });
            });
        });
    };
}).call(module.exports);

});

parcelRegister("hD9Pz", function(module, exports) {




(function() {
    var BranchListView, DiffBranchFilesView, git, notifier;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    BranchListView = (parcelRequire("baLSq"));
    DiffBranchFilesView = (parcelRequire("hG3X1"));
    module.exports = function(repo, filePath) {
        return git.cmd([
            'branch',
            '--no-color'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(branches) {
            return new BranchListView(branches, function({ name: name }) {
                var args, branchName;
                branchName = name;
                args = [
                    'diff',
                    '--name-status',
                    repo.branch,
                    branchName
                ];
                return git.cmd(args, {
                    cwd: repo.getWorkingDirectory()
                }).then(function(diffData) {
                    return new DiffBranchFilesView(repo, diffData, branchName, filePath);
                }).catch(notifier.addError);
            });
        });
    };
}).call(module.exports);

});
parcelRegister("hG3X1", function(module, exports) {









(function() {
    var $$, CompositeDisposable, DiffBranchFilesListView, GitDiff, Path, RevisionView, SelectListView, StatusListView, disposables, fs, git, notifier, prepFile, showFile;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    fs = $dp3SY$fsplus;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    StatusListView = (parcelRequire("6nXTe"));
    GitDiff = (parcelRequire("7c2RU"));
    Path = $dp3SY$path;
    RevisionView = (parcelRequire("eZTKA"));
    disposables = new CompositeDisposable();
    showFile = function(filePath) {
        var splitDirection;
        if (atom.config.get('pulsar-git-plus.general.openInPane')) {
            splitDirection = atom.config.get('pulsar-git-plus.general.splitPane');
            atom.workspace.getCenter().getActivePane()[`split${splitDirection}`]();
        }
        return atom.workspace.open(filePath);
    };
    prepFile = function(text, filePath) {
        return new Promise(function(resolve, reject) {
            if ((text != null ? text.length : void 0) === 0) return reject(nothingToShow);
            else return fs.writeFile(filePath, text, {
                flag: 'w+'
            }, function(err) {
                if (err) return reject(err);
                else return resolve(true);
            });
        });
    };
    module.exports = DiffBranchFilesListView = class DiffBranchFilesListView extends StatusListView {
        initialize(repo, data, branchName, selectedFilePath) {
            this.repo = repo;
            this.data = data;
            this.branchName = branchName;
            super.initialize();
            this.setItems(this.parseData(this.data));
            if (this.items.length === 0) {
                notifier.addInfo(`The branch '${this.branchName}' has no differences`);
                return this.cancel();
            }
            if (selectedFilePath) this.confirmed({
                path: this.repo.relativize(selectedFilePath)
            });
            this.show();
            return this.focusFilterEditor();
        }
        parseData(files) {
            var files_list, i, len, line, results, trim_files_string;
            trim_files_string = this.data.replace(/^\n+|\n+$/g, "");
            files_list = trim_files_string.split("\n");
            results = [];
            for(i = 0, len = files_list.length; i < len; i++){
                line = files_list[i];
                if (/^([ MADRCU?!]{1})\s+(.*)/.test(line)) {
                    if (line !== "") {
                        line = line.match(/^([ MADRCU?!]{1})\s+(.*)/);
                        results.push({
                            type: line[1],
                            path: line[2]
                        });
                    } else results.push(void 0);
                }
            }
            return results;
        }
        confirmed({ type: type, path: path }) {
            var fullPath, promise;
            this.cancel();
            fullPath = Path.join(this.repo.getWorkingDirectory(), path);
            promise = atom.workspace.open(fullPath, {
                split: "left",
                activatePane: false,
                activateItem: true,
                searchAllPanes: false
            });
            return promise.then((editor)=>{
                return RevisionView.showRevision(this.repo, editor, this.branchName);
            });
        }
    };
}).call(module.exports);

});
parcelRegister("6nXTe", function(module, exports) {






(function() {
    var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    fs = $dp3SY$fsplus;
    Path = $dp3SY$path;
    git = (parcelRequire("lppKC"));
    GitDiff = (parcelRequire("7c2RU"));
    notifier = (parcelRequire("gSFWX"));
    module.exports = StatusListView = class StatusListView extends SelectListView {
        initialize(repo, data) {
            this.repo = repo;
            this.data = data;
            super.initialize();
            this.show();
            this.setItems(this.parseData(this.data));
            return this.focusFilterEditor();
        }
        parseData(files) {
            var i, len, line, results;
            results = [];
            for(i = 0, len = files.length; i < len; i++){
                line = files[i];
                if (!/^([ MADRCU?!]{2})\s{1}(.*)/.test(line)) continue;
                line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
                results.push({
                    type: line[1],
                    path: line[2]
                });
            }
            return results;
        }
        getFilterKey() {
            return 'path';
        }
        getEmptyMessage() {
            return "Nothing to commit, working directory clean.";
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ type: type, path: path }) {
            var getIcon;
            getIcon = function(s) {
                if (s[0] === 'A') return 'status-added icon icon-diff-added';
                if (s[0] === 'D') return 'status-removed icon icon-diff-removed';
                if (s[0] === 'R') return 'status-renamed icon icon-diff-renamed';
                if (s[0] === 'M' || s[1] === 'M') return 'status-modified icon icon-diff-modified';
                return '';
            };
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'pull-right highlight',
                        style: 'white-space: pre-wrap; font-family: monospace'
                    }, type);
                    this.span({
                        class: getIcon(type)
                    });
                    return this.span(path);
                });
            });
        }
        confirmed({ type: type, path: path }) {
            var fullPath, openFile;
            this.cancel();
            if (type === '??') return git.add(this.repo, {
                file: path
            });
            else {
                openFile = confirm(`Open ${path}?`);
                fullPath = Path.join(this.repo.getWorkingDirectory(), path);
                return fs.stat(fullPath, (err, stat)=>{
                    var isDirectory;
                    if (err) return notifier.addError(err.message);
                    else {
                        isDirectory = stat != null ? stat.isDirectory() : void 0;
                        if (openFile) {
                            if (isDirectory) return atom.open({
                                pathsToOpen: fullPath,
                                newWindow: true
                            });
                            else return atom.workspace.open(fullPath);
                        } else return GitDiff(this.repo, {
                            file: path
                        });
                    }
                });
            }
        }
    };
}).call(module.exports);

});

parcelRegister("eZTKA", function(module, exports) {







(function() {
    var $, BufferedProcess, CompositeDisposable, SyncScroll, _, disposables, fs, git, notifier, path, showRevision, updateNewTextEditor;
    _ = $dp3SY$underscoreplus;
    path = $dp3SY$path;
    fs = $dp3SY$fs;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    ({ CompositeDisposable: CompositeDisposable, BufferedProcess: BufferedProcess } = $dp3SY$atom);
    ({ $: $ } = $dp3SY$atomspacepenviews);
    disposables = new CompositeDisposable();
    SyncScroll = null;
    updateNewTextEditor = function(newTextEditor, editor, gitRevision, fileContents) {
        return _.delay(function() {
            var lineEnding, ref;
            lineEnding = ((ref = editor.buffer) != null ? ref.lineEndingForRow(0) : void 0) || "\n";
            fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding);
            newTextEditor.buffer.setPreferredLineEnding(lineEnding);
            newTextEditor.setText(fileContents);
            return newTextEditor.buffer.cachedDiskContents = fileContents;
        }, 300);
    };
    showRevision = function(repo, filePath, editor, gitRevision, fileContents, options = {}) {
        var outputFilePath, ref, tempContent;
        gitRevision = path.basename(gitRevision);
        outputFilePath = `${repo.getPath()}/{${gitRevision}} ${path.basename(filePath)}`;
        if (options.diff) outputFilePath += ".diff";
        tempContent = "Loading..." + ((ref = editor.buffer) != null ? ref.lineEndingForRow(0) : void 0);
        return fs.writeFile(outputFilePath, tempContent, (error)=>{
            if (!error) return atom.workspace.open(filePath, {
                split: "left"
            }).then((editor)=>{
                return atom.workspace.open(outputFilePath, {
                    split: "right"
                }).then((newTextEditor)=>{
                    updateNewTextEditor(newTextEditor, editor, gitRevision, fileContents);
                    try {
                        return disposables.add(newTextEditor.onDidDestroy(function() {
                            return fs.unlink(outputFilePath);
                        }));
                    } catch (error1) {
                        error = error1;
                        return atom.notifications.addError(`Could not remove file ${outputFilePath}`);
                    }
                });
            });
        });
    };
    module.exports = {
        showRevision: function(repo, editor, gitRevision) {
            var args, fileName, filePath, options;
            options = {
                diff: false
            };
            filePath = editor.getPath();
            fileName = path.basename(filePath);
            args = [
                "show",
                `${gitRevision}:./${fileName}`
            ];
            return git.cmd(args, {
                cwd: path.dirname(filePath)
            }).then(function(data) {
                return showRevision(repo, filePath, editor, gitRevision, data, options);
            }).catch(function(code) {
                return atom.notifications.addError(`Git Plus: Could not retrieve revision for ${fileName} (${code})`);
            });
        }
    };
}).call(module.exports);

});



parcelRegister("ejfzQ", function(module, exports) {



(function() {
    var fs, git, notifier;
    fs = $dp3SY$fsplus;
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    module.exports = function(repo, { file: file } = {}) {
        var isFolder, ref, tool;
        if (file == null) file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
        isFolder = fs.isDirectorySync(file);
        if (!file) return notifier.addInfo("No open file. Select 'Diff All'.");
        // We parse the output of git diff-index to handle the case of a staged file
        // when pulsar-git-plus.diffs.includeStagedDiff is set to false.
        if (!(tool = git.getConfig(repo, 'diff.tool'))) return notifier.addInfo("You don't have a difftool configured.");
        else return git.cmd([
            'diff-index',
            'HEAD',
            '-z'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
            diffIndex = data.split('\0');
            includeStagedDiff = atom.config.get('pulsar-git-plus.diffs.includeStagedDiff');
            if (isFolder) {
                args = [
                    'difftool',
                    '-d',
                    '--no-prompt'
                ];
                if (includeStagedDiff) args.push('HEAD');
                args.push(file);
                git.cmd(args, {
                    cwd: repo.getWorkingDirectory()
                }).catch(function(message) {
                    return atom.notifications.addError('Error opening difftool', {
                        detail: message
                    });
                });
                return;
            }
            diffsForCurrentFile = diffIndex.map(function(line, i) {
                var path, staged;
                if (i % 2 === 0) {
                    staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
                    path = diffIndex[i + 1];
                    if (path === file && (!staged || includeStagedDiff)) return true;
                } else return void 0;
            });
            if (diffsForCurrentFile.filter(function(diff) {
                return diff != null;
            })[0] != null) {
                args = [
                    'difftool',
                    '--no-prompt'
                ];
                if (includeStagedDiff) args.push('HEAD');
                args.push(file);
                return git.cmd(args, {
                    cwd: repo.getWorkingDirectory()
                }).catch(function(message) {
                    return atom.notifications.addError('Error opening difftool', {
                        detail: message
                    });
                });
            } else return notifier.addInfo('Nothing to show.');
        });
    };
}).call(module.exports);

});

parcelRegister("ggLle", function(module, exports) {


(function() {
    var GitDiff, git;
    git = (parcelRequire("lppKC"));
    GitDiff = (parcelRequire("7c2RU"));
    module.exports = function(repo) {
        var args;
        args = [
            'diff',
            '--no-color',
            '--stat'
        ];
        if (atom.config.get('pulsar-git-plus.diffs.includeStagedDiff')) args.push('HEAD');
        return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return GitDiff(repo, {
                diffStat: data,
                file: '.'
            });
        });
    };
}).call(module.exports);

});

parcelRegister("jd638", function(module, exports) {

$parcel$export(module.exports, "default", () => $dfc3ec8b2e007de8$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");

var $crP9p = parcelRequire("crP9p");
var $dfc3ec8b2e007de8$export$2e2bcd8739ae039 = async (options = {
    prune: false
})=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const remotes = await repo.getRemoteNames();
    let chosenRemote;
    if (remotes.length === 1) chosenRemote = remotes[0];
    else chosenRemote = await new (0, $crP9p.default)(remotes).result;
    const result = await repo.fetch(chosenRemote, options);
    (0, $9JoOT.default).record({
        repoName: repo.getName(),
        message: `fetch ${options.prune ? "--prune" : ""} from ${chosenRemote}`,
        ...result
    });
};

});
parcelRegister("crP9p", function(module, exports) {

$parcel$export(module.exports, "default", () => $90ffaf1eaeffe5b9$export$2e2bcd8739ae039);

class $90ffaf1eaeffe5b9$export$2e2bcd8739ae039 {
    constructor(remotes, options = {}){
        this.disposables = new (0, $dp3SY$atom.CompositeDisposable)();
        this.emitter = new (0, $dp3SY$atom.Emitter)();
        this.isAttached = false;
        this.destroy = ()=>{
            this.disposables.dispose();
        };
        this.listView = new SelectList({
            items: remotes.map((remote)=>({
                    name: remote
                })),
            emptyMessage: "No remotes for this repository",
            filterKeyForItem: (item)=>item.name,
            elementForItem: (item, _options)=>{
                const li = document.createElement("li");
                li.textContent = item.name;
                return li;
            },
            didCancelSelection: ()=>{
                this.destroy();
                this.emitter.emit("did-cancel", "User aborted");
            },
            didConfirmSelection: (item)=>{
                this.emitter.emit("did-confirm", item.name);
                this.destroy();
            },
            ...options
        });
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>this.listView.destroy()));
        this.result = new Promise((resolve, reject)=>{
            this.emitter.once("did-cancel", reject);
            this.emitter.once("did-confirm", resolve);
        });
        this.attach();
    }
    attach() {
        this.previouslyFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
            item: this.listView.element
        });
        this.listView.focus();
        this.isAttached = true;
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>{
            var _a;
            this.panel.destroy();
            (_a = this.previouslyFocusedElement) === null || _a === void 0 || _a.focus();
        }));
    }
}

});


parcelRegister("eaDLy", function(module, exports) {

$parcel$export(module.exports, "default", () => $a510d88ae10e3d74$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
var $a510d88ae10e3d74$export$2e2bcd8739ae039 = async ()=>{
    const repos = (await Promise.all(atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project)))).filter(Boolean).map((r)=>new (0, $eQF7Z.default)(r));
    repos.forEach(async (repo)=>{
        const result = await repo.fetch();
        (0, $9JoOT.default).record({
            repoName: repo.getName(),
            message: `fetching from all remotes in ${repo.getName()}`,
            ...result
        });
    });
};

});

parcelRegister("lBjNq", function(module, exports) {



(function() {
    var ProjectsListView, git, init, notifier;
    git = (parcelRequire("lppKC"));
    ProjectsListView = (parcelRequire("hjWDV"));
    notifier = (parcelRequire("gSFWX"));
    init = function(path) {
        return git.cmd([
            'init'
        ], {
            cwd: path
        }).then(function(data) {
            notifier.addSuccess(data);
            return atom.project.setPaths(atom.project.getPaths());
        });
    };
    module.exports = function() {
        var currentFile, ref;
        currentFile = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
        if (!currentFile && atom.project.getPaths().length > 1) return new ProjectsListView().result.then(function(path) {
            return init(path);
        });
        else return init(atom.project.getPaths()[0]);
    };
}).call(module.exports);

});
parcelRegister("hjWDV", function(module, exports) {


(function() {
    var $$, ListView, SelectListView, git;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    module.exports = ListView = class ListView extends SelectListView {
        initialize() {
            super.initialize();
            this.currentPane = atom.workspace.getActivePane();
            return this.result = new Promise((resolve, reject)=>{
                this.resolve = resolve;
                this.reject = reject;
                return this.setup();
            });
        }
        getFilterKey() {
            return 'path';
        }
        setup() {
            this.setItems(atom.project.getPaths().map(function(p) {
                return {
                    path: p,
                    relativized: p.substring(p.lastIndexOf('/') + 1)
                };
            }));
            return this.show();
        }
        show() {
            this.filterEditorView.getModel().placeholderText = 'Initialize new repo where?';
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.focusFilterEditor();
            return this.storeFocusedElement();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        cancelled() {
            return this.hide();
        }
        viewForItem({ path: path, relativized: relativized }) {
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'text-highlight'
                    }, relativized);
                    return this.div({
                        class: 'text-info'
                    }, path);
                });
            });
        }
        confirmed({ path: path }) {
            this.resolve(path);
            return this.cancel();
        }
    };
}).call(module.exports);

});


parcelRegister("e4WFK", function(module, exports) {


(function() {
    var LogListView, LogViewURI, git;
    git = (parcelRequire("lppKC"));
    LogListView = (parcelRequire("65hbE"));
    LogViewURI = 'atom://pulsar-git-plus:log';
    module.exports = function(repo, { onlyCurrentFile: onlyCurrentFile } = {}) {
        var currentFile, ref;
        atom.workspace.addOpener(function(uri) {
            if (uri === LogViewURI) return new LogListView();
        });
        currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
        return atom.workspace.open(LogViewURI).then(function(view) {
            if (onlyCurrentFile) return view.currentFileLog(repo, currentFile);
            else return view.branchLog(repo);
        });
    };
}).call(module.exports);

});
parcelRegister("65hbE", function(module, exports) {







(function() {
    var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, View, _, emoji, git, numberOfCommitsToShow;
    ({ Disposable: Disposable } = $dp3SY$atom);
    ({ BufferedProcess: BufferedProcess } = $dp3SY$atom);
    ({ $: $, $$$: $$$, View: View } = $dp3SY$atomspacepenviews);
    _ = $dp3SY$underscoreplus;
    emoji = $dp3SY$nodeemoji;
    git = (parcelRequire("lppKC"));
    GitShow = (parcelRequire("271rL"));
    numberOfCommitsToShow = function() {
        return atom.config.get('pulsar-git-plus.logs.numberOfCommitsToShow');
    };
    module.exports = LogListView = class LogListView extends View {
        static content() {
            return this.div({
                class: 'pulsar-git-plus-log',
                tabindex: -1
            }, ()=>{
                this.table({
                    id: 'pulsar-git-plus-commits',
                    outlet: 'commitsListView'
                });
                return this.div({
                    class: 'show-more'
                }, ()=>{
                    return this.a({
                        id: 'show-more'
                    }, 'Show More');
                });
            });
        }
        getURI() {
            return 'atom://pulsar-git-plus:log';
        }
        getTitle() {
            return 'pulsar-git-plus: Log';
        }
        initialize() {
            var loadMore;
            this.skipCommits = 0;
            this.finished = false;
            loadMore = _.debounce(()=>{
                if (this.prop('scrollHeight') - this.scrollTop() - this.height() < 20) return this.getLog();
            }, 50);
            this.on('click', '.commit-row', ({ currentTarget: currentTarget })=>{
                return this.showCommitLog(currentTarget.getAttribute('hash'));
            });
            this.on('click', '#show-more', loadMore);
            return this.scroll(loadMore);
        }
        attached() {
            return this.commandSubscription = atom.commands.add(this.element, {
                'core:move-down': ()=>{
                    return this.selectNextResult();
                },
                'core:move-up': ()=>{
                    return this.selectPreviousResult();
                },
                'core:page-up': ()=>{
                    return this.selectPreviousResult(10);
                },
                'core:page-down': ()=>{
                    return this.selectNextResult(10);
                },
                'core:move-to-top': ()=>{
                    return this.selectFirstResult();
                },
                'core:move-to-bottom': ()=>{
                    return this.selectLastResult();
                },
                'core:confirm': ()=>{
                    var hash;
                    hash = this.find('.selected').attr('hash');
                    if (hash) this.showCommitLog(hash);
                    return false;
                }
            });
        }
        detached() {
            this.commandSubscription.dispose();
            return this.commandSubscription = null;
        }
        parseData(data) {
            var commits, newline, separator;
            if (data.length < 1) {
                this.finished = true;
                return;
            }
            separator = ';|';
            newline = '_.;._';
            data = data.substring(0, data.length - newline.length - 1);
            commits = data.split(newline).map(function(line) {
                var tmpData;
                if (line.trim() !== '') {
                    tmpData = line.trim().split(separator);
                    return {
                        hashShort: tmpData[0],
                        hash: tmpData[1],
                        author: tmpData[2],
                        email: tmpData[3],
                        message: tmpData[4],
                        date: tmpData[5]
                    };
                }
            });
            return this.renderLog(commits);
        }
        renderHeader() {
            var headerRow;
            headerRow = $$$(function() {
                return this.tr({
                    class: 'commit-header'
                }, ()=>{
                    this.td('Date');
                    this.td('Message');
                    return this.td({
                        class: 'hashShort'
                    }, 'Short Hash');
                });
            });
            return this.commitsListView.append(headerRow);
        }
        renderLog(commits) {
            commits.forEach((commit)=>{
                return this.renderCommit(commit);
            });
            return this.skipCommits += numberOfCommitsToShow();
        }
        renderCommit(commit) {
            var commitRow;
            commitRow = $$$(function() {
                return this.tr({
                    class: 'commit-row',
                    hash: `${commit.hash}`
                }, ()=>{
                    this.td({
                        class: 'date'
                    }, `${commit.date} by ${commit.author}`);
                    this.td({
                        class: 'message'
                    }, `${emoji.emojify(commit.message)}`);
                    return this.td({
                        class: 'hashShort'
                    }, `${commit.hashShort}`);
                });
            });
            return this.commitsListView.append(commitRow);
        }
        showCommitLog(hash) {
            return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
        }
        branchLog(repo) {
            this.repo = repo;
            this.skipCommits = 0;
            this.commitsListView.empty();
            this.onlyCurrentFile = false;
            this.currentFile = null;
            this.renderHeader();
            return this.getLog();
        }
        currentFileLog(repo, currentFile) {
            this.repo = repo;
            this.currentFile = currentFile;
            this.onlyCurrentFile = true;
            this.skipCommits = 0;
            this.commitsListView.empty();
            this.renderHeader();
            return this.getLog();
        }
        getLog() {
            var args;
            if (this.finished) return;
            args = [
                'log',
                "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._",
                `-${numberOfCommitsToShow()}`,
                '--skip=' + this.skipCommits
            ];
            if (this.onlyCurrentFile && this.currentFile != null) args.push(this.currentFile);
            return git.cmd(args, {
                cwd: this.repo.getWorkingDirectory()
            }).then((data)=>{
                return this.parseData(data);
            });
        }
        selectFirstResult() {
            this.selectResult(this.find('.commit-row:first'));
            return this.scrollToTop();
        }
        selectLastResult() {
            this.selectResult(this.find('.commit-row:last'));
            return this.scrollToBottom();
        }
        selectNextResult(skip = 1) {
            var nextView, selectedView;
            selectedView = this.find('.selected');
            if (selectedView.length < 1) return this.selectFirstResult();
            nextView = this.getNextResult(selectedView, skip);
            this.selectResult(nextView);
            return this.scrollTo(nextView);
        }
        selectPreviousResult(skip = 1) {
            var prevView, selectedView;
            selectedView = this.find('.selected');
            if (selectedView.length < 1) return this.selectFirstResult();
            prevView = this.getPreviousResult(selectedView, skip);
            this.selectResult(prevView);
            return this.scrollTo(prevView);
        }
        getNextResult(element, skip) {
            var itemIndex, items;
            if (!(element != null ? element.length : void 0)) return;
            items = this.find('.commit-row');
            itemIndex = items.index(element);
            return $(items[Math.min(itemIndex + skip, items.length - 1)]);
        }
        getPreviousResult(element, skip) {
            var itemIndex, items;
            if (!(element != null ? element.length : void 0)) return;
            items = this.find('.commit-row');
            itemIndex = items.index(element);
            return $(items[Math.max(itemIndex - skip, 0)]);
        }
        selectResult(resultView) {
            if (!(resultView != null ? resultView.length : void 0)) return;
            this.find('.selected').removeClass('selected');
            return resultView.addClass('selected');
        }
        scrollTo(element) {
            var bottom, top;
            if (!(element != null ? element.length : void 0)) return;
            top = this.scrollTop() + element.offset().top - this.offset().top;
            bottom = top + element.outerHeight();
            if (bottom > this.scrollBottom()) this.scrollBottom(bottom);
            if (top < this.scrollTop()) return this.scrollTop(top);
        }
    };
}).call(module.exports);

});
parcelRegister("271rL", function(module, exports) {






(function() {
    var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, isEmpty, prepFile, showCommitFilePath, showFile, showObject;
    Os = $dp3SY$os;
    Path = $dp3SY$path;
    fs = $dp3SY$fsplus;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    ({ TextEditorView: TextEditorView, View: View } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    showCommitFilePath = function(objectHash) {
        return Path.join(Os.tmpdir(), `${objectHash}.diff`);
    };
    isEmpty = function(string) {
        return string === '';
    };
    showObject = function(repo, objectHash, file) {
        var args, showFormatOption;
        objectHash = isEmpty(objectHash) ? 'HEAD' : objectHash;
        args = [
            'show',
            '--color=never'
        ];
        showFormatOption = atom.config.get('pulsar-git-plus.general.showFormat');
        if (showFormatOption !== 'none') args.push(`--format=${showFormatOption}`);
        if (atom.config.get('pulsar-git-plus.diffs.wordDiff')) args.push('--word-diff');
        args.push(objectHash);
        if (file != null) args.push('--', file);
        return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            if (data.length > 0) return prepFile(data, objectHash);
        });
    };
    prepFile = function(text, objectHash) {
        return fs.writeFile(showCommitFilePath(objectHash), text, {
            flag: 'w+'
        }, function(err) {
            if (err) return notifier.addError(err);
            else return showFile(objectHash);
        });
    };
    showFile = function(objectHash) {
        var disposables, editorForDiffs, filePath, splitDirection;
        filePath = showCommitFilePath(objectHash);
        disposables = new CompositeDisposable();
        editorForDiffs = atom.workspace.getPaneItems().filter(function(item) {
            var ref;
            return typeof item.getURI === "function" ? (ref = item.getURI()) != null ? ref.includes('.diff') : void 0 : void 0;
        })[0];
        if (editorForDiffs != null) return editorForDiffs.setText(fs.readFileSync(filePath, {
            encoding: 'utf-8'
        }));
        else {
            if (atom.config.get('pulsar-git-plus.general.openInPane')) {
                splitDirection = atom.config.get('pulsar-git-plus.general.splitPane');
                atom.workspace.getCenter().getActivePane()[`split${splitDirection}`]();
            }
            return atom.workspace.open(filePath, {
                pending: true,
                activatePane: true
            }).then(function(textBuffer) {
                if (textBuffer != null) return disposables.add(textBuffer.onDidDestroy(function() {
                    disposables.dispose();
                    try {
                        return fs.unlinkSync(filePath);
                    } catch (error) {}
                }));
            });
        }
    };
    InputView = class InputView extends View {
        static content() {
            return this.div(()=>{
                return this.subview('objectHash', new TextEditorView({
                    mini: true,
                    placeholderText: 'Commit hash to show. (Defaults to HEAD)'
                }));
            });
        }
        initialize(repo1) {
            this.repo = repo1;
            this.disposables = new CompositeDisposable();
            this.currentPane = atom.workspace.getActivePane();
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.objectHash.focus();
            this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:cancel': ()=>{
                    return this.destroy();
                }
            }));
            return this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:confirm': ()=>{
                    var text;
                    text = this.objectHash.getModel().getText().split(' ')[0];
                    showObject(this.repo, text);
                    return this.destroy();
                }
            }));
        }
        destroy() {
            var ref, ref1;
            if ((ref = this.disposables) != null) ref.dispose();
            return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
        }
    };
    module.exports = function(repo, objectHash, file) {
        if (objectHash == null) return new InputView(repo);
        else return showObject(repo, objectHash, file);
    };
}).call(module.exports);

});



parcelRegister("km474", function(module, exports) {

$parcel$export(module.exports, "default", () => $ed190d8091e4900c$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");

var $crP9p = parcelRequire("crP9p");
var $ed190d8091e4900c$export$2e2bcd8739ae039 = async ()=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const remotes = await repo.getRemoteNames();
    if (remotes.length === 0) atom.notifications.addInfo("There is no remote repository to pull from.");
    else {
        const shouldRebase = atom.config.get("pulsar-git-plus.remoteInteractions.pullRebase") === true;
        const shouldAutostash = atom.config.get("pulsar-git-plus.remoteInteractions.pullAutostash") === true;
        const pullOptions = {
            rebase: shouldRebase,
            autostash: shouldAutostash
        };
        if (atom.config.get("pulsar-git-plus.remoteInteractions.promptForBranch") === true) {
            let chosenRemote;
            if (remotes.length === 1) chosenRemote = remotes[0];
            else chosenRemote = await new (0, $crP9p.default)(remotes).result;
            let chosenBranch;
            const branches = await repo.getBranchesForRemote(chosenRemote);
            if (branches.length === 1) chosenBranch = branches[0];
            else chosenBranch = await new (0, $crP9p.default)(branches, {
                infoMessage: `Select branch on ${chosenRemote}`
            }).result;
            pullOptions.remote = chosenRemote;
            pullOptions.branch = chosenBranch;
        }
        const notification = atom.notifications.addInfo("Pulling...", {
            dismissable: true
        });
        const result = await repo.pull(pullOptions);
        (0, $9JoOT.default).record({
            repoName: repo.getName(),
            message: `pull`,
            ...result
        });
        notification.dismiss();
    }
};

});

parcelRegister("cMzzd", function(module, exports) {

$parcel$export(module.exports, "default", () => $94e58e9d163da68a$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");

var $crP9p = parcelRequire("crP9p");
var $94e58e9d163da68a$export$2e2bcd8739ae039 = async (setUpstream = false)=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const repoName = repo.getName();
    const pushOptions = {
        setUpstream: setUpstream
    };
    const remotes = await repo.getRemoteNames();
    if (remotes.length === 0) atom.notifications.addInfo("There is no remote repository to push to.");
    else {
        if (setUpstream) {
            pushOptions.setUpstream = true;
            pushOptions.remote = remotes[0];
            pushOptions.branch = "HEAD";
        } else {
            if (atom.config.get("pulsar-git-plus.remoteInteractions.promptForBranch")) {
                let chosenRemote;
                if (remotes.length === 1) chosenRemote = remotes[0];
                else chosenRemote = await new (0, $crP9p.default)(remotes).result;
                let chosenBranch;
                const branches = await repo.getBranchesForRemote(chosenRemote);
                if (branches.length === 1) chosenBranch = branches[0];
                else chosenBranch = await new (0, $crP9p.default)(branches, {
                    infoMessage: `Select branch on ${chosenRemote}`
                }).result;
                pushOptions.remote = chosenRemote;
                pushOptions.branch = chosenBranch;
            }
            if (atom.config.get("pulsar-git-plus.remoteInteractions.pullBeforePush")) {
                const result = await repo.pull({
                    rebase: atom.config.get("pulsar-git-plus.remoteInteractions.pullRebase") === true,
                    autostash: atom.config.get("pulsar-git-plus.remoteInteractions.pullAutostash") === true,
                    remote: pushOptions.remote,
                    branch: pushOptions.remote
                });
                (0, $9JoOT.default).record({
                    message: "pull before push",
                    repoName: repoName,
                    ...result
                });
                if (result.failed) return;
            }
        }
        const notification = atom.notifications.addInfo("Pushing...", {
            dismissable: true
        });
        const result = await repo.push(pushOptions);
        notification.dismiss();
        (0, $9JoOT.default).record({
            message: `push`,
            repoName: repoName,
            ...result
        });
    }
};

});

parcelRegister("3piiI", function(module, exports) {

$parcel$export(module.exports, "default", () => $27b1e7100e12e6c6$export$2e2bcd8739ae039);

var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
var $27b1e7100e12e6c6$export$2e2bcd8739ae039 = async ()=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const result = await repo.reset();
    (0, $9JoOT.default).record({
        repoName: repo.getName(),
        message: "reset index",
        ...result
    });
};

});

parcelRegister("2mdJF", function(module, exports) {




(function() {
    var ActivityLogger, RemoveListView, Repository, git, gitRemove, prettify;
    git = (parcelRequire("lppKC"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    RemoveListView = (parcelRequire("iutb6"));
    gitRemove = function(repo, { showSelector: showSelector } = {}) {
        var currentFile, cwd, ref, repoName;
        cwd = repo.getWorkingDirectory();
        currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
        if (currentFile != null && !showSelector) {
            if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
                atom.workspace.getActivePaneItem().destroy();
                repoName = new Repository(repo).getName();
                return git.cmd([
                    'rm',
                    '-f',
                    '--ignore-unmatch',
                    currentFile
                ], {
                    cwd: cwd
                }).then(function(data) {
                    return ActivityLogger.record({
                        repoName: repoName,
                        message: `Remove '${prettify(data)}'`,
                        output: data
                    });
                }).catch(function(data) {
                    return ActivityLogger.record({
                        repoName: repoName,
                        message: `Remove '${prettify(data)}'`,
                        output: data,
                        failed: true
                    });
                });
            }
        } else return git.cmd([
            'rm',
            '-r',
            '-n',
            '--ignore-unmatch',
            '-f',
            '*'
        ], {
            cwd: cwd
        }).then(function(data) {
            return new RemoveListView(repo, prettify(data));
        });
    };
    prettify = function(data) {
        var file, i, j, len, results;
        data = data.match(/rm ('.*')/g);
        if (data) {
            results = [];
            for(i = j = 0, len = data.length; j < len; i = ++j){
                file = data[i];
                results.push(data[i] = file.match(/rm '(.*)'/)[1]);
            }
            return results;
        } else return data;
    };
    module.exports = gitRemove;
}).call(module.exports);

});
parcelRegister("iutb6", function(module, exports) {





(function() {
    var $, $$, ActivityLogger, EditorView, Repository, SelectListMultipleView, SelectStageFilesView, git, prettify, indexOf = [].indexOf;
    ({ $: $, $$: $$, EditorView: EditorView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    SelectListMultipleView = (parcelRequire("35foq"));
    prettify = function(data) {
        var file, i, j, len, result, results;
        result = data.match(/rm ('.*')/g);
        if ((result != null ? result.length : void 0) >= 1) {
            results = [];
            for(i = j = 0, len = result.length; j < len; i = ++j){
                file = result[i];
                results.push(result[i] = ' ' + file.match(/rm '(.*)'/)[1]);
            }
            return results;
        }
    };
    module.exports = SelectStageFilesView = class SelectStageFilesView extends SelectListMultipleView {
        initialize(repo, items) {
            this.repo = repo;
            super.initialize();
            this.show();
            this.setItems(items);
            return this.focusFilterEditor();
        }
        addButtons() {
            var viewButton;
            viewButton = $$(function() {
                return this.div({
                    class: 'buttons'
                }, ()=>{
                    this.span({
                        class: 'pull-left'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight btn-cancel-button'
                        }, 'Cancel');
                    });
                    return this.span({
                        class: 'pull-right'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight btn-remove-button'
                        }, 'Remove');
                    });
                });
            });
            viewButton.appendTo(this);
            return this.on('click', 'button', ({ target: target })=>{
                if ($(target).hasClass('btn-remove-button')) {
                    if (window.confirm('Are you sure?')) this.complete();
                }
                if ($(target).hasClass('btn-cancel-button')) return this.cancel();
            });
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item, matchedStr) {
            return $$(function() {
                return this.li(()=>{
                    if (matchedStr != null) return this.raw(matchedStr);
                    else return this.span(item);
                });
            });
        }
        completed(items) {
            var currentFile, editor, files, item, ref, repoName;
            files = function() {
                var j, len, results;
                results = [];
                for(j = 0, len = items.length; j < len; j++){
                    item = items[j];
                    if (item !== '') results.push(item);
                }
                return results;
            }();
            this.cancel();
            currentFile = this.repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
            editor = atom.workspace.getActiveTextEditor();
            if (indexOf.call(files, currentFile) >= 0) atom.views.getView(editor).remove();
            repoName = new Repository(this.repo).getName();
            return git.cmd([
                'rm',
                '-f'
            ].concat(files), {
                cwd: this.repo.getWorkingDirectory()
            }).then(function(data) {
                return ActivityLogger.record({
                    repoName: repoName,
                    message: `Remove '${prettify(data)}'`,
                    output: data
                });
            }).catch(function(data) {
                return ActivityLogger.record({
                    repoName: repoName,
                    message: `Remove '${prettify(data)}'`,
                    output: data,
                    failed: true
                });
            });
        }
    };
}).call(module.exports);

});


parcelRegister("4BqoQ", function(module, exports) {


(function() {
    var SelectStageFiles, git;
    git = (parcelRequire("lppKC"));
    SelectStageFiles = (parcelRequire("gHavZ"));
    module.exports = function(repo) {
        var stagedFiles, unstagedFiles;
        unstagedFiles = git.unstagedFiles(repo, {
            showUntracked: true
        });
        stagedFiles = git.stagedFiles(repo);
        return Promise.all([
            unstagedFiles,
            stagedFiles
        ]).then(function(data) {
            return new SelectStageFiles(repo, data[0].concat(data[1]));
        });
    };
}).call(module.exports);

});
parcelRegister("gHavZ", function(module, exports) {




(function() {
    var $, $$, SelectListMultipleView, SelectStageFilesView, git, notifier;
    ({ $: $, $$: $$ } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    SelectListMultipleView = (parcelRequire("35foq"));
    module.exports = SelectStageFilesView = class SelectStageFilesView extends SelectListMultipleView {
        initialize(repo, items) {
            this.repo = repo;
            super.initialize();
            this.selectedItems.push('foobar'); // hack to override super class behavior so ::completed will be called
            this.show();
            this.setItems(items);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'path';
        }
        addButtons() {
            var viewButton;
            viewButton = $$(function() {
                return this.div({
                    class: 'select-list-buttons'
                }, ()=>{
                    this.div(()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight btn-cancel-button'
                        }, 'Cancel');
                    });
                    return this.div(()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight btn-apply-button'
                        }, 'Apply');
                    });
                });
            });
            viewButton.appendTo(this);
            return this.on('click', 'button', ({ target: target })=>{
                if ($(target).hasClass('btn-apply-button')) this.complete();
                if ($(target).hasClass('btn-cancel-button')) return this.cancel();
            });
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item, matchedStr) {
            var classString;
            classString = item.staged ? 'active' : '';
            return $$(function() {
                return this.li({
                    class: classString
                }, ()=>{
                    this.div({
                        class: 'pull-right'
                    }, ()=>{
                        return this.span({
                            class: 'inline-block highlight'
                        }, item.mode);
                    });
                    if (matchedStr != null) return this.raw(matchedStr);
                    else return this.span(item.path);
                });
            });
        }
        confirmed(item, viewItem) {
            item.staged = !item.staged;
            return viewItem.toggleClass('active');
        }
        completed(_) {
            var stage, stagePromise, unstage, unstagePromise;
            stage = this.items.filter(function(item) {
                return item.staged;
            }).map(function({ path: path }) {
                return path;
            });
            unstage = this.items.filter(function(item) {
                return !item.staged;
            }).map(function({ path: path }) {
                return path;
            });
            stagePromise = stage.length > 0 ? git.cmd([
                'add',
                '-f'
            ].concat(stage), {
                cwd: this.repo.getWorkingDirectory()
            }) : void 0;
            unstagePromise = unstage.length > 0 ? git.cmd([
                'reset',
                'HEAD',
                '--'
            ].concat(unstage), {
                cwd: this.repo.getWorkingDirectory()
            }) : void 0;
            Promise.all([
                stagePromise,
                unstagePromise
            ]).then(function(data) {
                return notifier.addSuccess('Index updated successfully');
            }).catch(notifier.addError);
            return this.cancel();
        }
    };
}).call(module.exports);

});


parcelRegister("lK3FM", function(module, exports) {


(function() {
    var SelectStageHunkFile, git, gitStageHunk;
    git = (parcelRequire("lppKC"));
    SelectStageHunkFile = (parcelRequire("iJy0D"));
    gitStageHunk = function(repo) {
        return git.unstagedFiles(repo).then(function(data) {
            return new SelectStageHunkFile(repo, data);
        });
    };
    module.exports = gitStageHunk;
}).call(module.exports);

});
parcelRegister("iJy0D", function(module, exports) {




(function() {
    var $$, BufferedProcess, SelectListView, SelectStageHunkFile, SelectStageHunks, git;
    ({ BufferedProcess: BufferedProcess } = $dp3SY$atom);
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    SelectStageHunks = (parcelRequire("9ReiG"));
    git = (parcelRequire("lppKC"));
    module.exports = SelectStageHunkFile = class SelectStageHunkFile extends SelectListView {
        initialize(repo, items) {
            this.repo = repo;
            super.initialize();
            this.show();
            this.setItems(items);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'path';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item) {
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'pull-right'
                    }, ()=>{
                        return this.span({
                            class: 'inline-block highlight'
                        }, item.mode);
                    });
                    return this.span({
                        class: 'text-warning'
                    }, item.path);
                });
            });
        }
        confirmed({ path: path }) {
            this.cancel();
            return git.diff(this.repo, path).then((data)=>{
                return new SelectStageHunks(this.repo, data);
            });
        }
    };
}).call(module.exports);

});
parcelRegister("9ReiG", function(module, exports) {





(function() {
    var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier;
    fs = $dp3SY$fsplus;
    ({ $: $, $$: $$ } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("lppKC"));
    notifier = (parcelRequire("gSFWX"));
    SelectListMultipleView = (parcelRequire("35foq"));
    module.exports = SelectStageHunks = class SelectStageHunks extends SelectListMultipleView {
        initialize(repo, data) {
            this.repo = repo;
            super.initialize();
            this.patch_header = data[0];
            if (data.length === 2) return this.completed(this._generateObjects(data.slice(1)));
            this.show();
            this.setItems(this._generateObjects(data.slice(1)));
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'pos';
        }
        addButtons() {
            var viewButton;
            viewButton = $$(function() {
                return this.div({
                    class: 'buttons'
                }, ()=>{
                    this.span({
                        class: 'pull-left'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight btn-cancel-button'
                        }, 'Cancel');
                    });
                    return this.span({
                        class: 'pull-right'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight btn-stage-button'
                        }, 'Stage');
                    });
                });
            });
            viewButton.appendTo(this);
            return this.on('click', 'button', ({ target: target })=>{
                if ($(target).hasClass('btn-stage-button')) this.complete();
                if ($(target).hasClass('btn-cancel-button')) return this.cancel();
            });
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem(item, matchedStr) {
            var viewItem;
            return viewItem = $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'inline-block highlight'
                    }, ()=>{
                        if (matchedStr != null) return this.raw(matchedStr);
                        else return this.span(item.pos);
                    });
                    return this.div({
                        class: 'text-warning gp-item-diff',
                        style: 'white-space: pre-wrap; font-family: monospace'
                    }, item.diff);
                });
            });
        }
        completed(items) {
            var patchPath, patch_full;
            this.cancel();
            if (items.length < 1) return;
            patch_full = this.patch_header;
            items.forEach(function(item) {
                return patch_full += item != null ? item.patch : void 0;
            });
            patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
            return fs.writeFile(patchPath, patch_full, {
                flag: 'w+'
            }, (err)=>{
                if (!err) return git.cmd([
                    'apply',
                    '--cached',
                    '--',
                    patchPath
                ], {
                    cwd: this.repo.getWorkingDirectory()
                }).then((data)=>{
                    data = data != null && data !== '' ? data : 'Hunk has been staged!';
                    notifier.addSuccess(data);
                    try {
                        return fs.unlink(patchPath);
                    } catch (error) {}
                });
                else return notifier.addError(err);
            });
        }
        _generateObjects(data) {
            var hunk, hunkSplit, i, len, results;
            results = [];
            for(i = 0, len = data.length; i < len; i++){
                hunk = data[i];
                if (!(hunk !== '')) continue;
                hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
                results.push({
                    pos: hunkSplit[1],
                    diff: hunkSplit[2],
                    patch: hunk
                });
            }
            return results;
        }
    };
}).call(module.exports);

});



parcelRegister("dMIZz", function(module, exports) {

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $a092a8918b485386$export$2e2bcd8739ae039);


var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
class $a092a8918b485386$var$StashListView {
    constructor(stashes, handleSelection){
        this.disposables = new (0, $dp3SY$atom.CompositeDisposable)();
        this.isAttached = false;
        this.destroy = ()=>{
            this.disposables.dispose();
        };
        this.listView = new SelectList({
            items: stashes,
            emptyMessage: "Your stash is empty",
            filterKeyForItem: (stash)=>stash.content,
            elementForItem: (stash, _options)=>{
                const li = document.createElement("li");
                li.textContent = `${stash.index}: ${stash.label}`;
                return li;
            },
            didCancelSelection: ()=>{
                this.destroy();
            },
            didConfirmSelection: (stash)=>{
                handleSelection(stash);
                this.destroy();
            }
        });
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>this.listView.destroy()));
        this.attach();
    }
    attach() {
        this.previouslyFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
            item: this.listView.element
        });
        this.listView.focus();
        this.isAttached = true;
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>{
            var _a;
            this.panel.destroy();
            (_a = this.previouslyFocusedElement) === null || _a === void 0 || _a.focus();
        }));
    }
}
class $a092a8918b485386$var$StashOptionsView {
    constructor(stash, handleSelection){
        this.disposables = new (0, $dp3SY$atom.CompositeDisposable)();
        this.isAttached = false;
        this.destroy = ()=>{
            this.disposables.dispose();
        };
        this.listView = new SelectList({
            items: Object.entries((0, $eQF7Z.StashCommands)).map((entry)=>({
                    label: entry[0],
                    ...entry[1]
                })),
            filterKeyForItem: (command)=>command.label,
            elementForItem: (command, _options)=>{
                const li = document.createElement("li");
                const labelDiv = document.createElement("div");
                labelDiv.classList.add("text-highlight");
                labelDiv.textContent = command.label;
                const infoDiv = document.createElement("div");
                infoDiv.classList.add("text-info");
                infoDiv.textContent = stash.label;
                li.append(labelDiv, infoDiv);
                return li;
            },
            didCancelSelection: this.destroy,
            didConfirmSelection: (command)=>{
                handleSelection(command);
                this.destroy();
            }
        });
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>this.listView.destroy()));
        this.attach();
    }
    attach() {
        this.previouslyFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
            item: this.listView.element
        });
        this.listView.focus();
        this.isAttached = true;
        this.disposables.add(new (0, $dp3SY$atom.Disposable)(()=>{
            var _a;
            this.panel.destroy();
            (_a = this.previouslyFocusedElement) === null || _a === void 0 || _a.focus();
        }));
    }
    focus() {
        if (this.isAttached) this.listView.focus();
    }
}
var $a092a8918b485386$export$2e2bcd8739ae039 = async ()=>{
    const repo = await (0, $eQF7Z.default).getCurrent();
    if (!repo) return atom.notifications.addInfo("No repository found");
    const stashes = await repo.getStashes();
    new $a092a8918b485386$var$StashListView(stashes, (stash)=>{
        const optionsView = new $a092a8918b485386$var$StashOptionsView(stash, async (command)=>{
            repo.actOnStash(stash, command).then((result)=>{
                (0, $9JoOT.default).record({
                    repoName: repo.getName(),
                    message: `stash@{${stash.index}} ${command.pastTense}`,
                    ...result
                });
            });
        });
        optionsView.focus();
    });
};

});

parcelRegister("7OvTn", function(module, exports) {



(function() {
    var ActivityLogger, Repository, git;
    git = (parcelRequire("eVTd8")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = function(repo) {
        var cwd;
        cwd = repo.getWorkingDirectory();
        return git([
            'stash',
            'apply'
        ], {
            cwd: cwd,
            color: true
        }).then(function(result) {
            var repoName;
            repoName = new Repository(repo).getName();
            return ActivityLogger.record(Object.assign({
                repoName: repoName,
                message: 'Apply stash'
            }, result));
        });
    };
}).call(module.exports);

});

parcelRegister("hBbsd", function(module, exports) {



(function() {
    var ActivityLogger, Repository, git;
    git = (parcelRequire("eVTd8")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = function(repo) {
        var cwd;
        cwd = repo.getWorkingDirectory();
        return git([
            'stash',
            'drop'
        ], {
            cwd: cwd,
            color: true
        }).then(function(result) {
            var repoName;
            repoName = new Repository(repo).getName();
            return ActivityLogger.record(Object.assign({
                repoName: repoName,
                message: 'Drop stash'
            }, result));
        });
    };
}).call(module.exports);

});

parcelRegister("7xGEe", function(module, exports) {



(function() {
    var ActivityLogger, Repository, git;
    git = (parcelRequire("eVTd8")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = function(repo) {
        var cwd;
        cwd = repo.getWorkingDirectory();
        return git([
            'stash',
            'pop'
        ], {
            cwd: cwd,
            color: true
        }).then(function(result) {
            var repoName;
            repoName = new Repository(repo).getName();
            return ActivityLogger.record(Object.assign({
                repoName: repoName,
                message: 'Pop stash'
            }, result));
        });
    };
}).call(module.exports);

});

parcelRegister("cmRNj", function(module, exports) {



(function() {
    var ActivityLogger, Repository, git;
    git = (parcelRequire("eVTd8")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = function(repo, { message: message } = {}) {
        var args, cwd;
        cwd = repo.getWorkingDirectory();
        args = [
            'stash',
            'save'
        ];
        if (message) args.push(message);
        return git(args, {
            cwd: cwd,
            color: true
        }).then(function(result) {
            var repoName;
            repoName = new Repository(repo).getName();
            return ActivityLogger.record(Object.assign({
                repoName: repoName,
                message: 'Stash changes'
            }, result));
        });
    };
}).call(module.exports);

});

parcelRegister("7TM1C", function(module, exports) {

(function() {
    var GitStashMessageView;
    GitStashMessageView = (parcelRequire("5uKF1"));
    module.exports = function(repo) {
        return new GitStashMessageView(repo);
    };
}).call(module.exports);

});
parcelRegister("5uKF1", function(module, exports) {



(function() {
    var $, CompositeDisposable, GitStashSave, InputView, TextEditorView, View;
    ({ CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    ({ $: $, TextEditorView: TextEditorView, View: View } = $dp3SY$atomspacepenviews);
    GitStashSave = (parcelRequire("cmRNj"));
    InputView = class InputView extends View {
        static content() {
            return this.div(()=>{
                return this.subview('commandEditor', new TextEditorView({
                    mini: true,
                    placeholderText: 'Stash message'
                }));
            });
        }
        initialize(repo) {
            var currentPane, disposables, panel;
            disposables = new CompositeDisposable();
            currentPane = atom.workspace.getActivePane();
            panel = atom.workspace.addModalPanel({
                item: this
            });
            panel.show();
            this.commandEditor.focus();
            disposables.add(atom.commands.add('atom-text-editor', {
                'core:cancel': (e)=>{
                    if (panel != null) panel.destroy();
                    currentPane.activate();
                    return disposables.dispose();
                }
            }));
            return disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (e)=>{
                disposables.dispose();
                if (panel != null) panel.destroy();
                GitStashSave(repo, {
                    message: this.commandEditor.getText()
                });
                return currentPane.activate();
            }));
        }
    };
    module.exports = InputView;
}).call(module.exports);

});


parcelRegister("9xGRG", function(module, exports) {


(function() {
    var StatusListView, git;
    git = (parcelRequire("lppKC"));
    StatusListView = (parcelRequire("6nXTe"));
    module.exports = function(repo) {
        return git.status(repo).then(function(data) {
            return new StatusListView(repo, data);
        });
    };
}).call(module.exports);

});

parcelRegister("8niyI", function(module, exports) {


(function() {
    var TagListView, git;
    git = (parcelRequire("lppKC"));
    TagListView = (parcelRequire("kzOFP"));
    module.exports = function(repo) {
        return git.cmd([
            'tag',
            '-ln'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return new TagListView(repo, data);
        }).catch(function() {
            return new TagListView(repo);
        });
    };
}).call(module.exports);

});
parcelRegister("kzOFP", function(module, exports) {




(function() {
    var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView;
    ({ BufferedProcess: BufferedProcess } = $dp3SY$atom);
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    TagView = (parcelRequire("2LOfl"));
    TagCreateView = (parcelRequire("gFTmN"));
    module.exports = TagListView = class TagListView extends SelectListView {
        initialize(repo, data = '') {
            this.repo = repo;
            this.data = data;
            super.initialize();
            this.show();
            return this.parseData();
        }
        parseData() {
            var item, items, tmp;
            if (this.data.length > 0) {
                this.data = this.data.split("\n").slice(0, -1);
                items = (function() {
                    var i, len, ref, results;
                    ref = this.data.reverse();
                    results = [];
                    for(i = 0, len = ref.length; i < len; i++){
                        item = ref[i];
                        if (!(item !== '')) continue;
                        tmp = item.match(/([\w\d-_\/.]+)\s(.*)/);
                        results.push({
                            tag: tmp != null ? tmp[1] : void 0,
                            annotation: tmp != null ? tmp[2] : void 0
                        });
                    }
                    return results;
                }).call(this);
            } else items = [];
            items.push({
                tag: '+ Add Tag',
                annotation: 'Add a tag referencing the current commit.'
            });
            this.setItems(items);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'tag';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ tag: tag, annotation: annotation }) {
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'text-highlight'
                    }, tag);
                    return this.div({
                        class: 'text-warning'
                    }, annotation);
                });
            });
        }
        confirmed({ tag: tag }) {
            this.cancel();
            if (tag === '+ Add Tag') return new TagCreateView(this.repo);
            else return new TagView(this.repo, tag);
        }
    };
}).call(module.exports);

});
parcelRegister("2LOfl", function(module, exports) {






(function() {
    var $$, ActivityLogger, GitShow, RemoteListView, Repository, SelectListView, TagView, git;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("eVTd8")).default;
    GitShow = (parcelRequire("271rL"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    RemoteListView = (parcelRequire("Bryup"));
    module.exports = TagView = class TagView extends SelectListView {
        initialize(repo, tag1) {
            this.repo = repo;
            this.tag = tag1;
            super.initialize();
            this.show();
            return this.parseData();
        }
        parseData() {
            var items;
            items = [];
            items.push({
                tag: this.tag,
                cmd: 'Show',
                description: 'git show'
            });
            items.push({
                tag: this.tag,
                cmd: 'Push',
                description: 'git push [remote]'
            });
            items.push({
                tag: this.tag,
                cmd: 'Checkout',
                description: 'git checkout'
            });
            items.push({
                tag: this.tag,
                cmd: 'Verify',
                description: 'git tag --verify'
            });
            items.push({
                tag: this.tag,
                cmd: 'Delete',
                description: 'git tag --delete'
            });
            this.setItems(items);
            return this.focusFilterEditor();
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ tag: tag, cmd: cmd, description: description }) {
            return $$(function() {
                return this.li(()=>{
                    this.div({
                        class: 'text-highlight'
                    }, cmd);
                    return this.div({
                        class: 'text-warning'
                    }, `${description} ${tag}`);
                });
            });
        }
        getFilterKey() {
            return 'cmd';
        }
        confirmed({ tag: tag, cmd: cmd }) {
            var args, repoName;
            this.cancel();
            switch(cmd){
                case 'Show':
                    GitShow(this.repo, tag);
                    break;
                case 'Push':
                    git([
                        'remote'
                    ], {
                        cwd: this.repo.getWorkingDirectory()
                    }).then((result)=>{
                        return new RemoteListView(this.repo, result.output, {
                            mode: 'push',
                            tag: this.tag
                        });
                    });
                    break;
                case 'Checkout':
                    args = [
                        'checkout',
                        tag
                    ];
                    break;
                case 'Verify':
                    args = [
                        'tag',
                        '--verify',
                        tag
                    ];
                    break;
                case 'Delete':
                    args = [
                        'tag',
                        '--delete',
                        tag
                    ];
            }
            if (args != null) {
                repoName = new Repository(this.repo).getName();
                return git(args, {
                    cwd: this.repo.getWorkingDirectory()
                }).then(function(result) {
                    return ActivityLogger.record(Object.assign({
                        repoName: repoName,
                        message: `${cmd} tag '${tag}'`
                    }, result));
                });
            }
        }
    };
}).call(module.exports);

});

parcelRegister("gFTmN", function(module, exports) {








(function() {
    var $, ActivityLogger, BufferedProcess, CompositeDisposable, Os, Path, Repository, TagCreateView, TextEditorView, View, fs, git;
    Os = $dp3SY$os;
    Path = $dp3SY$path;
    fs = $dp3SY$fsplus;
    ({ BufferedProcess: BufferedProcess, CompositeDisposable: CompositeDisposable } = $dp3SY$atom);
    ({ $: $, TextEditorView: TextEditorView, View: View } = $dp3SY$atomspacepenviews);
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    git = (parcelRequire("eVTd8")).default;
    module.exports = TagCreateView = class TagCreateView extends View {
        static content() {
            return this.div(()=>{
                this.div({
                    class: 'block'
                }, ()=>{
                    return this.subview('tagName', new TextEditorView({
                        mini: true,
                        placeholderText: 'Tag'
                    }));
                });
                this.div({
                    class: 'block'
                }, ()=>{
                    return this.subview('tagMessage', new TextEditorView({
                        mini: true,
                        placeholderText: 'Annotation message'
                    }));
                });
                return this.div({
                    class: 'block'
                }, ()=>{
                    this.span({
                        class: 'pull-left'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-success inline-block-tight gp-confirm-button',
                            click: 'createTag'
                        }, 'Create Tag');
                    });
                    return this.span({
                        class: 'pull-right'
                    }, ()=>{
                        return this.button({
                            class: 'btn btn-error inline-block-tight gp-cancel-button',
                            click: 'destroy'
                        }, 'Cancel');
                    });
                });
            });
        }
        initialize(repo) {
            this.repo = repo;
            this.disposables = new CompositeDisposable();
            this.currentPane = atom.workspace.getActivePane();
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            this.tagName.focus();
            this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:cancel': ()=>{
                    return this.destroy();
                }
            }));
            return this.disposables.add(atom.commands.add('atom-text-editor', {
                'core:confirm': ()=>{
                    return this.createTag();
                }
            }));
        }
        createTag() {
            var flag, repoName, tag;
            tag = {
                name: this.tagName.getModel().getText(),
                message: this.tagMessage.getModel().getText()
            };
            flag = atom.config.get('pulsar-git-plus.tags.signTags') ? '-s' : '-a';
            repoName = new Repository(this.repo).getName();
            git([
                'tag',
                flag,
                tag.name,
                '-m',
                tag.message
            ], {
                cwd: this.repo.getWorkingDirectory()
            }).then(function(result) {
                return ActivityLogger.record(Object.assign({
                    repoName: repoName,
                    message: `Create tag '${tag.name}'`
                }, result));
            });
            return this.destroy();
        }
        destroy() {
            var ref;
            if ((ref = this.panel) != null) ref.destroy();
            this.disposables.dispose();
            return this.currentPane.activate();
        }
    };
}).call(module.exports);

});



parcelRegister("d1WP8", function(module, exports) {


(function() {
    var MergeListView, git;
    git = (parcelRequire("lppKC"));
    MergeListView = (parcelRequire("14u0Q"));
    module.exports = function(repo, { remote: remote, noFastForward: noFastForward } = {}) {
        var args, extraArgs;
        extraArgs = noFastForward ? [
            '--no-ff'
        ] : [];
        args = [
            'branch',
            '--no-color'
        ];
        if (remote) args.push('-r');
        return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return new MergeListView(repo, data, extraArgs);
        });
    };
}).call(module.exports);

});
parcelRegister("14u0Q", function(module, exports) {





(function() {
    var $$, ActivityLogger, ListView, Repository, SelectListView, fs, git;
    fs = $dp3SY$fsplus;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("eVTd8")).default;
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = ListView = class ListView extends SelectListView {
        initialize(repo1, data, args = []) {
            this.repo = repo1;
            this.data = data;
            this.args = args;
            super.initialize();
            this.show();
            return this.parseData();
        }
        parseData() {
            var branches, i, item, items, len;
            items = this.data.split("\n");
            branches = [];
            for(i = 0, len = items.length; i < len; i++){
                item = items[i];
                item = item.replace(/\s/g, '');
                if (item !== '') branches.push({
                    name: item
                });
            }
            this.setItems(branches);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'name';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ name: name }) {
            var current;
            current = false;
            if (name.startsWith("*")) {
                name = name.slice(1);
                current = true;
            }
            return $$(function() {
                return this.li(name, ()=>{
                    return this.div({
                        class: 'pull-right'
                    }, ()=>{
                        if (current) return this.span('Current');
                    });
                });
            });
        }
        confirmed({ name: name }) {
            this.merge(name.match(/\*?(.*)/)[1]);
            return this.cancel();
        }
        merge(branch) {
            var mergeArg;
            mergeArg = [
                'merge'
            ].concat(this.args).concat([
                branch
            ]);
            return git(mergeArg, {
                cwd: this.repo.getWorkingDirectory(),
                color: true
            }).then((result)=>{
                var repoName;
                repoName = new Repository(repo).getName();
                ActivityLogger.record(Object.assign({
                    repoName: repoName,
                    message: `Merge branch '${branch}'`
                }, result));
                atom.workspace.getTextEditors().forEach(function(editor) {
                    return fs.exists(editor.getPath(), function(exist) {
                        if (!exist) return editor.destroy();
                    });
                });
                return git.refresh(this.repo);
            });
        }
    };
}).call(module.exports);

});


parcelRegister("l0YAk", function(module, exports) {


(function() {
    var RebaseListView, git;
    git = (parcelRequire("lppKC"));
    RebaseListView = (parcelRequire("l13Z9"));
    module.exports = function(repo) {
        return git.cmd([
            'branch',
            '--no-color'
        ], {
            cwd: repo.getWorkingDirectory()
        }).then(function(data) {
            return new RebaseListView(repo, data);
        });
    };
}).call(module.exports);

});
parcelRegister("l13Z9", function(module, exports) {






(function() {
    var $$, ActivityLogger, ListView, Repository, SelectListView, fs, git, notifier;
    fs = $dp3SY$fsplus;
    ({ $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    git = (parcelRequire("eVTd8")).default;
    notifier = (parcelRequire("gSFWX"));
    ActivityLogger = (parcelRequire("9JoOT")).default;
    Repository = (parcelRequire("eQF7Z")).default;
    module.exports = ListView = class ListView extends SelectListView {
        initialize(repo, data) {
            this.repo = repo;
            this.data = data;
            super.initialize();
            this.show();
            return this.parseData();
        }
        parseData() {
            var branches, i, item, items, len;
            items = this.data.split("\n");
            branches = [];
            for(i = 0, len = items.length; i < len; i++){
                item = items[i];
                item = item.replace(/\s/g, '');
                if (item !== '') branches.push({
                    name: item
                });
            }
            this.setItems(branches);
            return this.focusFilterEditor();
        }
        getFilterKey() {
            return 'name';
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.panel.show();
            return this.storeFocusedElement();
        }
        cancelled() {
            return this.hide();
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ name: name }) {
            var current;
            current = false;
            if (name.startsWith("*")) {
                name = name.slice(1);
                current = true;
            }
            return $$(function() {
                return this.li(name, ()=>{
                    return this.div({
                        class: 'pull-right'
                    }, ()=>{
                        if (current) return this.span('Current');
                    });
                });
            });
        }
        confirmed({ name: name }) {
            this.rebase(name.match(/\*?(.*)/)[1]);
            return this.cancel();
        }
        rebase(branch) {
            return git([
                'rebase',
                branch
            ], {
                cwd: this.repo.getWorkingDirectory()
            }).then((result)=>{
                var repoName;
                repoName = new Repository(this.repo).getName();
                ActivityLogger.record(Object.assign({
                    repoName: repoName,
                    message: `rebase branch '${branch}'`
                }, result));
                atom.workspace.getTextEditors().forEach(function(editor) {
                    return fs.exists(editor.getPath(), function(exist) {
                        if (!exist) return editor.destroy();
                    });
                });
                return git.refresh(this.repo);
            });
        }
    };
}).call(module.exports);

});


parcelRegister("7u2hg", function(module, exports) {

(function() {
    var filesFromData, git;
    git = (parcelRequire("lppKC"));
    filesFromData = function(statusData) {
        var files, i, len, line, lineMatch;
        files = [];
        for(i = 0, len = statusData.length; i < len; i++){
            line = statusData[i];
            lineMatch = line.match(/^([ MARCU?!]{2})\s{1}(.*)/);
            if (lineMatch) files.push(lineMatch[2]);
        }
        return files;
    };
    module.exports = function(repo) {
        return git.status(repo).then(function(statusData) {
            var file, i, len, ref, results;
            ref = filesFromData(statusData);
            results = [];
            for(i = 0, len = ref.length; i < len; i++){
                file = ref[i];
                results.push(atom.workspace.open(file));
            }
            return results;
        });
    };
}).call(module.exports);

});


parcelRegister("folqK", function(module, exports) {

(function() {
    var _, humanizeKeystroke;
    _ = $dp3SY$underscoreplus;
    humanizeKeystroke = function(binding) {
        return _.humanizeKeystroke(binding.keystrokes);
    };
    module.exports = function(platform = process.platform) {
        var cache, currentPlatformRegex, transform;
        cache = {};
        currentPlatformRegex = new RegExp(`\\.platform\\-${platform}([,:#\\s]|$)`);
        transform = function(name, bindings) {
            if (bindings != null) return bindings.every(function(binding) {
                if (currentPlatformRegex.test(binding.selector)) return cache[name] = humanizeKeystroke(binding);
            });
        };
        return {
            get: function(commands) {
                var c, i, len;
                for(i = 0, len = commands.length; i < len; i++){
                    c = commands[i];
                    if (!(c[0] in cache)) transform(c[0], atom.keymaps.findKeyBindings({
                        command: c[0]
                    }));
                }
                return cache;
            }
        };
    };
}).call(module.exports);

});




var $eVTd8 = parcelRequire("eVTd8");
class $349f858fab7a0618$export$1cf3253294c57c75 {
    constructor(treeView){
        this.renderedBranches = new Map();
        this.subscriptions = new (0, $dp3SY$atom.CompositeDisposable)();
        this.repoSubscriptions = new Map();
        this.isEnabled = false;
        this.renderBranch = async (path)=>{
            if (!this.isEnabled) return;
            const repo = await (0, $eVTd8.getRepoForPath)(path);
            if (!repo) return;
            const branchName = `[${repo.getShortHead()}]`;
            const entry = this.treeView.entryForPath(repo.getWorkingDirectory());
            if (entry == null) return;
            let div = this.renderedBranches.get(path);
            if (div) {
                div.innerText = branchName;
                entry.querySelector(".project-root-header").appendChild(div);
                return;
            }
            div = document.createElement("div");
            div.style.display = "inline";
            div.style.marginLeft = "10px";
            div.innerText = branchName;
            entry.querySelector(".project-root-header").appendChild(div);
            this.renderedBranches.set(repo.getWorkingDirectory(), div);
            this.updateRepoSubscription(repo.getWorkingDirectory(), repo.onDidChangeStatuses(()=>{
                this.renderBranch(repo.getWorkingDirectory());
            }));
        };
        this.treeView = treeView;
        atom.config.observe("pulsar-git-plus.general.showBranchInTreeView", (isEnabled)=>{
            this.isEnabled = isEnabled;
            if (isEnabled) this.initialize();
            else {
                this.destroy();
                this.subscriptions = new (0, $dp3SY$atom.CompositeDisposable)();
            }
        });
    }
    initialize() {
        atom.project.getPaths().forEach(this.renderBranch);
        this.subscriptions.add(atom.project.onDidChangePaths(async (paths)=>{
            await Promise.all(paths.map(this.renderBranch));
            for (const path of this.renderedBranches.keys())if (!paths.includes(path)) {
                this.renderedBranches.delete(path);
                this.repoSubscriptions.delete(path);
            }
        }));
    }
    updateRepoSubscription(path, disposable) {
        const subscription = this.repoSubscriptions.get(path);
        if (subscription) subscription.dispose();
        this.repoSubscriptions.set(path, disposable);
    }
    destroy() {
        this.subscriptions.dispose();
        this.renderedBranches.forEach((div)=>div.remove());
    }
}



var $lppKC = parcelRequire("lppKC");
var $2f43d6d148a5e6a3$exports = {};
(function() {
    var meta;
    meta = {
        define: "https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey",
        key: function() {
            switch(process.platform){
                case "darwin":
                    return "\u2318";
                case "linux":
                    return "Super";
                case "win32":
                    return "\u2756";
            }
        }()
    };
    $2f43d6d148a5e6a3$exports = {
        general: {
            order: 1,
            type: "object",
            properties: {
                gitPath: {
                    order: 1,
                    title: "Git Path",
                    type: "string",
                    default: "git",
                    description: "If git is not in your PATH, specify where the executable is"
                },
                enableStatusBarIcon: {
                    order: 2,
                    title: "Status-bar Icon",
                    type: "boolean",
                    default: true,
                    description: "The 'git+' icon in the bottom-right of the status-bar toggles the output view above the status-bar"
                },
                openInPane: {
                    order: 3,
                    title: "Allow commands to open new panes",
                    type: "boolean",
                    default: true,
                    description: "Commands like `Commit`, `Log`, `Show`, `Diff` can be split into new panes"
                },
                splitPane: {
                    order: 4,
                    title: "Split pane direction",
                    type: "string",
                    default: "Down",
                    description: "Where should new panes go?",
                    enum: [
                        "Up",
                        "Right",
                        "Down",
                        "Left"
                    ]
                },
                showFormat: {
                    order: 5,
                    title: "Format option for 'Git Show'",
                    type: "string",
                    default: "full",
                    enum: [
                        "oneline",
                        "short",
                        "medium",
                        "full",
                        "fuller",
                        "email",
                        "raw",
                        "none"
                    ],
                    description: "Which format to use for `git show`? (`none` will use your git config default)"
                },
                alwaysOpenDockWithResult: {
                    order: 6,
                    title: "Always show result output",
                    type: "boolean",
                    default: false,
                    description: "Always display the output view after a command completes (regardless of dock visibility). If the view has been destroyed, it will need to be manually toggled."
                },
                newBranchKey: {
                    order: 7,
                    title: "Status-bar New Branch modifier key",
                    type: "string",
                    default: "alt",
                    description: `Holding this modifier key while clicking on the branch name in the status bar will trigger creating a new branch. Note that _[\`meta\`](${meta.define})_ is <kbd>${meta.key}</kbd>`,
                    enum: [
                        "alt",
                        "shift",
                        "meta",
                        "ctrl"
                    ]
                },
                showBranchInTreeView: {
                    order: 8,
                    title: "Show current branch name in tree view.",
                    type: "boolean",
                    default: true,
                    description: "The branch name will be displayed next to repo root in the tree view as `[branch-name]`."
                }
            }
        },
        commits: {
            order: 2,
            type: "object",
            properties: {
                verboseCommits: {
                    title: "Verbose Commits",
                    description: "Show diffs in commit pane?",
                    type: "boolean",
                    default: false
                }
            }
        },
        diffs: {
            order: 3,
            type: "object",
            properties: {
                includeStagedDiff: {
                    order: 1,
                    title: "Include staged diffs?",
                    type: "boolean",
                    default: true
                },
                wordDiff: {
                    order: 2,
                    title: "Word diff",
                    type: "boolean",
                    default: false,
                    description: "Should diffs be generated with the `--word-diff` flag?"
                },
                syntaxHighlighting: {
                    order: 3,
                    title: "Enable syntax highlighting in diffs?",
                    type: "boolean",
                    default: true
                }
            }
        },
        logs: {
            order: 4,
            type: "object",
            properties: {
                numberOfCommitsToShow: {
                    order: 1,
                    title: "Number of commits to load",
                    type: "integer",
                    default: 25,
                    minimum: 1,
                    description: "Initial amount of commits to load when running the `Log` command"
                }
            }
        },
        remoteInteractions: {
            order: 5,
            type: "object",
            properties: {
                pullRebase: {
                    order: 1,
                    title: "Pull Rebase",
                    type: "boolean",
                    default: false,
                    description: "Pull with `--rebase` flag?"
                },
                pullAutostash: {
                    order: 2,
                    title: "Pull AutoStash",
                    type: "boolean",
                    default: false,
                    description: "Pull with `--autostash` flag?"
                },
                pullBeforePush: {
                    order: 3,
                    title: "Pull Before Pushing",
                    type: "boolean",
                    default: false,
                    description: "Pull from remote before pushing"
                },
                promptForBranch: {
                    order: 4,
                    title: "Prompt for branch selection when pulling/pushing",
                    type: "boolean",
                    default: false,
                    description: "If false, it defaults to current branch upstream"
                }
            }
        },
        tags: {
            order: 6,
            type: "object",
            properties: {
                signTags: {
                    title: "Sign git tags with GPG",
                    type: "boolean",
                    default: false,
                    description: "Use a GPG key to sign Git tags"
                }
            }
        },
        experimental: {
            order: 7,
            type: "object",
            properties: {
                customCommands: {
                    order: 1,
                    title: "Custom Commands",
                    type: "boolean",
                    default: false,
                    description: "Declared custom commands in your `init` file that can be run from the Git-plus command palette"
                },
                diffBranches: {
                    order: 2,
                    title: "Show diffs across branches",
                    type: "boolean",
                    default: false,
                    description: "Diffs will be shown for the current branch against a branch you choose. The `Diff branch files` command will allow choosing which file to compare. The file feature requires the 'split-diff' package to be installed."
                },
                autoFetch: {
                    order: 3,
                    title: "Auto-fetch",
                    type: "integer",
                    default: 0,
                    maximum: 60,
                    description: "Automatically fetch remote repositories every `x` minutes (`0` will disable this feature)"
                },
                autoFetchNotify: {
                    order: 4,
                    title: "Auto-fetch notification",
                    type: "boolean",
                    default: false,
                    description: "Show notifications while running `fetch --all`?"
                }
            }
        }
    };
}).call($2f43d6d148a5e6a3$exports);


// const fileSelector = ".tree-view > .full-menu .file";
const $7381b32e88b1de32$var$notMultiSelectedFileSelector = ".tree-view > .full-menu:not(.multi-select) .file";
const $7381b32e88b1de32$var$notMultiSelectedSelector = ".tree-view-root:not(.multi-select)";
const $7381b32e88b1de32$var$multiSelectedSelector = ".tree-view-root.multi-select";
const $7381b32e88b1de32$var$projectRootSelector = ".header.list-item.project-root-header"; // unfortunately, there's no indicator on the .list-item of whether it's a git repo
const $7381b32e88b1de32$var$modifiedFileSelector = ".entry.file.status-modified";
const $7381b32e88b1de32$var$modifiedDirectorySelector = ".entry.directory.status-modified > .list-item";
function $7381b32e88b1de32$export$e47526f762851abc() {
    atom.contextMenu.add({
        // modified files and directories
        [`${$7381b32e88b1de32$var$notMultiSelectedSelector} ${$7381b32e88b1de32$var$modifiedFileSelector}, ${$7381b32e88b1de32$var$notMultiSelectedSelector} ${$7381b32e88b1de32$var$modifiedDirectorySelector}`]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Add",
                        command: "pulsar-git-plus-context:add"
                    },
                    {
                        label: "Add + Commit",
                        command: "pulsar-git-plus-context:add-and-commit"
                    },
                    {
                        label: "Checkout",
                        command: "pulsar-git-plus-context:checkout-file"
                    },
                    {
                        label: "Difftool",
                        command: "pulsar-git-plus-context:difftool"
                    },
                    {
                        label: "Unstage",
                        command: "pulsar-git-plus-context:unstage-file"
                    }
                ]
            },
            {
                type: "separator"
            }
        ],
        // modified files
        [`${$7381b32e88b1de32$var$notMultiSelectedSelector} ${$7381b32e88b1de32$var$modifiedFileSelector}`]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Diff",
                        command: "pulsar-git-plus-context:diff"
                    }
                ]
            },
            {
                type: "separator"
            }
        ],
        // all files
        [$7381b32e88b1de32$var$notMultiSelectedFileSelector]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Diff Against Branch",
                        command: "pulsar-git-plus-context:diff-branch-files"
                    }
                ]
            },
            {
                type: "separator"
            }
        ],
        [`${$7381b32e88b1de32$var$multiSelectedSelector} ${$7381b32e88b1de32$var$modifiedFileSelector}`]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Add",
                        command: "pulsar-git-plus-context:add"
                    },
                    {
                        label: "Unstage",
                        command: "pulsar-git-plus-context:unstage-file"
                    }
                ]
            },
            {
                type: "separator"
            }
        ],
        // all files and directories
        // root directory
        [`${$7381b32e88b1de32$var$notMultiSelectedSelector} ${$7381b32e88b1de32$var$projectRootSelector}`]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Diff",
                        command: "pulsar-git-plus-context:diff-all"
                    },
                    {
                        label: "Diff Branches",
                        command: "pulsar-git-plus-context:diff-branches"
                    }
                ]
            },
            {
                type: "separator"
            }
        ],
        [`${$7381b32e88b1de32$var$multiSelectedSelector} ${$7381b32e88b1de32$var$projectRootSelector}, ${$7381b32e88b1de32$var$notMultiSelectedSelector} ${$7381b32e88b1de32$var$projectRootSelector}`]: [
            {
                type: "separator"
            },
            {
                label: "Git",
                submenu: [
                    {
                        label: "Add",
                        command: "pulsar-git-plus-context:add"
                    },
                    {
                        label: "Pull",
                        command: "pulsar-git-plus-context:pull"
                    },
                    {
                        label: "Push",
                        command: "pulsar-git-plus-context:push"
                    }
                ]
            },
            {
                type: "separator"
            }
        ]
    });
}



var $crkkW = parcelRequire("crkkW");

var $hH1op = parcelRequire("hH1op");

var $j90G6 = parcelRequire("j90G6");
var $62e5cf1a03f805b3$exports = {};






(function() {
    var $, $$, CommandsKeystrokeHumanizer, GitInit, GitPaletteView, GitPlusCommands, SelectListView, _, fuzzyFilter;
    _ = $dp3SY$underscoreplus;
    ({ $: $, $$: $$, SelectListView: SelectListView } = $dp3SY$atomspacepenviews);
    GitPlusCommands = (parcelRequire("3iQun"));
    GitInit = (parcelRequire("lBjNq"));
    fuzzyFilter = $dp3SY$fuzzaldrin.filter;
    CommandsKeystrokeHumanizer = (parcelRequire("folqK"))();
    $62e5cf1a03f805b3$exports = GitPaletteView = class GitPaletteView extends SelectListView {
        initialize() {
            super.initialize();
            this.addClass('git-palette');
            return this.toggle();
        }
        getFilterKey() {
            return 'description';
        }
        cancelled() {
            return this.hide();
        }
        toggle() {
            var ref;
            if ((ref = this.panel) != null ? ref.isVisible() : void 0) return this.cancel();
            else return this.show();
        }
        show() {
            if (this.panel == null) this.panel = atom.workspace.addModalPanel({
                item: this
            });
            this.storeFocusedElement();
            if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) this.commandElement = this.previouslyFocusedElement;
            else this.commandElement = atom.views.getView(atom.workspace);
            this.keyBindings = atom.keymaps.findKeyBindings({
                target: this.commandElement[0]
            });
            return GitPlusCommands().then((commands)=>{
                var keystrokes;
                keystrokes = CommandsKeystrokeHumanizer.get(commands);
                commands = commands.map(function(c) {
                    return {
                        name: c[0],
                        description: c[1],
                        func: c[2],
                        keystroke: keystrokes[c[0]]
                    };
                });
                commands = _.sortBy(commands, 'description');
                this.setItems(commands);
                this.panel.show();
                return this.focusFilterEditor();
            }).catch((err)=>{
                var commands;
                (commands = []).push({
                    name: 'pulsar-git-plus:init',
                    description: 'Init',
                    func: function() {
                        return GitInit();
                    }
                });
                this.setItems(commands);
                this.panel.show();
                return this.focusFilterEditor();
            });
        }
        populateList() {
            var filterQuery, filteredItems, i, item, itemView, j, options, ref, ref1, ref2;
            if (this.items == null) return;
            filterQuery = this.getFilterQuery();
            if (filterQuery.length) {
                options = {
                    key: this.getFilterKey()
                };
                filteredItems = fuzzyFilter(this.items, filterQuery, options);
            } else filteredItems = this.items;
            this.list.empty();
            if (filteredItems.length) {
                this.setError(null);
                for(i = j = 0, ref = Math.min(filteredItems.length, this.maxItems); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j){
                    item = (ref1 = filteredItems[i].original) != null ? ref1 : filteredItems[i];
                    itemView = $(this.viewForItem(item, (ref2 = filteredItems[i].string) != null ? ref2 : null));
                    itemView.data('select-list-item', item);
                    this.list.append(itemView);
                }
                return this.selectItemView(this.list.find('li:first'));
            } else return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
        }
        hide() {
            var ref;
            return (ref = this.panel) != null ? ref.destroy() : void 0;
        }
        viewForItem({ name: name, description: description, keystroke: keystroke }, matchedStr) {
            return $$(function() {
                return this.li({
                    class: 'command',
                    'data-command-name': name
                }, ()=>{
                    if (matchedStr != null) return this.raw(matchedStr);
                    else {
                        this.span(description);
                        if (keystroke != null) return this.div({
                            class: 'pull-right'
                        }, ()=>{
                            return this.kbd({
                                class: 'key-binding'
                            }, keystroke);
                        });
                    }
                });
            });
        }
        confirmed({ func: func }) {
            this.cancel();
            return func();
        }
    };
}).call($62e5cf1a03f805b3$exports);



var $9JoOT = parcelRequire("9JoOT");

var $eQF7Z = parcelRequire("eQF7Z");
const $e20c8f3279d546d3$var$logNoRepoFound = ()=>atom.notifications.addInfo("No repository found");
async function $e20c8f3279d546d3$export$e16d8520af44a096(treeView) {
    const filesPerRepo = new Map();
    const paths = treeView.selectedPaths();
    await Promise.all(paths.map(async (path)=>{
        const repo = await (0, $eQF7Z.default).getForPath(path);
        if (!repo) return atom.notifications.addInfo(`No repository found for ${atom.project.relativizePath(path)[1]}`);
        const files = filesPerRepo.get(repo.repo) || [];
        files.push(path);
        filesPerRepo.set(repo.repo, files);
    }));
    for (const [gitRepo, files] of filesPerRepo.entries()){
        const repo = await new (0, $eQF7Z.default)(gitRepo);
        const result = await repo.stage(files);
        let localizedPaths;
        if (files.length === 1 && files[0] === repo.getWorkingDirectory()) localizedPaths = "all changes";
        else localizedPaths = files.map((file)=>repo.relativize(file)).join(", ");
        (0, $9JoOT.default).record({
            repoName: repo.getName(),
            message: `add ${localizedPaths}`,
            ...result
        });
    }
}
async function $e20c8f3279d546d3$export$bd0c26474ff2d449(treeView) {
    await $e20c8f3279d546d3$export$e16d8520af44a096(treeView);
    const [path] = treeView.selectedPaths();
    const repo = await (0, $eQF7Z.default).getForPath(path);
    if (!repo) return $e20c8f3279d546d3$var$logNoRepoFound();
    GitCommit(repo.repo);
}
async function $e20c8f3279d546d3$export$b968b96c7285d7cb(treeView) {
    treeView.selectedPaths().forEach(async (path)=>{
        const repo = await (0, $eQF7Z.default).getForPath(path);
        if (!repo) return atom.notifications.addWarning(`No repository found for \`${path}\``);
        const entry = treeView.entryForPath(path);
        if (entry.classList.contains("file") && !repo.isPathModified(path)) return atom.notifications.addInfo(`\`${repo.relativize(path)}\` has no changes to reset.`);
        if (await repo.isPathStaged(path)) return atom.notifications.addWarning(`\`${repo.relativize(path)}\` can't be reset.`, {
            detail: "It has staged changes, which must be unstaged first"
        });
        atom.confirm({
            message: `Are you sure you want to reset ${repo.relativize(path)} to HEAD`,
            buttons: {
                Yes: ()=>GitCheckoutFile(repo.repo, {
                        file: path
                    }),
                No: ()=>{}
            }
        });
    });
}
async function $e20c8f3279d546d3$export$f0a89277a59c083d(treeView) {
    const [path] = treeView.selectedPaths();
    const repo = await (0, $eQF7Z.default).getForPath(path);
    if (!repo) return atom.notifications.addWarning(`No repository found for \`${path}\``);
    GitDiffBranchFiles(repo.repo, path);
}
async function $e20c8f3279d546d3$export$39803a6d2aac1a8a(treeView) {
    const [path] = treeView.selectedPaths();
    const repo = await (0, $eQF7Z.default).getForPath(path);
    if (!repo) return atom.notifications.addWarning(`No repository found for \`${path}\``);
    GitDiffBranches(repo.repo);
}
async function $e20c8f3279d546d3$export$6eea347271f2f1c2(treeView) {
    const [path] = treeView.selectedPaths();
    const repo = await (0, $eQF7Z.default).getForPath(path);
    if (!repo) return atom.notifications.addWarning(`No repository found for ${path}`);
    if (!repo.isPathModified(path)) return atom.notifications.addInfo(`\`${repo.relativize(path)}\` has no changes to diff`);
    GitDiffTool(repo.repo, {
        file: repo.relativize(path)
    });
}
async function $e20c8f3279d546d3$export$a37e3c603d7117e5(treeView, all = false) {
    const [path] = treeView.selectedPaths();
    const repo = await (0, $eQF7Z.default).getForPath(path);
    if (!repo) return atom.notifications.addWarning(`No repository found for \`${path}\``);
    if (!all && !repo.isPathModified(path)) return atom.notifications.addInfo(`\`${repo.relativize(path)}\` has no changes to diff`);
    if (all) GitDiffAll(repo.repo);
    else GitDiff(repo.repo, {
        file: repo.relativize(path)
    });
}
async function $e20c8f3279d546d3$export$be44f282e480703c(treeView) {
    const paths = treeView.selectedPaths();
    const reposForPaths = await Promise.all(paths.map((0, $eQF7Z.default).getForPath));
    const seenRepoDirectories = [];
    reposForPaths.forEach((repo, index)=>{
        if (repo) {
            const repoDirectory = repo.getWorkingDirectory();
            if (!seenRepoDirectories.includes(repoDirectory)) {
                GitPull(repo.repo);
                seenRepoDirectories.push(repoDirectory);
            }
        } else atom.notifications.addWarning(`No repository found for \`${paths[index]}\``);
    });
}
async function $e20c8f3279d546d3$export$4cbf152802aa238(treeView) {
    const paths = treeView.selectedPaths();
    const reposForPaths = await Promise.all(paths.map((0, $eQF7Z.default).getForPath));
    const seenRepoDirectories = [];
    reposForPaths.forEach(async (repo, index)=>{
        if (repo) {
            const repoDirectory = repo.getWorkingDirectory();
            if (!seenRepoDirectories.includes(repoDirectory)) {
                if (await repo.getUpstreamBranchFor("HEAD") === null) {
                    const notification = atom.notifications.addWarning(`The current branch \`${repo.repo.getShortHead()}\` has no upstream branch`, {
                        dismissable: true,
                        detail: "Do you want to create an upstream branch for it?",
                        buttons: [
                            {
                                text: "Yes",
                                onDidClick () {
                                    GitPush(repo.repo, {
                                        setUpstream: true
                                    });
                                    seenRepoDirectories.push(repoDirectory);
                                    notification.dismiss();
                                }
                            },
                            {
                                text: "No",
                                onDidClick () {
                                    notification.dismiss();
                                }
                            }
                        ]
                    });
                } else {
                    GitPush(repo.repo);
                    seenRepoDirectories.push(repoDirectory);
                }
            }
        } else atom.notifications.addWarning(`No repository found for \`${paths[index]}\``);
    });
}
function $e20c8f3279d546d3$export$c854c8b85184a64a(treeView) {
    treeView.selectedPaths().forEach(async (path)=>{
        const repo = await (0, $eQF7Z.default).getForPath(path);
        if (!repo) return atom.notifications.addWarning(`No repository found for ${path}`);
        const pathIsStaged = await repo.isPathStaged(path);
        if (repo.getWorkingDirectory() !== path && !pathIsStaged) return atom.notifications.addInfo(`\`${repo.relativize(path)}\` can't be unstaged.`, {
            detail: "This file has no staged changes"
        });
        const result = await repo.unstage(path);
        (0, $9JoOT.default).record({
            repoName: repo.getName(),
            message: `Unstage ${path}`,
            ...result
        });
    });
}



var $4y5U8 = parcelRequire("4y5U8");

var $2DNX4 = parcelRequire("2DNX4");

var $3O1Aw = parcelRequire("3O1Aw");

var $dcxBF = parcelRequire("dcxBF");

var $3piiI = parcelRequire("3piiI");

var $77LDn = parcelRequire("77LDn");

var $3mGsE = parcelRequire("3mGsE");

var $bXxVi = parcelRequire("bXxVi");

var $7c2RU = parcelRequire("7c2RU");

var $3Pi7d = parcelRequire("3Pi7d");

var $hD9Pz = parcelRequire("hD9Pz");

var $ejfzQ = parcelRequire("ejfzQ");

var $ggLle = parcelRequire("ggLle");

var $jd638 = parcelRequire("jd638");

var $eaDLy = parcelRequire("eaDLy");

var $lBjNq = parcelRequire("lBjNq");

var $e4WFK = parcelRequire("e4WFK");

var $km474 = parcelRequire("km474");

var $cMzzd = parcelRequire("cMzzd");

var $2mdJF = parcelRequire("2mdJF");

var $271rL = parcelRequire("271rL");

var $4BqoQ = parcelRequire("4BqoQ");

var $lK3FM = parcelRequire("lK3FM");

var $dMIZz = parcelRequire("dMIZz");

var $7OvTn = parcelRequire("7OvTn");

var $hBbsd = parcelRequire("hBbsd");

var $7xGEe = parcelRequire("7xGEe");

var $cmRNj = parcelRequire("cmRNj");

var $7TM1C = parcelRequire("7TM1C");

var $9xGRG = parcelRequire("9xGRG");

var $8niyI = parcelRequire("8niyI");

var $ceh8S = parcelRequire("ceh8S");

var $d1WP8 = parcelRequire("d1WP8");

var $l0YAk = parcelRequire("l0YAk");

var $7u2hg = parcelRequire("7u2hg");
var $037d78ffbe031ced$exports = {};


(function() {
    var _ = $dp3SY$underscoreplus;
    var path = $dp3SY$path;
    var registry = atom.grammars;
    var baseWordGrammar = registry.readGrammarSync(path.join(__dirname, 'word-diff.json'));
    baseWordGrammar.packageName = 'pulsar-git-plus';
    var wordGrammar = Object.create(baseWordGrammar);
    wordGrammar.tokenizeLine = tokenizeLine;
    var baseLineGrammar = registry.readGrammarSync(path.join(__dirname, 'line-diff.json'));
    baseLineGrammar.packageName = 'pulsar-git-plus';
    var lineGrammar = Object.create(baseLineGrammar);
    lineGrammar.tokenizeLine = tokenizeLine;
    $037d78ffbe031ced$exports = {
        wordGrammar: wordGrammar,
        lineGrammar: lineGrammar
    };
    function tokenizeLine(line, ruleStack, firstLine) {
        var grammar = null;
        var codeStack = [];
        var stack = ruleStack;
        if (stack && stack.length > 1) {
            var grammarIndex = stack.findIndex((item)=>_.isUndefined(item.rule));
            if (grammarIndex !== -1) {
                codeStack = stack.slice(grammarIndex + 1);
                grammar = stack[grammarIndex];
                stack = stack.slice(0, grammarIndex);
            }
        }
        var tokenizeResult = this.__proto__.tokenizeLine(line, stack, firstLine);
        var tags = tokenizeResult.tags;
        var openScopeTags = tokenizeResult.openScopeTags.slice();
        var tokens = tokenizeResult.tokens;
        stack = tokenizeResult.ruleStack;
        var tokenTagIndices = [];
        for(let i = 0; i < tags.length; i++)if (tags[i] > 0) tokenTagIndices.push(i);
        if (!grammar && stack && stack.length == 1) for(let i = 0; i < tokens.length; i++){
            var isFileName = tokens[i].scopes.some((scope)=>{
                return scope.indexOf('header.from-file') != -1 || scope.indexOf('header.to-file') != -1;
            });
            if (isFileName) {
                var ext = path.extname(tokens[i].value);
                if (ext && ext !== '') {
                    grammar = atom.grammars.selectGrammar(tokens[i].value);
                    if (grammar.scopeName) grammar = atom.grammars.grammarForScopeName(grammar.scopeName);
                }
            }
        }
        else if (grammar) {
            if (codeStack.length === 0) codeStack = null;
            var res = runCodeGrammar(grammar, tags, tokens, tokenTagIndices, codeStack);
            tags = res.tags;
            codeStack = res.codeStack;
            if (line.indexOf('diff --git a/') === 0) grammar = null;
        }
        if (grammar) {
            stack.push(grammar);
            if (codeStack) stack = stack.concat(codeStack);
        }
        return _.extend(tokenizeResult, {
            tags: tags,
            ruleStack: stack,
            openScopeTags: openScopeTags
        });
    }
    function runCodeGrammar(grammar, tags, tokens, tokenTagIndices, codeStack) {
        var removedLine = '';
        var addedLine = '';
        for(let i = 0; i < tokens.length; i++){
            var notCode = isNotCode(tokens[i].scopes);
            if (notCode) continue;
            if (_.contains(tokens[i].scopes, 'markup.added.diff')) addedLine += tokens[i].value;
            else if (_.contains(tokens[i].scopes, 'markup.removed.diff')) removedLine += tokens[i].value;
            else {
                addedLine += tokens[i].value;
                removedLine += tokens[i].value;
            }
        }
        var removedResult;
        var removedIdx = 0;
        var addedResult;
        var addedIdx = 0;
        if (removedLine && removedLine.trim().length) {
            if (grammar.tokenizeLine) {
                removedResult = grammar.tokenizeLine(removedLine, codeStack);
                removedIdx = removedLine.length;
            }
        }
        if (addedLine && addedLine.trim().length !== undefined) {
            if (grammar.tokenizeLine) {
                addedResult = grammar.tokenizeLine(addedLine, codeStack);
                addedIdx = addedLine.length;
            }
        }
        var replacementTags = [];
        var newIdx = {};
        if (removedIdx) newIdx.removed = removedIdx;
        if (addedIdx) newIdx.added = addedIdx;
        for(let i = tokens.length - 1; i >= 0; i--){
            notCode = isNotCode(tokens[i].scopes);
            if (notCode) continue;
            var tagStack = [];
            if (codeStack) for(let j = 0; j < codeStack.length; j++){
                var scope = codeStack[j].scopeName || codeStack[j].contentScopeName;
                if (scope) tagStack.push((atom.grammars.textmateRegistry || atom.grammars.registry).startIdForScope(scope));
            }
            var replaceIdx = tokenTagIndices[i];
            var oldTag = tags[replaceIdx];
            var currentLength = 0;
            var currentIdx = 0;
            var newTags;
            removedIdx = _.isUndefined(newIdx.removed) ? removedIdx : newIdx.removed;
            addedIdx = _.isUndefined(newIdx.added) ? addedIdx : newIdx.added;
            if (_.contains(tokens[i].scopes, 'markup.removed.diff')) {
                newTags = removedResult && removedResult.tags;
                newIdx = {
                    removed: removedIdx
                };
            } else if (_.contains(tokens[i].scopes, 'markup.added.diff')) {
                newTags = addedResult && addedResult.tags;
                newIdx = {
                    added: addedIdx
                };
            } else {
                newTags = addedResult && addedResult.tags || removedResult && removedResult.tags;
                newIdx = {
                    added: addedIdx,
                    removed: removedIdx
                };
            }
            if (!newTags) continue;
            addToIndices(newIdx, -tokens[i].value.length);
            var startIdx = _.isUndefined(newIdx.added) ? newIdx.removed : newIdx.added;
            var tagLength = 0;
            let j = 0;
            if (currentIdx < startIdx) for(; j < newTags.length; j++){
                if (!isLengthTag(newTags[j])) continue;
                if (currentIdx + newTags[j] > startIdx) {
                    tagLength = currentIdx + newTags[j] - startIdx;
                    currentIdx += tagLength;
                    while(j - 1 > 0 && isStartTag(newTags[j - 1]))j--;
                    break;
                } else if (currentIdx + newTags[j] === startIdx) {
                    currentIdx += newTags[j];
                    break;
                } else currentIdx += newTags[j];
            }
            for(var k = 0; k < j; k++){
                if (isLengthTag(newTags[k])) continue;
                if (isStartTag(newTags[k])) tagStack.push(newTags[k]);
                else tagStack.pop();
            }
            for(let k = 0; k < tagStack.length; k++)replacementTags.push(tagStack[k]);
            for(; j < newTags.length; j++)if (isLengthTag(newTags[j])) {
                if (currentLength >= oldTag) break;
                tagLength = tagLength || newTags[j];
                if (currentLength + tagLength > oldTag) {
                    var tokenLength = oldTag - currentLength;
                    replacementTags.push(tokenLength);
                    currentLength += tokenLength;
                    addToIndices(newIdx, tokenLength);
                } else {
                    replacementTags.push(tagLength);
                    currentLength += tagLength;
                    addToIndices(newIdx, tagLength);
                }
                tagLength = 0;
            } else {
                if (isStartTag(newTags[j])) {
                    if (currentLength < oldTag) tagStack.push(newTags[j]);
                    else break;
                } else if (isEndTag(newTags[j]) && newTags[j] === tagStack[tagStack.length - 1] - 1) tagStack.pop();
                else if (isEndTag(newTags[j])) replacementTags.push(newTags[j] + 1);
                replacementTags.push(newTags[j]);
            }
            for(let j = tagStack.length - 1; j >= 0; j--)replacementTags.push(tagStack[j] - 1) //end tag for start tag
            ;
            //go back to beginning of replaced tag, since we are going backwards through old tags
            addToIndices(newIdx, -oldTag);
            tags.splice(replaceIdx, 1, ...replacementTags);
            replacementTags = [];
        }
        codeStack = addedResult && addedResult.ruleStack || removedResult && removedResult.ruleStack || codeStack || null;
        return {
            tags: tags,
            codeStack: codeStack
        };
    }
    function addToIndices(indices, num) {
        if (!_.isUndefined(indices.removed)) indices.removed = Math.max(indices.removed + num, 0);
        if (!_.isUndefined(indices.added)) indices.added = Math.max(indices.added + num, 0);
    }
    function isNotCode(scopes) {
        return _.contains(scopes, 'unimportant') || _.contains(scopes, 'insertion') || _.contains(scopes, 'deletion') || _.contains(scopes, 'info') || _.contains(scopes, 'meta.diff.info.header.from-file') || _.contains(scopes, 'meta.diff.info.header.to-file');
    }
    function isStartTag(tag) {
        return tag % 2 === -1;
    }
    function isEndTag(tag) {
        return tag < 0 && !isStartTag(tag);
    }
    function isLengthTag(tag) {
        return tag >= 0;
    }
})();



var $8Ozu2 = parcelRequire("8Ozu2");
const $447ef372badcee69$var$currentFile = (repo)=>{
    const activeEditor = atom.workspace.getActiveTextEditor();
    if (!activeEditor) return null;
    return repo.relativize(activeEditor.getPath());
};
const $447ef372badcee69$var$setDiffGrammar = ()=>{
    const enableSyntaxHighlighting = atom.config.get("pulsar-git-plus.diffs.syntaxHighlighting");
    const wordDiff = atom.config.get("pulsar-git-plus.diffs.wordDiff");
    let diffGrammar = null;
    if (wordDiff) diffGrammar = (0, (/*@__PURE__*/$parcel$interopDefault($037d78ffbe031ced$exports))).wordGrammar;
    else diffGrammar = (0, (/*@__PURE__*/$parcel$interopDefault($037d78ffbe031ced$exports))).lineGrammar;
    if (enableSyntaxHighlighting) {
        while(atom.grammars.grammarForScopeName("source.diff"))atom.grammars.removeGrammarForScopeName("source.diff");
        atom.grammars.addGrammar(diffGrammar);
    }
};
const $447ef372badcee69$var$getWorkspaceRepos = ()=>atom.project.getRepositories().filter(Boolean);
const $447ef372badcee69$var$onPathsChanged = (gp)=>{
    if (gp) gp.activate();
};
const $447ef372badcee69$var$getWorkspaceNode = ()=>document.querySelector("atom-workspace");
module.exports = {
    config: (0, (/*@__PURE__*/$parcel$interopDefault($2f43d6d148a5e6a3$exports))),
    subscriptions: new (0, $dp3SY$atom.CompositeDisposable)(),
    outputView: null,
    provideService: ()=>(0, (/*@__PURE__*/$parcel$interopDefault($crkkW))),
    activate (_state) {
        $447ef372badcee69$var$setDiffGrammar();
        const repos = $447ef372badcee69$var$getWorkspaceRepos();
        atom.project.onDidChangePaths((_paths)=>$447ef372badcee69$var$onPathsChanged(this));
        if (repos.length === 0 && atom.project.getDirectories().length > 0) this.subscriptions.add(atom.commands.add("atom-workspace", "pulsar-git-plus:init", ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lBjNq)))().then(this.activate)));
        if (repos.length > 0) {
            (0, $7381b32e88b1de32$export$e47526f762851abc)();
            this.subscriptions.add(atom.commands.add("atom-workspace", {
                "pulsar-git-plus:menu": ()=>new (0, (/*@__PURE__*/$parcel$interopDefault($62e5cf1a03f805b3$exports)))(),
                "pulsar-git-plus:add": ()=>(0, $hH1op.default)(),
                "pulsar-git-plus:add-all": ()=>(0, $hH1op.default)(true),
                "pulsar-git-plus:add-modified": ()=>(0, $j90G6.default)(),
                "pulsar-git-plus:commit": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo));
                },
                "pulsar-git-plus:commit-all": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo, {
                            stageChanges: true
                        }));
                },
                "pulsar-git-plus:commit-amend": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>new (0, (/*@__PURE__*/$parcel$interopDefault($bXxVi)))(repo));
                },
                "pulsar-git-plus:add-and-commit": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).add(repo, {
                            file: $447ef372badcee69$var$currentFile(repo)
                        }).then(()=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo)));
                },
                "pulsar-git-plus:add-and-commit-and-push": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).add(repo, {
                            file: $447ef372badcee69$var$currentFile(repo)
                        }).then(()=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo, {
                                andPush: true
                            })));
                },
                "pulsar-git-plus:add-all-and-commit": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).add(repo).then(()=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo)));
                },
                "pulsar-git-plus:add-all-commit-and-push": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).add(repo).then(()=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo, {
                                andPush: true
                            })));
                },
                "pulsar-git-plus:commit-all-and-push": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3mGsE)))(repo, {
                            stageChanges: true,
                            andPush: true
                        }));
                },
                "pulsar-git-plus:checkout": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($2DNX4)))(repo)),
                "pulsar-git-plus:checkout-remote": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($2DNX4)))(repo, {
                            remote: true
                        }));
                },
                "pulsar-git-plus:checkout-current-file": ()=>(0, $dcxBF.default)(),
                "pulsar-git-plus:checkout-all-files": ()=>(0, $dcxBF.default)(true),
                "pulsar-git-plus:new-branch": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($4y5U8)))(repo)),
                "pulsar-git-plus:delete-local-branch": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3O1Aw)))(repo)),
                "pulsar-git-plus:delete-remote-branch": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3O1Aw)))(repo, {
                            remote: true
                        }));
                },
                "pulsar-git-plus:delete-branch-local-and-remote": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3O1Aw)))(repo)).then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3O1Aw)))(repo, {
                            remote: true
                        }));
                },
                "pulsar-git-plus:cherry-pick": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($77LDn)))(repo)),
                "pulsar-git-plus:diff": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($7c2RU)))(repo, {
                            file: $447ef372badcee69$var$currentFile(repo)
                        }));
                },
                "pulsar-git-plus:difftool": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($ejfzQ)))(repo, {
                            file: $447ef372badcee69$var$currentFile(repo)
                        }));
                },
                "pulsar-git-plus:diff-all": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($ggLle)))(repo)),
                "pulsar-git-plus:fetch": ()=>(0, $jd638.default)(),
                "pulsar-git-plus:fetch-prune": ()=>(0, $jd638.default)({
                        prune: true
                    }),
                "pulsar-git-plus:pull": ()=>(0, $km474.default)(),
                "pulsar-git-plus:push": ()=>(0, $cMzzd.default)(),
                "pulsar-git-plus:push-set-upstream": ()=>(0, $cMzzd.default)(true),
                "pulsar-git-plus:remove": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($2mdJF)))(repo, {
                            showSelector: true
                        }));
                },
                "pulsar-git-plus:remove-current-file": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($2mdJF)))(repo)),
                "pulsar-git-plus:reset": ()=>(0, $3piiI.default)(),
                "pulsar-git-plus:show": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($271rL)))(repo)),
                "pulsar-git-plus:log": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($e4WFK)))(repo)),
                "pulsar-git-plus:log-current-file": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($e4WFK)))(repo, {
                            onlyCurrentFile: true
                        }));
                },
                "pulsar-git-plus:stage-hunk": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($lK3FM)))(repo)),
                "pulsar-git-plus:manage-stashes": (0, $dMIZz.default),
                "pulsar-git-plus:stash-save": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($cmRNj)))(repo)),
                "pulsar-git-plus:stash-save-message": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($7TM1C)))(repo));
                },
                "pulsar-git-plus:stash-pop": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($7xGEe)))(repo)),
                "pulsar-git-plus:stash-apply": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($7OvTn)))(repo)),
                "pulsar-git-plus:stash-delete": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($hBbsd)))(repo)),
                "pulsar-git-plus:status": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($9xGRG)))(repo)),
                "pulsar-git-plus:tags": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($8niyI)))(repo)),
                "pulsar-git-plus:run": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>new (0, (/*@__PURE__*/$parcel$interopDefault($ceh8S)))(repo)),
                "pulsar-git-plus:merge": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($d1WP8)))(repo)),
                "pulsar-git-plus:merge-remote": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($d1WP8)))(repo, {
                            remote: true
                        }));
                },
                "pulsar-git-plus:merge-no-fast-forward": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($d1WP8)))(repo, {
                            noFastForward: true
                        }));
                },
                "pulsar-git-plus:rebase": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($l0YAk)))(repo)),
                "pulsar-git-plus:git-open-changed-files": ()=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($7u2hg)))(repo));
                },
                "pulsar-git-plus:toggle-output-view": ()=>{
                    (0, $8Ozu2.viewController).getOutputView().toggle();
                }
            }));
            this.subscriptions.add(atom.commands.add("atom-workspace", "pulsar-git-plus:fetch-all", {
                displayName: "Git-Plus: Fetch All (Repos & Remotes)",
                didDispatch: (_event)=>(0, $eaDLy.default)()
            }));
            this.subscriptions.add(atom.commands.add(".tree-view", {
                "pulsar-git-plus-context:add": ()=>$e20c8f3279d546d3$export$e16d8520af44a096(this.treeView),
                "pulsar-git-plus-context:add-and-commit": ()=>$e20c8f3279d546d3$export$bd0c26474ff2d449(this.treeView),
                "pulsar-git-plus-context:checkout-file": ()=>$e20c8f3279d546d3$export$b968b96c7285d7cb(this.treeView),
                "pulsar-git-plus-context:diff": ()=>$e20c8f3279d546d3$export$a37e3c603d7117e5(this.treeView),
                "pulsar-git-plus-context:diff-all": ()=>$e20c8f3279d546d3$export$a37e3c603d7117e5(this.treeView, true),
                "pulsar-git-plus-context:diff-branches": ()=>$e20c8f3279d546d3$export$39803a6d2aac1a8a(this.treeView),
                "pulsar-git-plus-context:diff-branch-files": ()=>$e20c8f3279d546d3$export$f0a89277a59c083d(this.treeView),
                "pulsar-git-plus-context:difftool": ()=>$e20c8f3279d546d3$export$6eea347271f2f1c2(this.treeView),
                "pulsar-git-plus-context:pull": ()=>$e20c8f3279d546d3$export$be44f282e480703c(this.treeView),
                "pulsar-git-plus-context:push": ()=>$e20c8f3279d546d3$export$4cbf152802aa238(this.treeView),
                "pulsar-git-plus-context:unstage-file": ()=>$e20c8f3279d546d3$export$c854c8b85184a64a(this.treeView)
            }));
            if (atom.config.get("pulsar-git-plus.experimental.diffBranches")) this.subscriptions.add(atom.commands.add("atom-workspace", {
                "pulsar-git-plus:diff-branches": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($3Pi7d)))(repo)),
                "pulsar-git-plus:diff-branch-files": ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((repo)=>(0, (/*@__PURE__*/$parcel$interopDefault($hD9Pz)))(repo))
            }));
            this.subscriptions.add(atom.commands.add("atom-workspace", "pulsar-git-plus:stage-files", ()=>(0, (/*@__PURE__*/$parcel$interopDefault($lppKC))).getRepo().then((0, (/*@__PURE__*/$parcel$interopDefault($4BqoQ))))));
            this.subscriptions.add(atom.config.observe("pulsar-git-plus.diffs.syntaxHighlighting", $447ef372badcee69$var$setDiffGrammar), atom.config.observe("pulsar-git-plus.diffs.wordDiff", $447ef372badcee69$var$setDiffGrammar), atom.config.observe("pulsar-git-plus.experimental.autoFetch", (interval)=>this.autoFetch(interval)));
        }
    },
    deserializeOutputView (_state) {
        return (0, $8Ozu2.viewController).getOutputView();
    },
    deactivate () {
        this.subscriptions.dispose();
        this.statusBarTile?.destroy();
        this.outputView?.destroy();
        clearInterval(this.autoFetchInterval);
    },
    autoFetch (interval) {
        clearInterval(this.autoFetchInterval);
        const fetchIntervalMs = interval * 60000;
        if (fetchIntervalMs) this.autoFetchInterval = setInterval(()=>atom.commands.dispatch($447ef372badcee69$var$getWorkspaceNode(), "pulsar-git-plus:fetch-all"), fetchIntervalMs);
    },
    consumeAutosave ({ dontSaveIf: dontSaveIf }) {
        dontSaveIf((paneItem)=>paneItem.getPath().includes("COMMIT_EDITMSG"));
    },
    consumeStatusBar (statusBar) {
        this.statusBar = statusBar;
        if (atom.config.get("pulsar-git-plus.general.enableStatusBarIcon")) this.setupOutputViewToggle(this.statusBar);
        if ($447ef372badcee69$var$getWorkspaceRepos().length > 0) this.setupBranchesMenuToggle();
    },
    consumeTreeView (treeView) {
        this.treeView = treeView;
        this.treeViewBranchManager = new (0, $349f858fab7a0618$export$1cf3253294c57c75)(treeView);
        this.subscriptions.add(new (0, $dp3SY$atom.Disposable)(()=>{
            this.treeView = null;
            this.treeViewBranchManager.destroy();
            this.treeViewBranchManager = null;
        }));
    },
    setupOutputViewToggle (statusBar) {
        const div = document.createElement("div");
        div.classList.add("inline-block");
        const icon = document.createElement("span");
        icon.textContent = "git+";
        const link = document.createElement("a");
        link.appendChild(icon);
        link.onclick = (_e)=>{
            (0, $8Ozu2.viewController).getOutputView().toggle();
        };
        atom.tooltips.add(div, {
            title: "Toggle Git-Plus Output"
        });
        div.appendChild(link);
        this.statusBarTile = statusBar.addRightTile({
            item: div,
            priority: 0
        });
    },
    setupBranchesMenuToggle () {
        const branchDiv = document.querySelector(".git-view .git-branch");
        if (branchDiv) branchDiv.addEventListener("click", (event)=>{
            const { newBranchKey: newBranchKey } = atom.config.get("pulsar-git-plus.general");
            const wasPressed = (key)=>event[`${key}Key`];
            if (wasPressed(newBranchKey)) atom.commands.dispatch($447ef372badcee69$var$getWorkspaceNode(), "pulsar-git-plus:new-branch");
            else atom.commands.dispatch($447ef372badcee69$var$getWorkspaceNode(), "pulsar-git-plus:checkout");
        });
    }
};


//# sourceMappingURL=main.js.map
