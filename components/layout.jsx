import TopNavBar from './top-nav-bar'
import NavBarDrawer from './nav-bar-drawer'
import Setting from './setting'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { LangContext, ThemeContext } from '../contexts'
export default function Layout({ children }) {
    const [cookie, setCookie] = useCookies(["rithea-theme", "rithea-lang"])
    const [theme, setTheme] = useState(cookie['rithea-theme'] ?? "light")
    const [lang, setLang] = useState(cookie['rithea-lang'] ?? 'en')
    useEffect(() => {
        const d = new Date();
        d.setDate(d.getDate() + 14)
        if (!cookie['rithea-theme']) {
            setCookie("rithea-theme", "light", {
                expires: d,
                path: '/'
            })
        }
        if (!cookie['rithea-lang']) {
            setCookie("rithea-lang", "en", {
                expires: d,
                path: '/'
            })
        }
    },)
    return (
        <LangContext.Provider value={{ lang, setLang }}>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <div className={`container ${theme}`}>
                    <TopNavBar />
                    <NavBarDrawer />
                    <Setting />
                    {children}
                    <p>Published on {new Date().toDateString()}</p>
                </div>
            </ThemeContext.Provider>
        </LangContext.Provider>
    )
}