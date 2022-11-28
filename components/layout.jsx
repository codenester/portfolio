import TopNavBar from './top-nav-bar'
import NavBarDrawer from './nav-bar-drawer'
import Setting from './setting'
import { useCookies } from 'react-cookie'
import {useEffect} from 'react'
export default function Layout({children}){
    const [cookie,setCookie]=useCookies(["rithea-theme","rithea-lang"])
    useEffect(()=>{
        const d = new Date();
        d.setDate(d.getDate()+14)
        if(!cookie['rithea-theme']) setCookie("rithea-theme","light",{
            expires:d,
            path:'/'
        })
        if(!cookie['rithea-lang']) setCookie("rithea-lang","en",{
            expires:d,
            path:'/'
        })
        console.log(cookie['rithea-theme'])
    },)
    return <div className={`container ${cookie['rithea-theme']}`}>
        <TopNavBar/>
        <NavBarDrawer/>
        <Setting/>
        {children}
        <p>Published on {new Date().toDateString()}</p>
    </div>
}