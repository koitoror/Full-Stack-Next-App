import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';

type MenuItem = {
  key: string;
  text: string;
  path: string;
  onClick?: (item: MenuItem) => void;
  [propName: string]: any; // This catches any additional props
};

interface Props extends MenuProps {
  items: { leftMenu: MenuItem[]; rightMenu: MenuItem[] };
  needUpperCase?: boolean;
}

const _Menu: React.FC<Props> = ({
  theme,
  mode,
  onClick,
  selectedKeys,
  items,
  needUpperCase = false,
}) => {
  return (
    <Menu
      theme={theme}
      mode={mode}
      onClick={onClick}
      selectedKeys={selectedKeys}
    >
      {items.leftMenu.map(({ key, text, path }) => (
        <Menu.Item key={key}>
          <Link href={path}>
            <a>{needUpperCase ? text.toUpperCase() : text}</a>
          </Link>
        </Menu.Item>
      ))}
      {mode === 'inline' ? <Menu.Divider /> : null}
      {items.rightMenu.map(({ key, text, path }) => (
        <Menu.Item key={key}>
          <Link href={path}>
            <a>{needUpperCase ? text.toUpperCase() : text}</a>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default _Menu;
