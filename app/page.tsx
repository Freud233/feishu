'use client';
import { getTaskList, patchTask } from '@/actions';
import { createClockifyProject, getAllProject } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import { hexToRgbInt32 } from '@/lib';
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
} from '@nextui-org/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function Home() {
  const { workspaceId, clockifyUserId, projectData, updateProjectData, updateProjectId, projectId } =
    useClockifyStore();
  const { token } = useLarkStore()
  console.log("🚀 ~ Home ~ token:", token)
  const [color, setColor] = useState(0);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [projectName, setProjectName] = useState('');
  const { title, updateTitle } = useCalendarStore();
  const { description } = useCalendarDescriptionStore();
  const [taskList, setTaskList] = useState<ILarkTask[]>()
  const getTaskListData = async () => {
    if (!token) return
    const { data, code, msg } = await getTaskList(token)
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
    const { code } = await patchTask(newTask, token)
    if (code === 0) getTaskListData()
  }
  useEffect(() => {
    onGetAllProjectHandle();
    if (token) {
      getTaskListData()
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
          const colorArr = projectData.filter((i) => {
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
    if (projectData.some((item) => item.name == projectName)) return toast.error('项目名已存在');
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
        <div className="flex h-14 flex-col gap-2 rounded-xl">
          {projectData && projectData.length > 0 && (
            <div className="flex items-center gap-2">
              <ProjectRender data={projectData} />
              <Button className="h-full bg-jade-100" onPress={onOpen}>
                添加
              </Button>
            </div>
          )}
          <datalist id="project">
            {description &&
              description.map((item) => (
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
        <div className='flex flex-col gap-2'>
          {taskList && taskList.map(item => {
            return <div key={item.task_id}>
              <Checkbox onClick={() => onPatchTaskHandle(item)}>{item.summary}</Checkbox>
              <p>{item.guid}</p>
            </div>
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
