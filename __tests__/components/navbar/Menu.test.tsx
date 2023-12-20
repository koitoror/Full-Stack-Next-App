// import { render } from '@testing-library/react';
import { fireEvent, render, screen } from "@testing-library/react";
import Menu from '../../../components/navbar/menu';
import { MenuItems } from '../../../components/navbar/menu'; 

describe('Menu', () => {
  it('check the snapshot', async () => {
    const theme = 'dark';
    const mode = 'horizontal';
    const onClick = jest.fn();
    const selectedKeys = ['home'];
    // const items: MenuItems = {
    //   leftMenu: [
    //     { key: 'home', text: 'Home', path: '/' },
    //     { key: 'about', text: 'About', path: '/about' }
    //   ],
    //   rightMenu: [
    //     { key: 'register', text: 'Register', path: '/register' },
    //     { key: 'sign-in', text: 'Sign In', path: '/sign-in' }
    //   ]
    // };

    const items: MenuItems = {
      leftMenu: [
            { key: 'home', text: 'Home', path: '/' },
            { key: 'about', text: 'About', path: '/about' }
          ],
      rightMenu: [
        { key: 'register', text: 'Register', path: '/register' },
        { key: 'sign-in', text: 'Sign In', path: '/sign-in' }
      ],
      length: 2, // Update length based on menu items
      pop: () => ({ key: 'removed', text: 'Removed', path: '' }), // Implement or mock function
      push: (menuItem) => { /* Implement or mock function */ return 3; }, // Update return value
      concat: (menuItems) => ({ ...items, leftMenu: [...items.leftMenu, ...menuItems] }), // Implement or mock function
    };

    const { asFragment } = render(
      <Menu
        theme={theme}
        mode={mode}
        onClick={onClick}
        selectedKeys={selectedKeys}
        items={items}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
