import { ElementRef, Renderer2 } from '@angular/core';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

export class ListCardShortcut implements ShortcutClass {
  private el: ElementRef;
  private renderer: Renderer2;
  shortcut: string = '';
  selectedIdx: number = 0;
  static tagName = 'ion-card';
  ionItems!: NodeListOf<HTMLElement>;
  subscription: any;
  shortcutSpan: any;
  shortcutKey: any;
  keyInLabel: boolean = false;

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    this.el = el;
    this.renderer = renderer;
  }
  handleKeyUp(event: KeyboardEvent): void {
    this.renderer.removeClass(this.shortcutSpan, 'active');
    if (!this.keyInLabel) {
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
    }
  }

  afterViewInit(): void {
    this.shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    this.shortcutKey = (
      this.shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toLowerCase();
    this.addShortcutToHeader();
    this.ionItems = this.el.nativeElement.querySelectorAll('ion-item');
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      if (keyInfo.toLowerCase() === this.getShortcutString().toLowerCase()) {
        this.focusThisCard();
        this.selectFirstItem();
      }
    });
  }

  focusThisCard(): void {
    // Remove focus from all cards
    const allCards = document.querySelectorAll('ion-card');
    allCards.forEach((card) => {
      this.renderer.removeClass(card, 'focused-card');
    });

    // Add focus to this card
    this.renderer.addClass(this.el.nativeElement, 'focused-card');
  }

  isThisCardFocused(): boolean {
    return this.el.nativeElement.classList.contains('focused-card');
  }

  handleKeyDown(event: KeyboardEvent): void {
    const shortcutClass = this.getShortcutClass();
    this.ionItems = this.el.nativeElement.querySelectorAll('ion-item');

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
        if (!this.keyInLabel) {
          this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
        }
      }
    }
    if (this.isThisCardFocused()) {
      if (event.key === 'ArrowUp') {
        this.selectPreviousItem();
      } else if (event.key === 'ArrowDown') {
        this.selectNextItem();
      } else if (event.key === 'ArrowRight') {
        this.clickSelectedItemButton();
      } else if (event.key === 'Enter') {
        this.clickSelectedItem();
      }
    }
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

  selectFirstItem(): void {
    this.selectedIdx = 0;
    this.ionItems = this.el.nativeElement.querySelectorAll('ion-item');
    this.highlightSelectedItem();
  }

  selectNextItem(): void {
    if (this.selectedIdx < this.ionItems.length - 1) {
      this.selectedIdx++;
      this.highlightSelectedItem();
    }
  }

  selectPreviousItem(): void {
    if (this.selectedIdx > 0) {
      this.selectedIdx--;
      this.highlightSelectedItem();
    }
  }

  highlightSelectedItem(): void {
    this.ionItems.forEach((item, index) => {
      if (index === this.selectedIdx) {
        this.renderer.addClass(item, 'selected');
      } else {
        this.renderer.removeClass(item, 'selected');
      }
    });
  }

  clickSelectedItem(): void {
    this.ionItems[this.selectedIdx]?.click();
  }

  clickSelectedItemButton(): void {
    const button = this.ionItems[this.selectedIdx]?.querySelector('ion-button');
    if (button) {
      button.click();
    }
  }

  //   addShortcutToHeader(): void {
  //     const cardHeader = this.el.nativeElement.querySelector('ion-card-header');
  //     const shortcutSpan = this.renderer.createElement('span');
  //     const shortcutString = `[${this.getShortcutString()}]`;
  //     this.renderer.setProperty(shortcutSpan, 'innerText', shortcutString);
  //     this.renderer.addClass(shortcutSpan, this.getShortcutClass());
  //     this.renderer.appendChild(cardHeader, shortcutSpan);
  //   }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  addShortcutToHeader(): void {
    // Since the native element is ion-card, we directly look for ion-card-title inside ion-card-header
    const cardTitleElem = this.el.nativeElement.querySelector(
      'ion-card-header ion-card-title'
    );

    let titleText = cardTitleElem ? cardTitleElem.innerText : '';

    if (titleText.toLowerCase().includes(this.shortcutKey)) {
      this.keyInLabel = true;
      const index = titleText.toLowerCase().indexOf(this.shortcutKey);
      const before = titleText.substring(0, index);
      const after = titleText.substring(index + 1);

      this.shortcutSpan = this.renderer.createElement('span');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        titleText[index]
      );
      this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());

      this.renderer.setProperty(cardTitleElem, 'innerHTML', '');
      this.renderer.appendChild(
        cardTitleElem,
        this.renderer.createText(before)
      );
      this.renderer.appendChild(cardTitleElem, this.shortcutSpan);
      this.renderer.appendChild(cardTitleElem, this.renderer.createText(after));
    } else {
      const after = titleText;
      this.shortcutSpan = this.renderer.createElement('span');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        `(${this.shortcutKey.toUpperCase()})`
      );
      this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');

      this.renderer.setProperty(cardTitleElem, 'innerHTML', '');
      this.renderer.setStyle(this.shortcutSpan, 'padding-left', '5px');
      this.renderer.appendChild(cardTitleElem, this.renderer.createText(after));
      this.renderer.appendChild(cardTitleElem, this.shortcutSpan);
    }
  }
}
