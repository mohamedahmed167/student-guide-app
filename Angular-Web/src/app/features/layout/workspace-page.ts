import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace-page',
  template: `
    <section class="mx-auto max-w-7xl p-5 sm:p-8">
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <p class="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Student Guide</p>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{{ title() }}</h1>
        </div>
        <button type="button" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">Add new</button>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Total Students</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">12,482</p>
          <p class="mt-3 text-xs font-medium text-emerald-600">↑ 8.2% from last month</p>
        </article>
        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Active Classes</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">48</p>
          <p class="mt-3 text-xs font-medium text-slate-500">Updated moments ago</p>
        </article>
        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p class="text-sm font-medium text-slate-500">Pending tasks</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">16</p>
          <p class="mt-3 text-xs font-medium text-amber-600">Needs your attention</p>
        </article>
      </div>
    </section>
  `,
})
export class WorkspacePage {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = computed(() => this.route.snapshot.data['title'] ?? 'Dashboard');
}
