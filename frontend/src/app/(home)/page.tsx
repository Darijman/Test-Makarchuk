'use client';

import { Typography } from 'antd';

const { Title } = Typography;

export default function Home() {
  return (
    <div>
      <Title level={1} style={{ margin: 0, textAlign: 'center' }}>
        Home
      </Title>
    </div>
  );
}
