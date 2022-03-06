import React from 'react'
import "../styles/Sidebar.css"

function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
  
}
 
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}

function hide() {
  document.getElementsByClassName('menu')[0].classList.add('hidden')
  document.getElementsByClassName('openbtn')[0].classList.remove('hidden')
}

export default function Sidebar() {
  return (<>
    <div id="mySidepanel">
        <nav class="menu hidden" tabindex="0">
	<div class="smartphone-menu-trigger"></div>
  <a href="javascript:void(0)" class="closebtn" onClick={hide}>&times;</a>
  <header class="avatar">
		<img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" />
    <h2>John D.</h2>
  </header>
  <div class='sidepanel'>
	<ul>
    <li tabindex="0" class="icon-dashboard"><span>Dashboard</span></li>
    <li tabindex="0" class="icon-customers"><span>Customers</span></li>
    <li tabindex="0" class="icon-users"><span>Users</span></li>
    <li tabindex="0" class="icon-settings"><span>Settings</span></li>
  </ul>
  </div>
</nav>


    </div>
    </>
  )
}
