import { Routes } from '@angular/router';
import { Layout } from './features/layout/layout';
import { WorkspacePage } from './features/layout/workspace-page';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => 
			import(`./features/pages/login/login`).then(c => c.Login)
	},
	{
		path: 'register',
		loadComponent: () => 
			import(`./features/pages/register/register`).then(c => c.Register)
	},
    {
        path: '',
        component: Layout,
        children: [
            {
				path: 'dashboard',
				data: { title: 'Dashboard' },
				loadComponent: () => 
					import(`./features/layout/pages/dashboard/dashboard`).then(c => c.Dashboard)
			},
            {
				path: 'schedule',
				data: { title: 'Schedule Manager' },
				loadComponent: () => 
					import(`./features/layout/pages/schedule/schedule`).then(c => c.Schedule)
			},
            {
				path: 'announcements',
				data: { title: 'Announcements' },
				loadComponent: () => 
					import(`./features/layout/pages/announcements/announcements`).then(c => c.Announcements)
			},
            {
				path: 'exams',
				data: { title: 'Exams Manager' },
				loadComponent: () =>
					import(`./features/layout/pages/exams/exams`).then(c => c.Exams)
			},
            {
				path: 'students',
				data: { title: 'Students' },
				loadComponent: () => 
					import(`./features/layout/pages/students/students`).then(c => c.Students)
			},
            {
				path: 'settings',
				data: { title: 'Settings' },
				loadComponent: () => 
					import(`./features/layout/pages/settings/settings`).then(c => c.Settings)
			},
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ],
    },
    { path: '**', redirectTo: 'dashboard' },
];
