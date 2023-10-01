import { ElementRef, Renderer2 } from '@angular/core';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';

export class ListShortcut implements ShortcutClass {
  private el: ElementRef;
  private renderer: Renderer2;
  static readonly tagName: string = 'ion-card';
  private shortcut: any;
  private shortcutKey: any;
  private shortcutSpan: any;
  private subscription: any;
  private keyInLabel: boolean = false;
  private cardHeader: any;
  private cardListItems: any;
  private focusedElementIndex: number = -1;
  buttonText: any;
  cardTitleText: any;

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private shortcutService: ShortcutService
  ) {
    this.el = el;
    this.renderer = renderer;
  }

  afterViewInit(): void {
    // Logic for ion-card
    this.cardHeader = this.el.nativeElement.querySelector('ion-card-header');
    this.cardListItems = this.el.nativeElement.querySelectorAll('ion-item');
    this.addShortcutToHeader();
    this.createSubscription();

    // Subscribe to the shortcut observable
  }

  createSubscription(): void {
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      this.shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
      let shortcutString = this.getShortcutString();
      if (keyInfo.toLowerCase() === shortcutString.toLowerCase()) {
        this.focusedElementIndex = Math.min(
          this.cardListItems!.length - 1,
          this.focusedElementIndex + 1
        );
        this.focusOnElement();

        // Manually trigger the focus and blur events to get the desired visual effect
        // this.listItems![this.focusedElementIndex].blur();
        // this.listItems![this.focusedElementIndex].focus();
      }
    });
  }
  focusOnElement() {
    if (this.focusedElementIndex >= 0 && this.cardListItems) {
      this.cardListItems.forEach((item: any, index: any) => {
        if (index === this.focusedElementIndex) {
          this.renderer.addClass(item, 'focused');
          this.renderer.setAttribute(item, 'tabindex', '0');
          item.blur();
          setTimeout(() => {
            item.focus();
            // item.blur();
            // setTimeout(() => {
            //   item.focus();
            // }, 0);
          }, 0);
        } else {
          this.renderer.removeClass(item, 'focused');
          this.renderer.removeAttribute(item, 'tabindex');
        }
      });
    }
  }

  addShortcutToHeader(): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    this.shortcut = shortcut;
    const shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toUpperCase();
    this.shortcutKey = shortcutKey.toUpperCase();

    // Get the existing title from ion-card-header
    const cardTitleElem = this.cardHeader.querySelector('ion-card-title'); // adjust your selector as needed
    this.cardTitleText = cardTitleElem ? cardTitleElem.innerText : '';

    // Check if the shortcut key is present in the card title text
    if (
      this.cardTitleText.toLowerCase().includes(this.shortcutKey.toLowerCase())
    ) {
      this.keyInLabel = true;
      const index = this.cardTitleText
        .toLowerCase()
        .indexOf(this.shortcutKey.toLowerCase());
      const beforeText = this.cardTitleText.substring(0, index);
      const afterText = this.cardTitleText.substring(index + 1);
      this.shortcutSpan = this.renderer.createElement('span');

      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        this.cardTitleText[index]
      );

      // Add a specific class for styling
      this.renderer.addClass(this.shortcutSpan, this.getShortcutClass());

      // Clear the existing title and append the modified one
      this.renderer.setProperty(cardTitleElem, 'innerHTML', '');
      this.renderer.appendChild(
        cardTitleElem,
        this.renderer.createText(beforeText)
      );
      this.renderer.appendChild(cardTitleElem, this.shortcutSpan);
      this.renderer.appendChild(
        cardTitleElem,
        this.renderer.createText(afterText)
      );
    } else {
      // Fallback behavior: Add a span containing the shortcut key
      this.shortcutSpan = this.renderer.createElement('span');
      this.renderer.setProperty(
        this.shortcutSpan,
        'innerText',
        `[${shortcutKey}]`
      );
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      this.renderer.appendChild(this.cardHeader, this.shortcutSpan);
    }
  }

  getShortcut(): void {
    // Implementation
  }

  getShortcutClass(): string {
    if (this.shortcut) {
      if (this.shortcut.startsWith('(')) return 'ctrl-shortcut-button';
      if (this.shortcut.startsWith('[')) return 'alt-shortcut-button';
      if (this.shortcut.startsWith('{')) return 'ctrl-alt-shortcut-button';
    }

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
    // Logic for list items

    let actionSheet = document.querySelector('ion-action-sheet');
    let actionSheetOpen = actionSheet ? true : false;

    this.cardListItems = this.el.nativeElement.querySelectorAll('ion-item');

    if (event.key === 'ArrowUp') {
      if (!actionSheetOpen) {
        event.preventDefault();
        this.focusedElementIndex = Math.max(0, this.focusedElementIndex - 1);
        this.focusOnElement();
      }
    } else if (event.key === 'ArrowDown') {
      if (!actionSheetOpen) {
        event.preventDefault();

        this.focusedElementIndex = Math.min(
          this.cardListItems!.length - 1,
          this.focusedElementIndex + 1
        );
        this.focusOnElement();
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();

      // Get the focused element within the ion-item
      const focusedButton =
        this.cardListItems![this.focusedElementIndex].querySelector(
          'ion-button'
        );

      // Check if the focused element is the same as the element at the selected index
      if (document.activeElement === focusedButton) {
        this.cardListItems![this.focusedElementIndex].click();
      }
    } else if (event.key === 'Tab' && event.shiftKey) {
      if (
        !actionSheetOpen &&
        this.isFocusedElementInList() &&
        !(this.focusedElementIndex == 0)
      ) {
        this.focusedElementIndex = Math.max(0, this.focusedElementIndex - 1);
        this.focusOnElement();
      }
    } else if (
      event.key === 'Tab' &&
      !event.shiftKey &&
      !(this.focusedElementIndex == this.cardListItems!.length - 1)
    ) {
      if (!actionSheetOpen && this.isFocusedElementInList()) {
        this.focusedElementIndex = Math.min(
          this.cardListItems!.length - 1,
          this.focusedElementIndex + 1
        );
        this.focusOnElement();
      }
    } else if (event.key === 'Alt' || event.key === 'Control') {
      if (!this.keyInLabel) {
        this.toggleShortcutVisibility(true);
      } else {
        this.renderer.addClass(this.shortcutSpan, 'active');
      }
    }
  }
  isFocusedElementInList(): boolean {
    const focusedElement = document.activeElement as HTMLElement;
    if (this.cardListItems && focusedElement) {
      let cardListItems = Array.from(this.cardListItems);
      for (let listItem of cardListItems) {
        if (
          (listItem as any)
            .querySelector('ion-buttons')
            ?.querySelector('ion-button') == focusedElement
        ) {
          return true;
        }
      }
    }
    return false;
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (this.shortcutSpan) {
      event.preventDefault();
      this.renderer.removeClass(this.shortcutSpan, 'active');
      if (
        !this.cardTitleText
          .toLowerCase()
          .includes(this.shortcutKey.toLowerCase())
      ) {
        this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
      }
    }
  }

  toggleShortcutVisibility(show: boolean): void {
    if (show) {
      this.renderer.removeClass(this.shortcutSpan, 'hidden-shortcut');
    } else {
      this.renderer.addClass(this.shortcutSpan, 'hidden-shortcut');
    }
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
