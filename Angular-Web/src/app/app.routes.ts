import { Routes } from '@angular/router';
import { Layout } from './features/layout/layout';
import { StudentLayout } from './features/student-layout/student-layout';
import { StudentRoute } from './features/student-layout/pages/student-route/student-route';

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
    {
        path: 'student',
        component: StudentLayout,
        children: [
            { path: 'dashboard', loadComponent: () => import('./features/student-layout/pages/student-dashboard/student-dashboard').then(c => c.StudentDashboard) },
            { path: 'academic', data: { title: 'Academic' }, component: StudentRoute },
            { path: 'gpa', loadComponent: () => import('./features/student-layout/pages/gpa/gpa').then(c => c.Gpa) },
            { path: 'schedule', loadComponent: () => import('./features/student-layout/pages/student-schedule/student-schedule').then(c => c.StudentSchedule) },
            { path: 'quick-links', data: { title: 'Quick Links' }, component: StudentRoute },
            { path: 'profile', loadComponent: () => import('./features/student-layout/pages/profile/profile').then(c => c.Profile) },
            { path: 'settings', data: { title: 'Settings' }, component: StudentRoute },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ],
    },
    { path: '**', redirectTo: 'dashboard' },
];
