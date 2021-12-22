import { Component, State, h } from '@stencil/core';
import { Note } from '../../interfaces/note';
import { NotesService } from '../services/notes';

import { alertController } from '@ionic/core';
@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() notes: Note[] = [];
  public navCtrl = document.querySelector('ion-router');
  async componentDidLoad() {
    this.navCtrl.addEventListener('ionRouteDidChange', async () => {
      this.notes = [...(await NotesService.load())];
    });
  }
  async addNote() {
    const alert: HTMLIonAlertElement = await alertController.create({
      header: 'New Note',
      message: 'What should the title of this note be?',
      inputs: [
        {
          type: 'text',
          name: 'title',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: async data => {
            NotesService.createNote(data.title);
            this.notes = [...(await NotesService.load())];
          },
        },
      ],
    });
    alert.present();
  }
  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Notes</ion-title>
          <ion-buttons slot="end">
            <ion-button onClick={() => this.addNote()}>
              <ion-icon slot="icon-only" name="clipboard" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-list>
          {this.notes.map(note => (
            <ion-item button detail href={`/notes/${note.idKey}`} routerDirection="forward">
              <ion-label>{note.title}</ion-label>
            </ion-item>
          ))}
        </ion-list>
      </ion-content>,
    ];
  }
}
