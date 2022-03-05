import React from 'react'
import "../styles/Sidebar.css"

export default function Sidebar() {
  return (
    <div>
        <nav class="menu" tabindex="0">
	<div class="smartphone-menu-trigger"></div>
  <header class="avatar">
		<img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" />
    <h2>John D.</h2>
  </header>
	<ul>
    <li tabindex="0" class="icon-dashboard"><span>Dashboard</span></li>
    <li tabindex="0" class="icon-customers"><span>Customers</span></li>
    <li tabindex="0" class="icon-users"><span>Users</span></li>
    <li tabindex="0" class="icon-settings"><span>Settings</span></li>
  </ul>
</nav>


    </div>
  )
}
