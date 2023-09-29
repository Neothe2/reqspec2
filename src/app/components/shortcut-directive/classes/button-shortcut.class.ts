import { ElementRef, Renderer2 } from '@angular/core';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

export class ButtonShortcut implements ShortcutClass {
  private el: ElementRef;
  private renderer: Renderer2;
  static readonly tagName: string = 'ion-button';
  buttonText: any;
  shortcutKey: any;
  shortcutSpan: any;
  shortcut: any;
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
    if (this.buttonText.toLowerCase().includes(this.shortcutKey)) {
      this.addShortcutToHeaderIfKeyIsPresent();
    } else {
      this.addShortcutToHeaderIfKeyIsNotPresent();
    }
  }

  createSubscription() {
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      let shortcutString = this.getShortcutString();
      if (keyInfo.toLowerCase() == shortcutString.toLowerCase()) {
        this.el.nativeElement.click();
      }
    });
  }

  addShortcutToHeaderIfKeyIsPresent() {
    const index = this.buttonText.toLowerCase().indexOf(this.shortcutKey);
    const before = this.buttonText.substring(0, index);
    const after = this.buttonText.substring(index + 1);
    this.shortcutSpan = this.renderer.createElement('span');

    this.renderer.setProperty(
      this.shortcutSpan,
      'innerText',
      this.buttonText[index]
    );
    this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());

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

  addShortcutToHeaderIfKeyIsNotPresent() {
    // If the shortcut letter doesn't exist in the button text
    this.shortcutSpan = this.renderer.createElement('span');
    this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
    this.renderer.setProperty(
      this.shortcutSpan,
      'innerText',
      `(${this.shortcutKey.toUpperCase()})`
    );
    this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());
    this.renderer.setStyle(this.shortcutSpan, 'padding-left', '5px');
    this.insertShortcutIntoHeader();
  }

  insertShortcutIntoHeader() {
    this.renderer.appendChild(this.el.nativeElement, this.shortcutSpan);
  }

  getShortcut() {
    this.shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    this.buttonText = this.el.nativeElement.innerText;
    this.shortcutKey = (
      this.shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();
  }

  getShortcutClass(): string {
    if (this.shortcut.startsWith('(')) return 'ctrl-shortcut-button';
    if (this.shortcut.startsWith('[')) return 'alt-shortcut-button';
    if (this.shortcut.startsWith('{')) return 'ctrl-alt-shortcut-button';
    return '';
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
          !this.buttonText
            .toLowerCase()
            .includes(this.shortcutKey.toLowerCase())
        ) {
          this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
        }
      }
    }
  }

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

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
