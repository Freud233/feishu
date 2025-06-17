'use client';
import { createTask, getTaskList, patchTask } from '@/actions';
import { createClockifyProject, getAllProject } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import { hexToRgbInt32 } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { ILarkTask } from '@/type';
import { IClockifyProject } from '@/type/store';
import {
  addToast,
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
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function Home() {
  const { workspaceId, clockifyUserId, projectData, updateProjectData, updateProjectId, projectId } =
    useClockifyStore();
  const { token, isTokenExpired, tokenExpiredAt } = useLarkStore()
  const [color, setColor] = useState(0);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [projectName, setProjectName] = useState('');
  const { title, updateTitle } = useCalendarStore();
  const { description } = useCalendarDescriptionStore();
  const [taskList, setTaskList] = useState<ILarkTask[]>()
  const [task, setTask] = useState<string>()
  const onGetTaskHandle = async () => {
    if (!token || isTokenExpired) return
    console.log("🚀 ~ getTaskListData ~ isTokenExpired:", dayjs(tokenExpiredAt).format())
    const { data, code, msg } = await getTaskList(token)
    console.log("🚀 ~ getTaskListData ~ msg:", msg)
    if (code === 0) {
      if (data.items) {
        console.log("🚀 ~ getTaskListData ~ data:", data)
        setTaskList(data.items)
      }
    }
  }
  const onGetAllProjectHandle = async () => {
    if (!workspaceId) return;
    const data = await getAllProject(workspaceId);
    console.log('🚀 ~ onGetAllProjectHandle ~ data:', data);
    updateProjectData(data);
  };

  const onPatchTaskHandle = async (task: ILarkTask) => {
    if (!token || !task) return
    const newTask = { ...task, completed_at: dayjs() + '', status: task.status === 'todo' ? 'done' : 'todo' }
    const { code, msg } = await patchTask(newTask, token)
    console.log("🚀 ~ onPatchTaskHandle ~ msg:", msg)
    if (code === 0) {
      addToast({
        // TODO 换成更美观的动画效果
        title: '已完成任务',
      })
      onGetTaskHandle()
    }
  }

  const onCreateTaskHandle = async () => {
    if (!token || isTokenExpired || !task) return
    // id 成员id, role 负责人 assignee 关注人 follower
    const data = await createTask({ summary: task, members: [{ id: 'ou_a94f013df62163fd13eca73b7ce50a62', role: 'assignee', type: 'user' }] }, token)
    console.log("🚀 ~ onCreateTaskHandle ~ data:", data)
  }
  useEffect(() => {
    onGetAllProjectHandle();
    if (token && (tokenExpiredAt > dayjs().unix())) {
      console.log('token 没有过期');
      onGetTaskHandle()
    }
  }, [clockifyUserId]);
  const ProjectRender = ({ data }: { data: IClockifyProject[] }) => {
    return (
      <Select
        label="项目"
        color="success"
        selectedKeys={[projectId]}
        className="max-w-xl"
        onSelectionChange={(e) => {
          console.log(e.currentKey);
          const colorArr = projectData.filter((i: { id: string | undefined; color: any | ''; }) => {
            if (i.id == e.currentKey) {
              return i.color;
            }
          });
          setColor(hexToRgbInt32(colorArr[0]?.color) || 0);
          updateProjectId(e.currentKey || '');
        }}
      >
        {data.map((item) => (
          <SelectItem key={item.id}>{item.name}</SelectItem>
        ))}
      </Select>
    );
  };

  const addClockifyProject = async () => {
    console.log(projectName, 'projectName');
    if (!projectName || !projectName.length) return toast.warning('请输入正确名字');
    if (projectData.some((item: { name: string; }) => item.name == projectName)) return toast.error('项目名已存在');
    const res = await createClockifyProject(workspaceId, projectName);
    if (res) {
      toast.success('增加项目成功');
      await onGetAllProjectHandle();
    } else {
      toast.warning('添加项目错误');
    }
    onClose();
  };

  return (
    <div className="h-screen">
      <Header></Header>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex flex-col gap-2 rounded-xl">
          {projectData && projectData.length > 0 && (
            <div className="flex items-center gap-2 h-full">
              <ProjectRender data={projectData} />
              <Button className="bg-jade-100  h-full" onPress={onOpen}>
                添加
              </Button>
            </div>
          )}
          <datalist id="project">
            {description &&
              description.map((item: string) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </datalist>
          <Input
            color="primary"
            value={title}
            placeholder="输入标题"
            onValueChange={(e) => updateTitle(e)}
            list="project"
          />
          <MyTimer color={color} />
        </div>
        {/* 未完成任务 */}
        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            <Input isRequired placeholder='输入任务名称' color='secondary' onChange={e => {
              if (!e.target.value) return
              setTask(e.target.value)
            }} isClearable />
            <Button color='success' onPress={onCreateTaskHandle}>确定</Button>
          </div>
          {taskList && taskList.map(item => {
            return <Checkbox key={item.task_id} onChange={() => onPatchTaskHandle(item)}>{item.summary}</Checkbox>
          })}
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
              onValueChange={(e) => setProjectName(e)}
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
