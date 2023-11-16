import SideNav from './SideNav'
import MyNavbar from './mynavbar'
import { useEffect, useState } from 'react';

export default function Layout({children}) {

  const [activeSideLink, setActiveSideLink] = useState('/Home');

  useEffect(() => {
    console.log(activeSideLink);
  }, [activeSideLink]);

  return (
    <div className="main-container">
      <MyNavbar setActiveSideLink={setActiveSideLink} />
        <div className="layout-container">
            <SideNav activeSideLink={activeSideLink} setActiveSideLink={setActiveSideLink}/>
            <div className="page-container">
              {children}
            </div>
        </div>
    </div>
  )
}
