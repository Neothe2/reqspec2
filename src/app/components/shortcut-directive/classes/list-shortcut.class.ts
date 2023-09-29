import { ShortcutClass } from '../interface/shortcutClass.interface';

class ListShortcut implements ShortcutClass {
  constructor() {}
  afterViewInit(): void {}
  addShortcutToHeader(): void {}
  getShortcutClass(): string {
    return '';
  }
  getShortcutString(): string {
    return '';
  }
  handleKeyDown(event: KeyboardEvent): void {}
  handleKeyUp(event: KeyboardEvent): void {}
  onDestroy(): void {}
}
