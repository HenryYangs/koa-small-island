# koa-small-island

> 小岛管家后台

## 项目结构

```
├── README.md
├── controller
├── index.ts
├── middleware
│   ├── logger.ts
│   └── request.ts
├── package.json
├── router
│   └── index.ts
├── service
```

### 目录解析

- `index.ts`：项目入口文件
- `router`：路由文件目录
- `controller`：路由控制器目录，处理路由的业务逻辑
- `service`：路由服务目录，处理和数据库相关的交互
- `middleware`：中间件目录，`Koa`的核心思想，洋葱模型，参考[https://koajs.com/#application](官方文档)


## 项目配置

### Lint工具

- eslint，配置参考`.eslintrc.js`

### commit校验工具

- husky，git钩子工具，[https://typicode.github.io/husky/](官方文档)，配置参考`.husky`目录
- commitlint，git提交信息校验工具，[https://commitlint.js.org/#/](官方文档)，配置参考`commitlint.config.js`；建议使用`git commit -m ':tada: 初始化项目'`的格式，当前强校验前缀，前缀内容参考[https://gitmoji.carloscuesta.me/](gitmoji)
- validate-branch-name，分支名校验工具，[https://github.com/JsonMa/validate-branch-name](官方文档)，当前强校验分支名必须以`feature`或`bugfix`开头，例如：`feature/test`

## 开发

> 注意：项目使用 yarn 作为包管理器

```
git clone git@github.com:HenryYangs/koa-small-island.git
cd koa-small-island
yarn install
```

### 本地启动

```
yarn run dev
```

在浏览器输入
```
localhost:8080
```
即可看到Hello World！

### 正式环境编译

```
yarn run build
```
