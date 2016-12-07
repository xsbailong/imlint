##imlint
### Screenshot
![imlint-init](https://raw.githubusercontent.com/xsbailong/img/master/imlint/imlint-init.gif)
![imlint-check](https://raw.githubusercontent.com/xsbailong/img/master/imlint/imlint-check.gif)
### Start
#### 新项目接入
```bash
cd 新项目目录
git init
npm init
imlint init
```

#### 老项目接入
```bash
imlint init
```

### Usage
```bash
imlint init 初始化项目

imlint check 检测当前目录
imlint check a.js 检测当前目录的a.js
imlint check test/a.scss 检测test/a.scss
imlint check test1 test2 检测test1, test2目录

imlint hook 手动安装项目git钩子
imlint hook -d 卸载项目git钩子
```

### API
```javascript
var imlint = require('imlint');
imlint.check([filename1, filename2]);
```

### 相关
* [sasslint](https://github.com/sasstools/sass-lint) 配置及依赖
* [eslint](http://eslint.org/) 及依赖
* [editorconfig](http://editorconfig.org/) 推荐配置
* [gitignore](https://git-scm.com/docs/gitignore) 推荐设置
