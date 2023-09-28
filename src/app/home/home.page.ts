import { Component } from '@angular/core';
import { ShortcutService } from '../services/shortcut/shortcut.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private shortcutSubscription!: Subscription;

  constructor(private shortcutService: ShortcutService) {}

  ngOnInit(): void {
    this.shortcutSubscription = this.shortcutService.shortcut$.subscribe(
      (shortcut) => {
        // if (shortcut) {
        //   console.log(`Pressed: ${shortcut}`);
        //   if (shortcut == 'Ctrl Alt h') {
        //     let button = document.getElementById('hello') as HTMLButtonElement;
        //     button.click();
        //   }
        // }
      }
    );
  }

  ngOnDestroy(): void {
    this.shortcutSubscription.unsubscribe();
  }

  hello() {
    let text = (document.getElementById('input') as HTMLInputElement).value;
    console.log(text);
  }
}
