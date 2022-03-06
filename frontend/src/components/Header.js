import React from "react";
import "../styles/Header.css"

function show() {
    document.getElementsByClassName('menu')[0].classList.remove('hidden')
    document.getElementsByClassName('openbtn')[0].classList.add('hidden')  
}

function Header()   {
    return(
    <header>
        
        <div className="header">
            <button onClick={show} className='openbtn   '>&#9776;</button>
            <div className="link-div">
                <a href="#">home</a>
                <a href="#">about</a>
                <a href="#">learn</a>
                <a href="#">careers</a>
                <a href="#">blog</a>
                <a href="#">contact</a>
            </div>
        </div>
    </header>
    )
}

export default Header