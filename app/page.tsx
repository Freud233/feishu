'use client';
import { createClockifyProject, getAllProject } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import { hexToRgbInt32 } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore } from '@/store';
import { IClockifyProject } from '@/type/store';
import {
  Button,
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
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function Home() {
  const { workspaceId, clockifyUserId, projectData, updateProjectData, updateProjectId, projectId } =
    useClockifyStore();
  const [color, setColor] = useState(0);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [projectName, setProjectName] = useState('');
  const { title, updateTitle } = useCalendarStore();
  const { description } = useCalendarDescriptionStore();
  // const onGetLarkCalendarHandle = async () => {
  //   const data = await getLarkCalendar(token);
  //   const cls = data?.data?.calendars;
  //   if (cls) {
  //     const id = cls[0].calendar?.calendar_id || '';
  //     updateCalendarId(id);
  //   }
  // };
  // const onGetTimeEntriesHandle = async () => {
  //   const data = await getTimeEntries(clockifyUserId, workspaceId);
  //   console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data);
  // };

  const onGetAllProjectHandle = async () => {
    if (!workspaceId) return;
    const data = await getAllProject(workspaceId);
    console.log('🚀 ~ onGetAllProjectHandle ~ data:', data);
    updateProjectData(data);
  };
  useEffect(() => {
    onGetAllProjectHandle();
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
        {/* <div className="col-span-1 flex flex-col gap-2 rounded-xl p-2 leading-10">
          <Button onClick={onGetLarkCalendarHandle} variant="ghost" color="primary">
            获取日历列表
          </Button>
          <Button
            as={Link}
            href={`${process.env.NEXT_PUBLIC_REDIRECT_URL || LARK_LOGIN_URL}`}
            variant="ghost"
            color="secondary"
          >
            飞书登录
          </Button>
          <Button color="success" onClick={onGetTimeEntriesHandle} variant="ghost">
            获取时间条目
          </Button>
          <Button variant="ghost" color="secondary" onClick={onGetAllProjectHandle}>
            获取所有项目
          </Button>
        </div> */}
        {/* <div className="col-span-2 row-span-2 flex flex-col gap-3 rounded-xl bg-jade-50 p-4">
          <div>TOKEN: {token}</div>
          <div>日历ID: {calendarId}</div>
          <div>工作区ID: {workspaceId}</div>
          <div>clockify用户ID: {clockifyUserId}</div>
        </div> */}
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
