import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentSidebar } from '../../shared/components/student-sidebar/student-sidebar';
import { StudentHeader } from '../../shared/components/student-header/student-header';

@Component({ selector: 'app-student-layout', imports: [RouterOutlet, StudentSidebar, StudentHeader], templateUrl: './student-layout.html' })
export class StudentLayout {}
