const express = require('express'),
 bodyParser = require('body-parser'),
 exphbs = require('express-handlebars'),
 path = require('path'),
 nodemailer = require('nodemailer'),
 Buffer = require('buffer').Buffer //ПОПЫТКА ОТПРАВИТЬ С ПОМОЩЬЮ ЭТОГО
 fs = require('fs'), //ПОПЫТКА ОТПРАВИТЬ С ПОМОЩЬЮ ЭТОГО ПОПРОБЫВАТЬ РАБОТАТЬ С CID ПРИЛОИТЬ ЕГО К КАРТИНКЕ В HTML
 app = express();


// Установка движка
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Статическая папка
app.use('../client/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('contact.handlebars', {layout: false});
  //, {layout: false, favicon: false}
  // const highScores = app.highScores;
});

app.post('/send', (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Phone: ${req.file}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'o16661o@mail.ru', // generated ethereal user
      pass: 'Ae484135'  // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <o16661o@mail.ru>', // sender address
    to: 'kotau.alexander@gmail.com', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output + 'Embedded image: <img src="cid:unique@kreata.ee"/>', // html body
    attachments: [
      // { filename: '${req.body.img}' },
      {
        // filename: 'image1.jpg',
        // path: __dirname +'/views/image1.jpg',
        // contents: new Buffer('base64', req.files), //ПОПЫТКА ОТПРАВИТЬ С ПОМОЩЬЮ ЭТОГО
        // path: __dirname + `${req.body.img}`,
        path: "path",

        cid: 'unique@kreata.ee' //  same cid value as in the html img src
      },
      // { path: 'data:text/image;base64,QmFzZTY0IG1lc3NhZ2U=' },
      // {
      //   raw: `
      //     Content-Type: text/image
      //     Content-Disposition: attachment;
      //
      //     Message from file.
      //   `,
      // },
    ]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Message sent: %s', req.body); //ПОПЫТКА ОТПРАВИТЬ С ПОМОЩЬЮ ЭТОГО
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg: 'Email has been sent'});
  });
});

app.listen(3000, () => console.log('Server started...'));