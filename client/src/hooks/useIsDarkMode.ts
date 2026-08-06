import { useEffect,useState } from "react";

export function useIsDarkMode():boolean{
    const getIsDark = () => 
        typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    const [isDark,setIsDark] = useState(getIsDark);

    useEffect(()=>{
        const root = document.documentElement;
        const update = () => setIsDark(getIsDark());
        update();

        const observer = new MutationObserver(update);
        observer.observe(root,{attributes:true,attributeFilter:["class"]});

        return ()=> observer.disconnect();
    },[]);

    return isDark;
}