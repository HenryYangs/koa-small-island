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
- `middleware`：中间件目录，`Koa`的核心思想，洋葱模型，参考[官方文档](https://koajs.com/#application)

## 项目配置

### Lint 工具

- eslint，配置参考`.eslintrc.js`

### commit 校验工具

- husky，git 钩子工具，[官方文档](https://typicode.github.io/husky/)，配置参考`.husky`目录
- commitlint，git 提交信息校验工具，[官方文档](https://commitlint.js.org/#/)，配置参考`commitlint.config.js`；建议使用`git commit -m ':tada: 初始化项目'`的格式，当前强校验前缀，前缀内容参考[gitmoji](https://gitmoji.carloscuesta.me/)
- validate-branch-name，分支名校验工具，[官方文档](https://github.com/JsonMa/validate-branch-name)，当前强校验分支名必须以`feature`或`bugfix`开头，例如：`feature/test`

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

即可看到 Hello World！


#### 机器人 API 使用
使用 postman 传参测试，推荐 Json 格式

创建机器人
http://localhost:8080/bot/create
必传 username String 不可为空

```json
{
    "username":"[username]"
}
```

查询机器人（当前只有全量查询）
http://localhost:8080/bot/list



二维码打印（可微信扫码）

http://localhost:8080/bot/index

pid int 字段必传，全局唯一，创建时生成

```
        {
            "pid": 272
        }
```

还需要适配，不可用


启动机器人
http://localhost:8080/bot/start
pid int 字段必传，全局唯一，创建时生成
```
        {
            "pid": 272
        }
```

停止机器人
http://localhost:8080/bot/stop
pid int 字段必传，全局唯一，创建时生成

```
        {
            "pid": 272
        }
```

删除机器人
http://localhost:8080/bot/delete
pid int 字段必传，全局唯一，创建时生成
```
        {
            "pid": 272
        }
```

### 正式环境编译

```
yarn run build
```

