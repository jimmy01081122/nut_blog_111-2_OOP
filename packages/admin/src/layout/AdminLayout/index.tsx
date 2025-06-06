import { Icon as LegacyIcon } from '@ant-design/compatible';
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Layout, Menu, Row } from 'antd';
import cls from 'classnames';
import Link from 'next/link';
import { default as Router, useRouter } from 'next/router';
import React, { useContext } from 'react';

import { UserInfo } from '@/components/UserInfo';
import { GlobalContext } from '@/context/global';
import { useSetting } from '@/hooks/useSetting';

import style from './index.module.scss';
import { findActiveMenu, menus } from './menus';
import { ResourceCreate } from './ResourceCreate';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

export const AdminLayout: React.FC<{ headerAppender?: React.ReactNode }> = ({ headerAppender, children }) => {
  const { collapsed, toggleCollapse } = useContext(GlobalContext);
  const setting = useSetting();
  const router = useRouter();
  const { pathname } = router;
  const [activeMenu, breadcrumbs] = findActiveMenu(pathname);

  const renderMenuItem = (menu) => (
    <Menu.Item key={menu.path} onClick={() => Router.push(menu.path)}>
      <Link href={menu.path}>
        <a
          className={cls({
            [style.active]: activeMenu && activeMenu.path === menu.path,
          })}
        >
          <LegacyIcon type={menu.icon} />
          <span>{menu.title}</span>
        </a>
      </Link>
    </Menu.Item>
  );

  const MenuContent = (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[activeMenu && activeMenu.path]}>
      {menus
        .filter((m) => !m.ignore)
        .map((menu) => {
          return menu.children ? (
            <SubMenu key={menu.title} icon={<LegacyIcon type={menu.icon} />} title={menu.title}>
              {menu.children.filter((m) => !m.ignore).map(renderMenuItem)}
            </SubMenu>
          ) : (
            renderMenuItem(menu)
          );
        })}
    </Menu>
  );

  return (
    <Layout className={style.container}>
      <Sider className={style.asider} trigger={null} collapsible={true} collapsed={collapsed}>
        <div className={style.logo}>
          {setting.systemFavicon && <img src={setting.systemFavicon} />}
          {!collapsed && <span style={{ marginLeft: 4 }}>管理後台</span>}
        </div>
        <div className={style.resourceCreate}>
          <ResourceCreate collapsed={collapsed} />
        </div>
        {MenuContent}
      </Sider>
      <Layout className={style.main}>
        <header>
          <Row>
            <Col span={12}>
              <LegacyIcon className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={toggleCollapse} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <div className={style.info}>
                <UserInfo />
              </div>
            </Col>
          </Row>
        </header>
        <Content className={style.content}>
          <header>
            <Breadcrumb>
              {breadcrumbs.map((breadcrumb) => {
                return (
                  <Breadcrumb.Item key={breadcrumb.path}>
                    <Link href={breadcrumb.path}>
                      <a>{breadcrumb.title}</a>
                    </Link>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
            <div className={style.title}>{activeMenu && activeMenu.label}</div>
            {headerAppender && <div>{headerAppender}</div>}
          </header>
          <main>
            {children}
            <footer>
              <ul className={style.icons}></ul>
            </footer>
          </main>
        </Content>
      </Layout>
    </Layout>
  );
};
