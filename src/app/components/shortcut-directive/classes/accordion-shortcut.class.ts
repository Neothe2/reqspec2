import { ElementRef, Renderer2 } from '@angular/core';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

export class AccordionShortcut implements ShortcutClass {
  private el: ElementRef;
  private renderer: Renderer2;
  static readonly tagName: string = 'ion-accordion';
  labelText: string = '';
  shortcutKey: string = '';
  shortcutSpan: any;
  shortcut: string = '';
  subscription: any;

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    this.el = el;
    this.renderer = renderer;
  }

  afterViewInit(): void {
    this.getShortcut();
    this.addShortcutToHeader();
    this.createSubscription();
  }

  addShortcutToHeader(): void {
    const labelElement = this.el.nativeElement.querySelector('ion-label');
    if (this.labelText.toLowerCase().includes(this.shortcutKey.toLowerCase())) {
      this.addShortcutToHeaderIfKeyIsPresent(labelElement);
    } else {
      this.addShortcutToHeaderIfKeyIsNotPresent(labelElement);
    }
  }

  addShortcutToHeaderIfKeyIsPresent(labelElement: any): void {
    const index = this.labelText.toLowerCase().indexOf(this.shortcutKey);
    const before = this.labelText.substring(0, index);
    const after = this.labelText.substring(index + 1);
    this.shortcutSpan = this.renderer.createElement('span');

    this.renderer.setProperty(
      this.shortcutSpan,
      'innerText',
      this.labelText[index]
    );
    this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());

    this.renderer.setProperty(labelElement, 'innerHTML', '');
    this.renderer.appendChild(labelElement, this.renderer.createText(before));
    this.renderer.appendChild(labelElement, this.shortcutSpan);
    this.renderer.appendChild(labelElement, this.renderer.createText(after));
  }

  addShortcutToHeaderIfKeyIsNotPresent(labelElement: any): void {
    this.shortcutSpan = this.renderer.createElement('span');
    this.renderer.setProperty(
      this.shortcutSpan,
      'innerText',
      `(${this.shortcutKey.toUpperCase()})`
    );
    this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
    this.renderer.setStyle(this.shortcutSpan, 'padding-left', '5px');

    this.renderer.appendChild(labelElement, this.shortcutSpan);
  }

  createSubscription() {
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      if (keyInfo.toLowerCase() === this.getShortcutString().toLowerCase()) {
        const button = this.el.nativeElement.querySelector('button');
        button.click();
      }
    });
  }

  getShortcut(): void {
    this.shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    const labelElement = this.el.nativeElement.querySelector('ion-label');
    this.labelText = labelElement ? labelElement.innerText : '';
    this.shortcutKey = (
      this.shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();
  }

  getShortcutString(): string {
    if (this.shortcut.startsWith('('))
      return 'ctrl ' + this.shortcut.replace(/[()]/g, '');
    if (this.shortcut.startsWith('['))
      return 'alt ' + this.shortcut.replace(/[\[\]]/g, '');
    if (this.shortcut.startsWith('{'))
      return 'ctrl alt ' + this.shortcut.replace(/[{}]/g, '');
    return '';
  }
  getShortcutClass(): string {
    if (this.shortcut.startsWith('(')) return 'ctrl-shortcut-button';
    if (this.shortcut.startsWith('[')) return 'alt-shortcut-button';
    if (this.shortcut.startsWith('{')) return 'ctrl-alt-shortcut-button';
    return '';
  }

  handleKeyDown(event: KeyboardEvent): void {
    const shortcutClass = this.getShortcutClass();

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
          !this.labelText.toLowerCase().includes(this.shortcutKey.toLowerCase())
        ) {
          this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
        }
      }
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (this.shortcutSpan) {
      this.renderer.removeClass(this.shortcutSpan, 'active');
      if (
        !this.labelText.toLowerCase().includes(this.shortcutKey.toLowerCase())
      ) {
        this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      }
    }
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
