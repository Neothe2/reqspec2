import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { ShortcutService } from '../../services/shortcut/shortcut.service';
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

      // Subscribe to the shortcut observable
      this.subscription = this.shortcutService.shortcut$.subscribe(
        (keyInfo) => {
          const shortcut =
            this.el.nativeElement.getAttribute('keyboard-shortcut');
          if (
            keyInfo.toLowerCase() ===
            this.getShortcutString(shortcut.toLowerCase())
          ) {
            this.focusedElementIndex = 0; // Focus on the first element
            this.focusOnElement();

            // Manually trigger the focus and blur events to get the desired visual effect
            // this.listItems![this.focusedElementIndex].blur();
            // this.listItems![this.focusedElementIndex].focus();
          }
        }
      );
    } else if (tagName === 'ion-accordion') {
      // Logic for ion-accordion
      let accordionHeader = this.el.nativeElement.querySelector('ion-item');
      this.addShortcutToAccordionHeader(accordionHeader);
      const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
      this.buttonText = this.el.nativeElement.innerText;
      this.shortcutKey = (
        shortcut?.replace(/[()\[\]{}]/g, '') || ''
      ).toLowerCase();
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
    }
    this.subscription = this.shortcutService.shortcut$.subscribe((keyInfo) => {
      console.log(keyInfo);
      const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
      let shortcutString = this.getShortcutString(shortcut.toLowerCase());
      if (
        keyInfo.toLowerCase() == this.getShortcutString(shortcut.toLowerCase())
      ) {
        if (tagName == 'ion-button' || tagName == 'button') {
          this.el.nativeElement.click();
        }
        if (tagName == 'ion-accordion') {
          this.toggleAccordion();
        }
      }
    });
  }

  private toggleAccordion(): void {
    const accordion = this.el.nativeElement;
    const isOpen = accordion.getAttribute('accordion-expanded') === 'true'; // Replace with the actual attribute that indicates if the accordion is open
    if (isOpen) {
      accordion.setAttribute('accordion-expanded', 'false'); // Replace with the actual method to close the accordion
      accordion.setAttribute('accordion-collapsed', 'true'); // Replace with the actual method to close the accordion
    } else {
      accordion.setAttribute('accordion-collapsed', 'false'); // Replace with the actual method to close the accordion
      accordion.setAttribute('accordion-expanded', 'true'); // Replace with the actual method to close the accordion
    }
  }

  private addShortcutToCardHeader(): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    const shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toUpperCase();
    this.shortcutKey = shortcutKey;
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

      let actionSheet = document.querySelector('ion-action-sheet');
      let actionSheetOpen = actionSheet ? true : false;

      if (!this.listItems) {
        this.listItems = this.el.nativeElement.querySelectorAll('ion-item');
      }

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
            this.listItems!.length - 1,
            this.focusedElementIndex + 1
          );
          this.focusOnElement();
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();

        // Get the focused element within the ion-item
        const focusedButton =
          this.listItems![this.focusedElementIndex].querySelector('ion-button');

        // Check if the focused element is the same as the element at the selected index
        if (document.activeElement === focusedButton) {
          this.listItems![this.focusedElementIndex].click();
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
        !(this.focusedElementIndex == this.listItems!.length - 1)
      ) {
        if (!actionSheetOpen && this.isFocusedElementInList()) {
          this.focusedElementIndex = Math.min(
            this.listItems!.length - 1,
            this.focusedElementIndex + 1
          );
          this.focusOnElement();
        }
      }
    } else if (tagName === 'ion-accordion') {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        // Add any additional logic here if needed
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        // Add any additional logic here if needed
      }
    }
  }

  private addShortcutToAccordionHeader(accordionHeader: HTMLElement): void {
    const shortcut = this.el.nativeElement.getAttribute('keyboard-shortcut');
    const shortcutKey = (
      shortcut?.replace(/[()\[\]{}]/g, '') || ''
    ).toUpperCase();
    const shortcutSpan = this.renderer.createElement('span');
    this.renderer.setProperty(shortcutSpan, 'innerText', `[${shortcutKey}]`);
    this.renderer.addClass(shortcutSpan, 'hidden-shortcut');
    this.renderer.appendChild(accordionHeader, shortcutSpan);
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

  private isFocusedElementInList(): boolean {
    const focusedElement = document.activeElement as HTMLElement;
    if (this.listItems && focusedElement) {
      let listItems = Array.from(this.listItems);
      for (let listItem of listItems) {
        if (
          listItem.querySelector('ion-buttons')?.querySelector('ion-button') ==
          focusedElement
        ) {
          return true;
        }
      }
    }
    return false;
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
