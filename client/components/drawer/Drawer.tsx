import { useEffect, useRef, useState } from 'react';
import SideBar from '../sidebar/SideBar';

interface DrawerProps {
  main: JSX.Element | string,
  currentUser?: any;
  className?: string
}

const Drawer = (props: DrawerProps): JSX.Element => {
  const { main, currentUser, className } = props;
  const [visible, setVisible] = useState(false);
  const node = useRef(null);

  const handleClickOutside = (e: Event) => {
    if (node.current?.contains(e.target)) return;
    setVisible(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  return (
    <div
      className={className}
      ref={node}
      onClick={() => {
        setVisible(!visible);
      }}
    >
      {main}
      <SideBar visible={visible} currentUser={ currentUser }/>
    </div>
  );
};

export default Drawer;