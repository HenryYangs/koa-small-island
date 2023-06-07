// 机器人的操作类型枚举
export enum EBotOpType {
  CREATE = 'create', // 新增
  PAUSE = 'pause', // 暂停
  RESUME = 'resume', // 恢复
  STOP = 'stop', // 停止
  DELETE = 'delete', // 删除
}

export enum EBotStatusType {
  CREATED = 'created', // 已创建
  RUNNING = 'running', // 运行中
  PAUSED = 'paused', // 已暂停
  STOPPED = 'stopped', // 已停止
  DELETED = 'deleted', // 已删除
}
