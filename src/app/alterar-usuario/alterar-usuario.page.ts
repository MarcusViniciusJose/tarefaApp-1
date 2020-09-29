import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, Form} from '@angular/forms';
import { Usuario } from '../models/Usuarios';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagens_validacao = {
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!'},
      { tipo: 'email', mensagem: 'E-mail inválido!' }
    ], 
    nome: [
      {tipo: 'required', mensagem: 'O campo nome é obrigatório!'},
      {tipo: 'minLength', mensagem: 'Deve ter pelo menos 3 caracteres!'},
      {tipo: 'maxLength', mensagem: 'Deve ter no maximo 14!'}
    ],
    cpf: [
      {tipo: 'required', mensagem: 'O campo cpf é obrigatório!'},
      {tipo: 'maxLength', mensagem: 'Deve ter pelo menos 11 caracteres!'},
      {tipo: 'minLength', mensagem: 'Deve ter no maximo 14!'},
      {tipo: 'invalido', mensagem: 'CPF invalido!'}
    ],
    data: [
      {tipo: 'required', mensagem: 'O campo data é obrigatório!'},
    ],
    genero: [
      {tipo: 'required', mensagem: 'O campo genero é obrigatório!'},
    ],
    celular: [
      {tipo: 'required', mensagem: 'O campo celular é obrigatório!'},
      {tipo: 'maxLength', mensagem: 'Deve ter no maximo 18 caracteres!'}
    ],
   
   };

    private usuario: Usuario;

    private manterLogadoTemp: boolean;

  constructor(private formBuilder: FormBuilder,
     private usuarioService: UsuarioService,
     private router: Router,
     public alertController: AlertController) {
     
      this.formAlterar = formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        data: ['', Validators.compose([Validators.required])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(16), CpfValidator.cpfValido])],
        genero: ['', Validators.compose([Validators.required])],
        celular: ['', Validators.compose([Validators.required, Validators.maxLength(13)])],       
      });


      this.preencherFomulario();
    }
    
      
    

  ngOnInit() {
  }

  public async preencherFomulario(){
    this.usuario = await this.usuarioService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({dataNascimento: this.usuario.dataNascimento.toISOString()});
  }


  public async salvar(){
    if(this.formAlterar.valid){
      this.usuario.nome = this.formAlterar.value.nome;
      this.usuario.dataNascimento = new Date(this.formAlterar.value.dataNascimento);
      this.usuario.genero = this.formAlterar.value.genero;
      this.usuario.celular = this.formAlterar.value.celular;
      this.usuario.email = this.formAlterar.value.email;

      if(await this.usuarioService.alterar(this.usuario)){
        this.usuario.manterLogado = this.manterLogadoTemp;
        this.usuarioService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta("SUCESSO!", "Usuario alterado com sucesso!");
        this.router.navigateByUrl("/configuracoes");
      }
      
    }else{
      this.exibirAlerta('ADVERTENCIA!', 'Formulário inválido<br/>Verefique os campos do seu formulário');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
 
    await alert.present();
  }
}
