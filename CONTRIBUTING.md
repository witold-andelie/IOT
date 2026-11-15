# 如何参与这个项目（提交 Pull Request）

这份指南写给第一次用 GitHub 协作的组员。照着做，你的修改合并进 `main` 分支后，
你就会出现在仓库首页右侧的 **Contributors** 列表里。

**基本规则**

- 所有修改都通过 **Pull Request（PR）** 提交，由 Wentao 审核后合并。不要直接改 `main`。
- **永远不要提交密码或 `.env` 文件**（仓库是公开的）。
- **不要把录像、大视频文件传到 GitHub**，用共享网盘交给 Wentao。
- 文档用 Markdown（`.md`）写，GitHub 网页上能直接预览效果。

---

## 第 0 步：准备（只做一次）

1. 注册 GitHub 账号：https://github.com/signup
2. 把你的 **GitHub 用户名** 发给 Wentao。Wentao 会把你加为仓库的协作者（collaborator），
   你会收到一封邀请邮件，点 **Accept invitation** 接受。
3. **确认邮箱：** GitHub 只按邮箱认人。到 https://github.com/settings/emails 确认你的邮箱已经验证。
   如果之后在自己电脑上用 `git` 提交，`git` 里设置的邮箱必须和这里的一样（见方法 B），
   否则提交不会算到你的账号上，你也不会出现在 Contributors 里。

---

## 方法 A：直接在 GitHub 网页上改（最简单，推荐给不熟悉 Git 的同学）

适合修改或新建文档。不需要安装任何软件。

### 修改已有文件

1. 打开仓库 https://github.com/witold-andelie/IOT ，进入要改的文件，例如 `video/script.md`。
2. 点右上角的 **铅笔图标（Edit this file）**。
3. 修改内容。可以点 **Preview** 看效果。
4. 点右上角绿色的 **Commit changes…** 按钮，在弹窗里：
   - **Commit message**：用一句英文说明改了什么，例如 `Shorten motivation narration`。
   - 选择 **Create a new branch for this commit and start a pull request**。
   - 分支名写成 `<你的名字>/<改了什么>`，例如 `lijie/motivation-text`。
   - 点 **Propose changes**。
5. 进入 "Open a pull request" 页面：
   - 标题写清楚改了什么；
   - 描述里简单说明为什么改（可以用中文）；
   - 右侧 **Reviewers** 选 `witold-andelie`；
   - 点 **Create pull request**。

### 新建文件

1. 进入要放文件的文件夹（例如 `docs/`）。
2. 点 **Add file → Create new file**。
3. 文件名写成例如 `security.md`（如果要新建文件夹，就写 `文件夹名/文件名.md`）。
4. 写内容，然后同上面第 4、5 步：**Commit changes… → Create a new branch… → Propose changes → Create pull request**。

---

## 方法 B：在自己电脑上用 Git（适合要改代码、或者想多学一点的同学）

### 一次性设置

```bash
git config --global user.name "Your Name"
git config --global user.email "你在 GitHub 上验证过的邮箱"
```

不想公开真实邮箱的话，可以用 GitHub 提供的隐私邮箱，在 https://github.com/settings/emails 能找到，
格式类似 `12345678+username@users.noreply.github.com`。

### 每次修改的流程

```bash
# 1. 第一次：把仓库下载到本地
git clone https://github.com/witold-andelie/IOT.git
cd IOT

# 之后每次开始前：切到 main 并更新到最新
git checkout main
git pull

# 2. 新建一个自己的分支
git checkout -b jingyi/security-doc

# 3. 修改或新建文件……然后查看改了什么
git status
git diff

# 4. 提交
git add docs/security.md
git commit -m "Add security and privacy concept"

# 5. 推送到 GitHub
git push -u origin jingyi/security-doc
```

推送后，终端里会打印一个链接。打开它（或者在仓库页面点黄色提示条上的 **Compare & pull request**），
填写标题和描述，Reviewers 选 `witold-andelie`，点 **Create pull request**。

### PR 需要修改怎么办

审核时 Wentao 可能会在 PR 里留言，请你改某些地方。

- 用方法 A：在 PR 页面点 **Files changed**，找到文件，点右上角 **⋯ → Edit file**，修改后直接提交到同一个分支。
- 用方法 B：在同一个分支上继续修改，再次 `git add`、`git commit`、`git push`。

PR 会自动更新，不需要新开一个。

---

## 合并之后

- Wentao 合并你的 PR 后，你的提交就进入了 `main`。
- Contributors 列表有时要过几个小时才会更新。
- 你可以在 https://github.com/witold-andelie/IOT/graphs/contributors 查看。

## 写 PR 的小建议

- 一个 PR 只做一件事（比如"新增安全文档"），不要把不相关的修改放在一起。
- 提交说明用英文、一句话、动词开头：`Add …`、`Fix …`、`Update …`。
- 改文档时注意和其他文件保持一致（比如价格改了，技术文档和视频台词里的数字也要一起改，或者在 PR 里说明）。
