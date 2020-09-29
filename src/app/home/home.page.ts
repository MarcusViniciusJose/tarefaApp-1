import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public alertController: AlertController,
    private usuarioService: UsuarioService,
    private router: Router, ) { }


  async ionViewWillEnter() {
    const usuarioLogado = await this.usuarioService.buscarUsuarioLogado();
    if (!usuarioLogado) {
      this.router.navigateByUrl('/login');
    }
  }


  async exibirAlertLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmação!',
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        }, {
          text: 'Sim, desejo sair!',
          handler: () => {
            this.usuarioService.removerUsuarioLogado();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });

    await alert.present();
  }

}
