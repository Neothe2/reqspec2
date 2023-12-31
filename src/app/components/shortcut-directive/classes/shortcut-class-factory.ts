import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ShortcutClass } from '../interface/shortcutClass.interface';
import { ButtonShortcut } from './button-shortcut.class';
import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { InputShortcut } from './input-shortcut.class';
import { ListCardShortcut } from './list-shortcut.class';
import { AccordionShortcut } from './accordion-shortcut.class';

export class ShortcutClassFactory {
  private shortcutClasses = [
    ButtonShortcut,
    InputShortcut,
    ListCardShortcut,
    AccordionShortcut,
  ];
  constructor() {}

  public createShortcutClass(
    tagName: string,
    el: ElementRef,
    renderer: Renderer2,
    shortcutService: ShortcutService
  ): ShortcutClass | null {
    for (let shortcutClass of this.shortcutClasses) {
      if (shortcutClass.tagName == tagName) {
        return new shortcutClass(el, renderer, shortcutService);
      }
    }
    return null;
  }
}
