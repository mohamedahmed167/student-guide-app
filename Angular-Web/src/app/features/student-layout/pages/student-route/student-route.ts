import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-student-route',
    template:
        '<section class="min-h-[calc(100vh-4rem)] bg-[#f9f7ff] p-6 pt-20 md:p-9"><h1 class="text-2xl font-bold text-slate-800">{{ title() }}</h1></section>',
})
export class StudentRoute {
    private readonly route = inject(ActivatedRoute);
    protected readonly title = computed(() => this.route.snapshot.data['title'] ?? 'Student Guide');
}
