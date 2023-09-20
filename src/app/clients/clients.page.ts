import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http/http.service';
import { AddEditClientModalComponent } from '../components/add-edit-client-modal/add-edit-client-modal.component';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShortcutService } from '../services/shortcut/shortcut.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  clients: any[] = [];

  constructor(
    private http: HttpService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private shortcutService: ShortcutService
  ) {
    this.getClients();
  }

  getClients() {
    this.http.get('api/clients/').then((data: any) => {
      this.clients = data.results;
    });
  }

  ngOnInit() {}

  navigateToDetail(client: any) {
    this.router.navigateByUrl(`clients/detail/${client.id}`);
  }

  // constructor(private modalController: ModalController) {}

  async openAddClientModal() {
    const modal = await this.modalController.create({
      component: AddEditClientModalComponent,
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        // console.log('Client Name from Modal:', data.data);
        this.http.post('api/clients/', { name: data.data }).then(() => {
          this.getClients();
        });
      }
    });

    return await modal.present();
  }

  async openActionSheet(client: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.openEditClientModal(client);
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteClient(client.id);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async openEditClientModal(client: any) {
    const modal = await this.modalController.create({
      component: AddEditClientModalComponent,
      componentProps: { defaultName: client.name },
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        // console.log('Client Name from Modal:', data.data);
        this.http
          .patch('api/clients/' + client.id + '/', { name: data.data })
          .then(() => {
            this.getClients();
          });
      }
    });

    return await modal.present();
  }

  deleteClient(id: number) {
    this.http.delete('api/clients/' + id).then(() => {
      this.getClients();
    });
  }
}
