import React from "react";
import "../styles/Header.css"
import "../styles/dropdown.css"

// function show() {
//     document.getElementsByClassName('menu')[0].classList.remove('hidden')
//     document.getElementsByClassName('openbtn')[0].classList.add('hidden')  
// }

function Header()   {
    return(
    <header>
        
        <div className="header">
            {/* <button onClick={show} className='openbtn   '>&#9776;</button> */}
            <div className="link-div">
                <a href="#">Accepted</a>
                <a href="/seekerdeleted">Deleted</a>
                <a href="#">History</a>
                {/* <a href="#">careers</a>
                <a href="#">blog</a> */}
                
            </div>
            {/* <div class="dropdown">
  <button class="dropbtn">Dropdown</button>
  <div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div> */}
        </div>
    </header>
    )
}

export default Header