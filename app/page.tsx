'use client';

import { createTask, getTaskList, patchTask } from '@/actions';
import { createClockifyProject, getAllProject } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import {
  AddIcon,
  Button,
  Card,
  Chip,
  Dialog,
  MdCheckbox,
  SelectField,
  TaskIcon,
  TextField,
} from '@/components/ui/md3';
import { CODE, LARK_TASK_ASSIGNEE_ID } from '@/constants';
import { hasTokenExpired, hexToRgbInt32 } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { ILarkTask } from '@/type';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Home() {
  const { workspaceId, projectData, updateProjectData, updateProjectId, projectId } = useClockifyStore();
  const { token, tokenExpiredAt } = useLarkStore();
  const [color, setColor] = useState(0);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { title, updateTitle } = useCalendarStore();
  const { description } = useCalendarDescriptionStore();
  const [taskList, setTaskList] = useState<ILarkTask[]>([]);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const onGetTaskHandle = useCallback(async () => {
    if (!token || hasTokenExpired(tokenExpiredAt)) return;
    setIsLoading(true);
    try {
      const { data, code, msg } = await getTaskList(token);
      if (code === CODE.OK) {
        setTaskList(data?.items ?? []);
      } else {
        toast.warning(msg || '获取任务列表失败');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, tokenExpiredAt]);

  const onGetAllProjectHandle = useCallback(async () => {
    if (!workspaceId) return;
    const { code, data, msg } = await getAllProject(workspaceId);
    if (code === CODE.OK) {
      updateProjectData(data ?? []);
    } else {
      toast.warning(msg || '获取项目列表失败');
    }
  }, [workspaceId, updateProjectData]);

  // 依赖补全：token / 过期时间变化后会重新拉取任务，不再依赖陈旧的闭包
  useEffect(() => {
    onGetAllProjectHandle();
    onGetTaskHandle();
  }, [onGetAllProjectHandle, onGetTaskHandle]);

  const onPatchTaskHandle = async (item: ILarkTask) => {
    if (!token || hasTokenExpired(tokenExpiredAt)) {
      toast.warning('登录已过期，请重新登录');
      return;
    }
    const nextTask = { ...item, status: item.status === 'todo' ? 'done' : 'todo' };
    const { code, msg } = await patchTask(nextTask, token);
    if (code === CODE.OK) {
      toast.success('任务状态已更新');
      await onGetTaskHandle();
    } else {
      toast.warning(msg || '更新任务失败');
    }
  };

  const onCreateTaskHandle = async () => {
    if (isCreating) return;
    if (!token || hasTokenExpired(tokenExpiredAt)) {
      toast.warning('登录已过期，请重新登录');
      return;
    }
    if (!task.trim()) {
      toast.warning('请输入任务名称');
      return;
    }
    setIsCreating(true);
    try {
      const { code, msg } = await createTask(
        {
          summary: task.trim(),
          members: [{ id: LARK_TASK_ASSIGNEE_ID, role: 'assignee', type: 'user' }],
        },
        token,
      );
      if (code === CODE.OK) {
        toast.success('创建任务成功');
        setTask('');
        await onGetTaskHandle();
      } else {
        toast.warning(msg || '创建任务失败');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const onSelectProject = (id: string) => {
    // 原实现用 filter 取颜色（回调里 return i.color 当成布尔用），再取可能不存在的 [0]
    const selected = projectData.find((item) => item.id === id);
    setColor(hexToRgbInt32(selected?.color));
    updateProjectId(id);
  };

  const closeProjectDialog = useCallback(() => setIsProjectDialogOpen(false), []);

  const addClockifyProject = async () => {
    if (!projectName.trim()) {
      toast.warning('请输入正确名字');
      return;
    }
    const { code, msg } = await createClockifyProject(workspaceId, projectName);
    if (code === CODE.OK) {
      toast.success('增加项目成功');
      setProjectName('');
      await onGetAllProjectHandle();
    } else {
      toast.warning(msg || '添加项目错误');
    }
    closeProjectDialog();
  };

  const openProjectDialog = () => {
    setProjectName('');
    setIsProjectDialogOpen(true);
  };

  const isConnected = Boolean(token) && !hasTokenExpired(tokenExpiredAt);

  // 保证 select 的 value 始终能匹配到选项，避免出现「显示第一项但状态为空」
  const projectOptions = projectData.map((item) => ({ value: item.id, label: item.name }));
  if (!projectData.some((item) => item.id === projectId)) {
    projectOptions.unshift({
      value: projectId || '',
      label: projectData.length ? '请选择项目' : '暂无项目，请先添加',
    });
  }

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="md-type-headline-lg">工作台</h1>
            <p className="md-type-body-md mt-1 text-md-on-surface-variant">
              记录一段专注时间，并同步到飞书日程与 Clockify
            </p>
          </div>
          <Chip variant={isConnected ? 'assist' : 'input'}>
            <span className="md-chip--dot" />
            {isConnected ? '飞书已连接' : '未连接飞书'}
          </Chip>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* 计时与项目 */}
          <Card variant="outlined" className="p-5 md:p-6">
            <div className="mb-5">
              <h2 className="md-type-title-lg">新建记录</h2>
              <p className="md-type-body-sm mt-1 text-md-on-surface-variant">项目、标题与计时会一起写入日程</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <SelectField
                className="min-w-0 flex-1"
                label="Clockify 项目"
                value={projectId}
                onValueChange={onSelectProject}
                options={projectOptions}
              />
              <Button variant="tonal" className="shrink-0" icon={<AddIcon />} onClick={openProjectDialog}>
                添加项目
              </Button>
            </div>

            <datalist id="project">
              {description.map((item: string) => (
                <option value={item} key={item} />
              ))}
            </datalist>

            <TextField
              className="mt-4"
              label="日程标题"
              value={title}
              onValueChange={updateTitle}
              list="project"
              clearable
              supportingText="输入时可复用历史标题"
            />

            <div className="mt-5">
              <MyTimer color={color} />
            </div>
          </Card>

          {/* 飞书任务 */}
          <Card variant="filled" className="flex flex-col p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="md-type-title-lg">飞书任务</h2>
                <p className="md-type-body-sm mt-1 text-md-on-surface-variant">勾选即可切换完成状态</p>
              </div>
              {isLoading ? (
                <span className="md-spinner text-md-on-surface-variant" aria-label="加载中" />
              ) : (
                <Chip>{taskList.length} 项</Chip>
              )}
            </div>

            <div className="flex items-end gap-3">
              <TextField
                className="min-w-0 flex-1"
                label="新任务名称"
                value={task}
                onValueChange={setTask}
                clearable
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing) void onCreateTaskHandle();
                }}
              />
              <Button
                className="mb-1 shrink-0"
                onClick={onCreateTaskHandle}
                loading={isCreating}
                icon={<AddIcon />}
              >
                创建
              </Button>
            </div>

            {taskList.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="md-avatar bg-md-secondary-container text-md-on-secondary-container">
                  <TaskIcon />
                </span>
                <p className="md-type-title-sm">暂无任务</p>
                <p className="md-type-body-sm text-md-on-surface-variant">在上方输入名称即可创建飞书任务</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col">
                {taskList.map((item, index) => (
                  <Fragment key={item.task_id}>
                    {index > 0 ? <div className="md-divider mx-4" /> : null}
                    <MdCheckbox
                      checked={item.status === 'done'}
                      onChange={() => onPatchTaskHandle(item)}
                      label={item.summary}
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </Card>
        </div>

        <p className="md-type-body-sm mt-10 text-center text-md-on-surface-variant">
          亮 / 暗主题可在右上角切换，默认跟随系统设置
        </p>
      </main>

      <Dialog
        open={isProjectDialogOpen}
        onClose={closeProjectDialog}
        title="添加 Clockify 项目"
        actions={
          <>
            <Button variant="text" onClick={closeProjectDialog}>
              取消
            </Button>
            <Button icon={<AddIcon />} onClick={addClockifyProject}>
              添加
            </Button>
          </>
        }
      >
        <TextField label="项目名称" value={projectName} onValueChange={setProjectName} autoFocus />
        <p className="md-type-body-sm mt-3">新项目会创建在当前 Clockify 工作区中。</p>
      </Dialog>
    </div>
  );
}
