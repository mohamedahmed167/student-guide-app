import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chat, ChatsService } from '../../../../core/services/chats.service';

@Component({
    selector: 'app-announcements',
    imports: [DatePipe, FormsModule],
    templateUrl: './announcements.html',
    styleUrl: './announcements.css',
})
export class Announcements {
  private readonly chatsService = inject(ChatsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly chats = signal<Chat[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSending = signal(false);
  protected readonly error = signal('');
  protected draft = '';

  protected readonly channels = [
    { name: 'General', description: 'Welcome back students! The new semester is here.', icon: '📣', active: true },
    { name: 'Exams & Dates', description: 'Mid-term schedules are now available.', icon: '📅' },
    { name: 'Urgent', description: 'Maintenance update: Science Lab closed.', icon: '⚠️', badge: '2 NEW' },
    { name: 'Academic', description: 'New scholarship opportunities for students.', icon: '🎓' },
  ];

  constructor() {
    this.loadChats();
  }

  protected loadChats(): void {
    this.isLoading.set(true);
    this.error.set('');
    this.chatsService.getChats()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (chats) => this.chats.set(chats),
        error: () => this.error.set('Unable to load announcements. Please try again.'),
      });
  }

  protected sendAnnouncement(): void {
    const content = this.draft.trim();
    if (!content || this.isSending()) return;

    this.isSending.set(true);
    this.error.set('');
    this.chatsService.createChat({ content })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isSending.set(false)))
      .subscribe({
        next: (chat) => {
          this.chats.update((chats) => [chat, ...chats]);
          this.draft = '';
        },
        error: () => this.error.set('Could not send the announcement. Confirm that you are signed in as a leader.'),
      });
  }
}
