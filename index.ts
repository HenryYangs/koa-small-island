import Koa from 'koa'
import bodyParser from 'koa-body'
import serve from 'koa-static'
import path from 'path'
import requestMiddleware from './middleware/request'
import logMiddleware from './middleware/logger'
import router from './router'

const app = new Koa()

app.use(bodyParser({ multipart: true }))
app.use(logMiddleware)
app.use(requestMiddleware)
app.use(serve(path.resolve(__dirname, 'static')))
app.use(router.routes())

app.on('error', (error) => {
  console.log('app error: ', error)
})

process.on('uncaughtException', (error) => {
  console.log('uncaught exception: ', error)
})

app.listen(process.env.PORT || 8080)
