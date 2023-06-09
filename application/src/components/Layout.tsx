const style = {
  wrapper: `overflow-x-hidden h-screen w-screen`,
};

const Layout: React.FC = ({ children }) => {
  return <div className={style.wrapper}>{children}</div>;
};

export default Layout;
