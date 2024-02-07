# 个人电脑和多 git 仓库的配置指南

 1. 生成多套公私钥
```bash
ssh-keygen -t rsa -C "your_email@example.com" -f "~/.ssh/id_rsa_github"
ssh-keygen -t rsa -C "your_email@example.com" -f "~/.ssh/id_rsa_gitee"
```
> 虽然一套也可以，但是一旦其中一个泄漏不至于影响另一个。专业的人不做有风险的事儿。

2. 在各自的平台上添加 ssh 公钥
3. 激活，远程身份验证时提供私钥

```bash
ssh-add ~/.ssh/id_rsa_github
ssh-add ~/.ssh/id_rsa_gitee
```

> ssh-add 是一个用于添加 SSH 私钥到 ssh-agent 的命令。ssh-agent 是一个在后台运行的程序，它可以保存你的私钥，并在需要身份验证时提供。
>
> 一旦这些密钥被添加，ssh-agent 就会自动使用它们进行身份验证。也就是说，当你试图通过 SSH 连接到一个远程服务器时，你不需要手动输入你的私钥，ssh-agent 会自动为你处理这个过程。
>
> 如果你想确认哪些密钥已经被添加，你可以运行 ssh-add -l 命令。这个命令会列出所有已经被添加到 ssh-agent 的密钥。
4. 测试

```bash
ssh -T git@github.com
ssh -T git@gitee.com
```