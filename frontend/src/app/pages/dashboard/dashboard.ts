import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  isSidebarOpen = false;

  toggleSidebar(){
    this.isSidebarOpen= !this.isSidebarOpen;
  }
}
