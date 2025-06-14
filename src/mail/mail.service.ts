import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    console.log('1111111', this.configService.get<string>('SMTP'));
    console.log('2222222', this.configService.get<string>('PORT'));
    console.log('3333333', this.configService.get<string>('EMAIL_USER'));
    console.log('4444444', this.configService.get<string>('EMAIL_PASS'));

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SMTP_SERVER'),
      port: Number(this.configService.get<string>('EMAIL_SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendConfirmationEmail(note: any) {
    console.log('EMAIL ENVIADO >>>>', note.email_key);

    const html = `
      <h2>✅ Confirmação de recebimento da nota</h2>
      <p>Recebemos os seguintes dados com sucesso:</p>

      <ul>
        <li><strong>ID:</strong> ${note.id}</li>
        <li><strong>Anotação:</strong> ${note.annotation}</li>
        <li><strong>Latitude:</strong> ${note.latitude}</li>
        <li><strong>Longitude:</strong> ${note.longitude}</li>
        <li><strong>Data e hora (datetime):</strong> ${new Date(note.datetime).toLocaleString()}</li>
      </ul>

      <p>Obrigado por utilizar nosso serviço.</p>
    `;

    await this.transporter.sendMail({
      from: '"Checkplant Moleskine App" <seuemail@gmail.com>',
      to: note.email_key,
      subject: 'Dados recebidos com sucesso!',
      text: 'Confirmamos que suas anotações foram recebidas pelo servidor.',
      html,
    });
  }
}
