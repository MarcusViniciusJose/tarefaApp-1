import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, Form} from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuarios';
import { UsuarioService } from '../services/usuario.service';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})




export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagens_validacao = {
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!'},
      { tipo: 'email', mensagem: 'E-mail inválido!' }
    ], 
    senha: [
      {tipo: 'required', mensagem: 'O campo senha é obrigatório!'},
      {tipo: 'minLength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'}
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
    confirmar: [
      {tipo: 'required', mensagem: 'O campo confirmar é obrigatório!'},
      {tipo: 'minLength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'},
      {tipo: 'comparacao', mensagem: 'Deve ser igual a senha!'}
    
    ],
   };
 
   
  
   constructor(
     private formBuilder: FormBuilder,
     private usuarioService: UsuarioService,
     private router: Router,
     public alertController: AlertController) { 
     this.formRegistro = formBuilder.group({
       email: ['', Validators.compose([Validators.required, Validators.email])],
       senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
       nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
       data: ['', Validators.compose([Validators.required])],
       cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(16), CpfValidator.cpfValido])],
       genero: ['', Validators.compose([Validators.required])],
       celular: ['', Validators.compose([Validators.required, Validators.maxLength(13)])], 
       confirmar: ['', Validators.compose([Validators.required, Validators.minLength(6) ])],
        },

        {
          validator: ComparacaoValidator('senha', 'confirmar')
        });
   }
   
     
   async ngOnInit() {
    await this.usuarioService.buscarTodos();
    console.log(this.usuarioService.listarUsuarios);
 }

 public async salvarFormulario(){
   if(this.formRegistro.valid){

     let usuario = new Usuario();
     usuario.nome= this.formRegistro.value.nome;
     usuario.cpf = this.formRegistro.value.cpf;
     usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
     usuario.genero = this.formRegistro.value.genero;
     usuario.celular = this.formRegistro.value.celular;
     usuario.email = this.formRegistro.value.email;
     usuario.senha = this.formRegistro.value.senha;


     if(await this.usuarioService.salvar(usuario)){
       this.exibirAlerta('SUCESSO!', 'Usuario salvo com sucesso');
       this.router.navigateByUrl('/login');
     }else{
       this.exibirAlerta('ERRO', 'Usuário salvo com ');
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
 
  

  

  public registrar(){
    if(this.formRegistro.valid){
        console.log('formulário válido!');
        this.router.navigateByUrl('/login');
    }else{
      console.log('formulário inválido.')
    }
}
}
