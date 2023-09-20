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
  selector: '[keyboard-shortcut]',
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
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    let buttonText = this.el.nativeElement.innerText;
    const shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();

    if (buttonText.toLowerCase().includes(shortcutKey)) {
      const index = buttonText.toLowerCase().indexOf(shortcutKey);
      const before = buttonText.substring(0, index);
      const after = buttonText.substring(index + 1);
      this.shortcutSpan = this.renderer.createElement('span');

      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        buttonText[index]
      );
      this.renderer.addClass(
        this.shortcutSpan,
        this.getShortcutClass(shortcut || '')
      );

      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
      this.renderer.appendChild(
        this.el.nativeElement,
        this.renderer.createText(before)
      );
      this.renderer.appendChild(this.el.nativeElement, this.shortcutSpan);
      this.renderer.appendChild(
        this.el.nativeElement,
        this.renderer.createText(after)
      );
    }

    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      if (keyInfo === this.getShortcutString(shortcut)) {
        this.el.nativeElement.click();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    const shortcutClass = this.getShortcutClass(shortcut || '');

    if (this.shortcutSpan) {
      if (
        (shortcutClass === 'ctrl-shortcut-button' && event.ctrlKey) ||
        (shortcutClass === 'alt-shortcut-button' && event.altKey) ||
        (shortcutClass === 'ctrl-alt-shortcut-button' &&
          event.ctrlKey &&
          event.altKey)
      ) {
        event.preventDefault();
        this.renderer.addClass(this.shortcutSpan, 'active');
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (this.shortcutSpan) {
      this.renderer.removeClass(this.shortcutSpan, 'active');
    }
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
