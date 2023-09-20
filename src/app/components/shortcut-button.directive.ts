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
  private shortcutKey: string = '';
  private buttonText: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    console.log('The directive has been initialized');
  }

  ngAfterViewInit(): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    this.buttonText = this.el.nativeElement.innerText;
    this.shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();

    if (this.buttonText.toLowerCase().includes(this.shortcutKey)) {
      const index = this.buttonText.toLowerCase().indexOf(this.shortcutKey);
      const before = this.buttonText.substring(0, index);
      const after = this.buttonText.substring(index + 1);
      this.shortcutSpan = this.renderer.createElement('span');

      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        this.buttonText[index]
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
    } else {
      // If the shortcut letter doesn't exist in the button text
      this.shortcutSpan = this.renderer.createElement('span');
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        `[  ${this.shortcutKey.toUpperCase()}  ] `
      );
      this.renderer.addClass(
        this.shortcutSpan,
        this.getShortcutClass(shortcut || '')
      );
      this.renderer.insertBefore(
        this.el.nativeElement,
        this.shortcutSpan,
        this.el.nativeElement.firstChild
      );
    }

    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      console.log(keyInfo);
      if (
        keyInfo.toLowerCase() === this.getShortcutString(shortcut.toLowerCase())
      ) {
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
        if (
          !this.buttonText
            .toLowerCase()
            .includes(this.shortcutKey.toLowerCase())
        ) {
          this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
        }
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    let buttonText = this.el.nativeElement.innerText.substring(7);
    if (this.shortcutSpan) {
      this.renderer.removeClass(this.shortcutSpan, 'active');
      if (
        !this.buttonText.toLowerCase().includes(this.shortcutKey.toLowerCase())
      ) {
        this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      }
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
      return 'ctrl ' + shortcut.replace(/[()]/g, '');
    if (shortcut.startsWith('['))
      return 'alt ' + shortcut.replace(/[\[\]]/g, '');
    if (shortcut.startsWith('{'))
      return 'ctrl alt ' + shortcut.replace(/[{}]/g, '');
    return '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
