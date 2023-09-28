import { ElementRef, Renderer2 } from '@angular/core';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

export class InputShortcut implements ShortcutClass {
  private el: ElementRef;
  private renderer: Renderer2;
  private ionInput: any;
  static readonly tagName: string = 'ion-item';
  shortcut: any;
  shortcutKey: any;
  shortcutSpan: any;
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
    this.ionInput = this.ionInput =
      this.el.nativeElement.querySelector('ion-input');
    this.getShortcut();
    this.createSubscription();
    this.addShortcutToHeader();
  }

  createSubscription() {
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      console.log(keyInfo.toLowerCase());
      let shortcutString = this.getShortcutString();
      console.log(shortcutString.toLowerCase());
      if (keyInfo.toLowerCase() == shortcutString.toLowerCase()) {
        if (this.ionInput) {
          this.ionInput.focus();
        }
      }
    });
  }

  addShortcutToHeader() {
    const labelElem = this.el.nativeElement.querySelector('ion-label');
    let labelText = labelElem ? labelElem.innerText : '';

    if (labelText.toLowerCase().includes(this.shortcutKey)) {
      // If the shortcut letter exists in the label text, underline it
      const index = labelText.toLowerCase().indexOf(this.shortcutKey);
      const before = labelText.substring(0, index);
      const after = labelText.substring(index + 1);
      this.shortcutSpan = this.renderer.createElement('u');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        labelText[index]
      );
      this.renderer.setProperty(labelElem, 'innerHTML', '');
      this.renderer.appendChild(labelElem, this.renderer.createText(before));
      this.renderer.appendChild(labelElem, this.shortcutSpan);
      this.renderer.appendChild(labelElem, this.renderer.createText(after));
    } else {
      // Add a hidden label before the input if the shortcut letter doesn't exist in the label text
      this.shortcutSpan = this.renderer.createElement('span');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        `[  ${this.shortcutKey.toUpperCase()}  ] `
      );
      this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      this.renderer.insertBefore(
        this.el.nativeElement.parentNode,
        this.shortcutSpan,
        this.el.nativeElement
      );
    }
  }

  getShortcut() {
    this.shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    this.shortcutKey = (
      this.shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();
  }

  getShortcutClass(): string {
    if (this.shortcut.startsWith('(')) return 'ctrl-shortcut-input';
    if (this.shortcut.startsWith('[')) return 'alt-shortcut-input';
    if (this.shortcut.startsWith('{')) return 'ctrl-alt-shortcut-input';
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
        (shortcutClass === 'ctrl-shortcut-input' && event.ctrlKey) ||
        (shortcutClass === 'alt-shortcut-input' && event.altKey) ||
        (shortcutClass === 'ctrl-alt-shortcut-input' &&
          event.ctrlKey &&
          event.altKey)
      ) {
        this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
      }
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (this.shortcutSpan) {
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
    }
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
