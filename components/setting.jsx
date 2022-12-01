import 'remixicon/fonts/remixicon.css'
import { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { LangContext, ThemeContext } from "../contexts"
import languages from '../utils/language.json'

export default function Setting() {
    const { theme, setTheme } = useContext(ThemeContext)
    const { lang, setLang } = useContext(LangContext)
    const [_, setCookie] = useCookies(['rithea-theme', 'rithea-lang'])
    const [themeIcon, setThemeIcon] = useState(theme === "dark" ? "ri-moon-fill" : "ri-sun-fill")
    function changeTheme() {
        const d = new Date();
        d.setDate(d.getDate() + 14)
        setCookie("rithea-theme", theme === 'light' ? "dark" : "light", {
            expires: d,
            path: '/'
        })
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }
    function changeLang() {
        const d = new Date();
        d.setDate(d.getDate() + 14)
        setCookie("rithea-lang", lang === "en" ? "kh" : "en", {
            expires: d,
            path: '/'
        })
        setLang(prev => prev === "en" ? "kh" : "en")
    }
    useEffect(() => {
        if (theme === 'dark') setThemeIcon(_ => "ri-moon-fill")
        else setThemeIcon(_ => "ri-sun-fill")
    }, [theme])
    return (
        <div className="float-setting-wrap">
            <button className="float-btn pure-text" style={{fontSize:'1.5rem'}}>
                <i className="ri-settings-5-fill"></i>
            </button>
            <div className="float-setting">
                <button className="text" onClick={changeTheme}>
                    <i className={themeIcon}></i>
                    {languages[theme][lang]}
                </button>
                <button style={{ textTransform: 'uppercase' }} className="text" onClick={changeLang}>
                    <i className="ri-translate-2"></i>
                    {languages[lang][lang]}
                </button>
            </div>
        </div>
    )
}
