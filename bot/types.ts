// 机器人的操作类型枚举
export enum EBotOpType {
  CREATE = 'create', // 新增
  START = 'start', // 启动
  STOP = 'stop', // 停止
  DELETE = 'delete', // 删除
}

export enum EBotStatusType {
  CREATED = 'created', // 已创建
  RUNNING = 'running', // 运行中
  STOPPED = 'stopped', // 已停止
  DELETED = 'deleted', // 已删除
}
