'use client';
import { createTask, getTaskList, patchTask } from '@/actions';
import { createClockifyProject, getAllProject } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import { CODE, LARK_TASK_ASSIGNEE_ID } from '@/constants';
import { hasTokenExpired, hexToRgbInt32 } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { ILarkTask } from '@/type';
import { IClockifyProject } from '@/type/store';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * 项目下拉框提到组件外部。
 * 原实现定义在 Home 内部，父组件每次重渲染都会生成新的组件类型，
 * 导致 Select 被卸载重挂载、选中态丢失，并带来无意义的渲染开销。
 */
const ProjectRender = ({
  data,
  projectId,
  onSelect,
}: {
  data: IClockifyProject[];
  projectId: string;
  onSelect: (id: string) => void;
}) => (
  <Select
    label="项目"
    color="success"
    selectedKeys={[projectId]}
    className="max-w-xl"
    onSelectionChange={(e) => onSelect(e.currentKey?.toString() ?? '')}
  >
    {data.map((item) => (
      <SelectItem key={item.id}>{item.name}</SelectItem>
    ))}
  </Select>
);

export default function Home() {
  const { workspaceId, projectData, updateProjectData, updateProjectId, projectId } = useClockifyStore();
  const { token, tokenExpiredAt } = useLarkStore();
  const [color, setColor] = useState(0);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [projectName, setProjectName] = useState('');
  const { title, updateTitle } = useCalendarStore();
  const { description } = useCalendarDescriptionStore();
  const [taskList, setTaskList] = useState<ILarkTask[]>([]);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (!token || hasTokenExpired(tokenExpiredAt)) {
      toast.warning('登录已过期，请重新登录');
      return;
    }
    if (!task.trim()) {
      toast.warning('请输入任务名称');
      return;
    }
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
  };

  const onSelectProject = (id: string) => {
    // 原实现用 filter 取颜色（回调里 return i.color 当成布尔用），再取可能不存在的 [0]
    const selected = projectData.find((item) => item.id === id);
    setColor(hexToRgbInt32(selected?.color));
    updateProjectId(id);
  };

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
    onClose();
  };

  return (
    <div className="h-screen">
      <Header></Header>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex flex-col gap-2 rounded-xl">
          {projectData.length > 0 && (
            <div className="flex h-full items-center gap-2">
              <ProjectRender data={projectData} projectId={projectId} onSelect={onSelectProject} />
              <Button className="bg-jade-100  h-full" onPress={onOpen}>
                添加
              </Button>
            </div>
          )}
          <datalist id="project">
            {description.map((item: string) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </datalist>
          <Input
            color="primary"
            value={title}
            placeholder="输入标题"
            onValueChange={updateTitle}
            list="project"
          />
          <MyTimer color={color} />
        </div>
        {/* 未完成任务 */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              isRequired
              placeholder="输入任务名称"
              color="secondary"
              value={task}
              onValueChange={setTask}
              isClearable
            />
            <Button color="success" onPress={onCreateTaskHandle} isLoading={isLoading}>
              确定
            </Button>
          </div>
          {taskList.map((item) => (
            <Checkbox key={item.task_id} onChange={() => onPatchTaskHandle(item)}>
              {item.summary}
            </Checkbox>
          ))}
        </div>
      </div>
      {/* 新增项目modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>添加项目</ModalHeader>
          <ModalBody>
            <Input
              color="success"
              placeholder="输入项目名"
              value={projectName}
              onValueChange={setProjectName}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" color="danger" onPress={onClose}>
              取消
            </Button>
            <Button color="success" onPress={addClockifyProject}>
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
