import { useContext } from "react"
import { LangContext, ThemeContext } from "../contexts"

export default function Setting() {
    const { theme, setTheme } = useContext(ThemeContext)
    const { lang, setLang } = useContext(LangContext)
    return <div className="float-setting">
        <button>
            <i class="ri-moon-fill"></i>
            {theme}
        </button>
        <button>
            <i class="ri-translate-2"></i>
            {lang}
        </button>
    </div>
}