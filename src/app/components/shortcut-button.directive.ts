import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { ShortcutService } from '../services/shortcut/shortcut.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[data-shortcut]',
})
export class ShortcutButtonDirective implements AfterViewInit, OnDestroy {
  private subscription!: Subscription;
  private shortcutSpan!: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    console.log('The directive has been initialized');
  }

  ngAfterViewInit(): void {
    const shortcut = this.el.nativeElement.getAttribute('data-shortcut');
    const buttonText = this.el.nativeElement.innerText;
    const shortcutKey = shortcut.replace(/[()\[\]{}]/g, '');
    this.shortcutSpan = this.renderer.createElement('span');

    if (buttonText.includes(shortcutKey)) {
      this.renderer.setProperty(this.shortcutSpan, 'innerText', shortcutKey);
      this.renderer.addClass(
        this.shortcutSpan,
        this.getShortcutClass(shortcut)
      );
      this.renderer.appendChild(this.el.nativeElement, this.shortcutSpan);
    }

    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      if (keyInfo === this.getShortcutString(shortcut)) {
        this.el.nativeElement.click();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey) {
      this.renderer.addClass(this.shortcutSpan, 'active');
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    this.renderer.removeClass(this.shortcutSpan, 'active');
  }

  private getShortcutClass(shortcut: string): string {
    if (shortcut.startsWith('(')) return 'ctrl-shortcut-button';
    if (shortcut.startsWith('[')) return 'alt-shortcut-button';
    if (shortcut.startsWith('{')) return 'ctrl-alt-shortcut-button';
    return '';
  }

  private getShortcutString(shortcut: string): string {
    if (shortcut.startsWith('('))
      return 'Ctrl ' + shortcut.replace(/[()]/g, '');
    if (shortcut.startsWith('['))
      return 'Alt ' + shortcut.replace(/[\[\]]/g, '');
    if (shortcut.startsWith('{'))
      return 'Ctrl Alt ' + shortcut.replace(/[{}]/g, '');
    return '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
