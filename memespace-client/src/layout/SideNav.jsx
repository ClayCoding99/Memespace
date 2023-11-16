import React from 'react'
import './SideNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faNetworkWired, faMusic, faSoccerBall, faLaugh, faBarChart, faHome, faEye } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

export default function SideNav({activeSideLink, setActiveSideLink}) {

    const navigate = useNavigate();

    function handleSetActiveSideLink(link) {
        navigate(link);
        setActiveSideLink(link);
    }

    return (
        <aside>
            <section className="aside-top">
                <ul>
                    <li className={activeSideLink === "/home" && "active"} onClick={() => handleSetActiveSideLink("/home")}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon><span>Home</span></li>
                    <li className={activeSideLink === "/popular" && "active"} onClick={() => handleSetActiveSideLink("/popular")}><FontAwesomeIcon icon={faBarChart}></FontAwesomeIcon><span>Popular</span></li>
                    <li className={activeSideLink === "/trending" && "active"} onClick={() => handleSetActiveSideLink("/trending")}><FontAwesomeIcon icon={faEye}></FontAwesomeIcon><span>Trending</span></li>
                </ul>
            </section>
            <section className="aside-content">
                <ul>
                    <h4>Main Groups</h4>
                    <li className={activeSideLink === "/memes" && "active"} onClick={() => handleSetActiveSideLink("/memes")}><FontAwesomeIcon icon={faLaugh}></FontAwesomeIcon><span>Memes</span></li>
                    <li className={activeSideLink === "/gaming" && "active"} onClick={() => handleSetActiveSideLink("/gaming")}><FontAwesomeIcon icon={faGamepad}></FontAwesomeIcon><span>Gaming</span></li>
                    <li className={activeSideLink === "/music" && "active"} onClick={() => handleSetActiveSideLink("/music")}><FontAwesomeIcon icon={faMusic}></FontAwesomeIcon><span>Music</span></li>
                    <li className={activeSideLink === "/media" && "active"} onClick={() => handleSetActiveSideLink("/media")}><FontAwesomeIcon icon={faNetworkWired}></FontAwesomeIcon><span>Media</span></li>
                    <li className={activeSideLink === "/sports" && "active"} onClick={() => handleSetActiveSideLink("/sports")}><FontAwesomeIcon icon={faSoccerBall}></FontAwesomeIcon><span>Sports</span></li>
                </ul>
            </section>
        </aside>
    )
}
