import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "@shared/components/navbar/navbar";

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'app-landing',
  imports: [ Navbar, RouterOutlet ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export default class Landing {}