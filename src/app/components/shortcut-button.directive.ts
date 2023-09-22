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

  private listItems: NodeListOf<HTMLElement> | null = null;
  private focusedElementIndex: number = -1;

  private cardHeader!: HTMLElement;
  private cardListItems: NodeListOf<HTMLElement> | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    console.log('The directive has been initialized');
  }

  ngAfterViewInit(): void {
    const tagName = this.el.nativeElement.tagName.toLowerCase();

    if (tagName === 'ion-card') {
      // Logic for ion-card
      this.cardHeader = this.el.nativeElement.querySelector('ion-card-header');
      this.cardListItems = this.el.nativeElement.querySelectorAll('ion-item');
      this.addShortcutToCardHeader();
    } else {
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

      this.subscription = this.shortcutService.shortcut$.subscribe(
        (keyInfo) => {
          console.log(keyInfo);
          if (
            keyInfo.toLowerCase() ===
            this.getShortcutString(shortcut.toLowerCase())
          ) {
            this.el.nativeElement.click();
          }
        }
      );
    }
  }

  private addShortcutToCardHeader(): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    const shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toUpperCase();
    const shortcutSpan = this.renderer.createElement('span');
    this.renderer.setProperty(shortcutSpan, 'innerText', `[${shortcutKey}]`);
    this.renderer.addClass(shortcutSpan, 'hidden-shortcut');
    this.renderer.appendChild(this.cardHeader, shortcutSpan);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const tagName = this.el.nativeElement.tagName.toLowerCase();
    if (tagName === 'button' || tagName == 'ion-button') {
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
    } else if (tagName === 'ion-card') {
      // Logic for list items
      if (!this.listItems) {
        this.listItems = this.el.nativeElement.querySelectorAll('ion-item');
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusedElementIndex = Math.max(0, this.focusedElementIndex - 1);
        this.focusOnElement();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusedElementIndex = Math.min(
          this.listItems!.length - 1,
          this.focusedElementIndex + 1
        );
        this.focusOnElement();
      } else if (event.key === 'Enter' && this.focusedElementIndex >= 0) {
        event.preventDefault();
        this.listItems![this.focusedElementIndex].click();
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

  private focusOnElement(): void {
    if (this.focusedElementIndex >= 0 && this.listItems) {
      this.listItems.forEach((item, index) => {
        if (index === this.focusedElementIndex) {
          this.renderer.addClass(item, 'focused');
          item.focus();
        } else {
          this.renderer.removeClass(item, 'focused');
        }
      });
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
