export interface ShortcutClass {
  // Initializes the shortcut, setting up any necessary event listeners
  afterViewInit(): void;

  addShortcutToHeader(): void;

  getShortcutClass(): string;

  getShortcutString(): string;

  // Handles the keydown event
  handleKeyDown(event: KeyboardEvent): void;

  // Handles the keyup event
  handleKeyUp(event: KeyboardEvent): void;

  // Cleans up any resources (e.g., event listeners) when the directive is destroyed
  onDestroy(): void;
}
