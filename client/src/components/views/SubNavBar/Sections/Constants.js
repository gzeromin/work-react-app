import { 
  FormOutlined,
  SettingFilled,
  SettingOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';

export const employee = [
  {
    title: '社員',
    key: '/employee',
    children: [
      {
        title: '勤務表',
        key: '/employee/workSheet',
        switcherIcon: <FormOutlined /> 
      },
      {
        title: 'パスワード',
        key: '/employee/password',
        switcherIcon: <SettingOutlined/>
      }
    ],
  },
];

export const admin = [
  {
    title: '管理',
    key: '/admin',
    children: [
      {
        title: '社員',
        key: '/admin/employee',
        children: [
          { 
            title: '一覧',
            key: '/admin/employee/list', 
            switcherIcon: <UnorderedListOutlined />
          },
          { 
            title: '新規登録',
            key: '/admin/employee/create', 
            switcherIcon: <FormOutlined /> 
          },
          { 
            title: '一括登録', 
            key: '/admin/employee/upload', 
            switcherIcon: <UploadOutlined />
          },
        ],
      },
      {
        title: '勤務表',
        key: '/admin/workSheet',
        children: [
          { 
            title: '休暇管理',
            key: '/admin/workSheet/holidayList', 
            switcherIcon: <UnorderedListOutlined />
          },
          { 
            title: '設定',
            key: '/admin/workSheet/settings',
            switcherIcon: <SettingFilled />,
          },
        ],
      }
    ],
  }
];