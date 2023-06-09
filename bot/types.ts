// 机器人的操作类型枚举
export enum EBotOpType {
  CREATE = 'create', // 新增
  START = 'start', // 启动
  STOP = 'stop', // 停止
}

// 机器人的状态枚举
export enum EBotStatusType {
  CREATED = 'created', // 已创建
  RUNNING = 'running', // 运行中
  STOPPED = 'stopped', // 已停止
  DELETED = 'deleted', // 已删除
}

// wechaty 的操作枚举
export enum EWechatyOpType {
  CREATE = 'create', // 创建
  SCAN = 'scan', // 扫描二维码
  LOGIN = 'login', // 登录
  LOGOUT = 'logout', // 登出
}
