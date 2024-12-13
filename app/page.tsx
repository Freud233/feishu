'use client';
import { getLarkCalendar } from '@/actions';
import { getAllProject, getTimeEntries } from '@/actions/clockify';
import Header from '@/components/Header';
import MyTimer from '@/components/MyTimer';
import { LARK_LOGIN_URL } from '@/constants';
import { hexToRgbInt32 } from '@/lib';
import { useClockifyStore, useLarkStore } from '@/store';
import { IClockifyProject } from '@/type/store';
import { Button, Link, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
export default function Home() {
  const { token, calendarId, updateCalendarId } = useLarkStore();
  const { workspaceId, clockifyUserId, projectData, updateProjectData } = useClockifyStore();
  const [projectId, setProjectId] = useState<string>('');
  const [color, setColor] = useState(0);
  const onGetLarkCalendarHandle = async () => {
    const data = await getLarkCalendar(token);
    const cls = data?.data?.calendars;
    if (cls) {
      const id = cls[0].calendar?.calendar_id || '';
      updateCalendarId(id);
    }
  };

  const onGetTimeEntriesHandle = async () => {
    const data = await getTimeEntries(clockifyUserId, workspaceId);
    console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data);
  };

  const onGetAllProjectHandle = async () => {
    const data = await getAllProject(workspaceId);
    console.log('🚀 ~ onGetAllProjectHandle ~ data:', data);
    updateProjectData(data);
  };

  const ProjectRender = ({ data }: { data: IClockifyProject[] }) => {
    return (
      <>
        <Select
          label="项目"
          color="success"
          selectedKeys={[projectId]}
          className="max-w-xl"
          onSelectionChange={(e) => {
            console.log(e.currentKey);
            const colorArr = data.filter((i) => {
              if (i.id == e.currentKey) {
                return i.color;
              }
            });
            setColor(hexToRgbInt32(colorArr[0]?.color) || 0);
            setProjectId(e.currentKey || '');
          }}
        >
          {data.map((item) => (
            <SelectItem key={item.id}>{item.name}</SelectItem>
          ))}
        </Select>
      </>
    );
  };
  return (
    <div className="h-screen">
      <Header></Header>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="col-span-1 flex flex-col gap-2 rounded-xl p-2 leading-10">
          {/* <Button onClick={onGetLarkCalendarHandle} variant="ghost" color="primary">
            获取日历列表
          </Button> */}
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
        </div>
        <div className="col-span-2 row-span-2 flex flex-col gap-3 rounded-xl bg-jade-50 p-4">
          <div>TOKEN: {token}</div>
          <div>日历ID: {calendarId}</div>
          <div>工作区ID: {workspaceId}</div>
          <div>clockify用户ID: {clockifyUserId}</div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl">
          {projectData && projectData.length > 0 && <ProjectRender data={projectData} />}
          <MyTimer
            token={token}
            calendarId={calendarId}
            workspaceId={workspaceId}
            projectId={projectId}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}
